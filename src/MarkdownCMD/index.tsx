import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import HighReactMarkdown from '../components/HighReactMarkdown/index.js';
import classNames from 'classnames';
import { AnswerType, IParagraph, MarkdownProps } from '../defined.js';

type MarkdownCMDProps = MarkdownProps;

interface IChar {
  content: string;
  answerType: AnswerType;
}

export interface MarkdownRef {
  push: (content: string, answerType: AnswerType) => void;
  clear: () => void;
}
const MarkdownCMD = forwardRef<MarkdownRef, MarkdownCMDProps>(({ interval = 30, isClosePrettyTyped = false, onEnd, onStart }, ref) => {
  /** 当前需要打字的内容 */
  const charsRef = useRef<IChar[]>([]);

  /** 已经打过的字 */
  const typedCharsRef = useRef<{ typedContent: string; answerType: AnswerType } | undefined>(undefined);
  /** 是否卸载 */
  const isUnmountRef = useRef(false);
  /** 是否正在打字 */
  const isTypedRef = useRef(false);

  /** 打字结束回调, */
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  /** 打字开始回调 */
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stableParagraphs, setStableParagraphs] = useState<IParagraph[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState<IParagraph | undefined>(undefined);
  const currentParagraphRef = useRef<IParagraph | undefined>(undefined);
  currentParagraphRef.current = currentParagraph;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isTypedRef.current = false;
  };

  useEffect(() => {
    isUnmountRef.current = false;
    return () => {
      isUnmountRef.current = true;
    };
  }, []);

  const thinkingParagraphs = useMemo(() => stableParagraphs.filter((paragraph) => paragraph.answerType === 'thinking'), [stableParagraphs]);
  const answerParagraphs = useMemo(() => stableParagraphs.filter((paragraph) => paragraph.answerType === 'answer'), [stableParagraphs]);

  const recordTypedChars = (char: IChar) => {
    let prevStr = '';
    if (!typedCharsRef.current || typedCharsRef.current.answerType !== char.answerType) {
      typedCharsRef.current = {
        typedContent: char.content,
        answerType: char.answerType,
      };
    } else {
      prevStr = typedCharsRef.current.typedContent;
      typedCharsRef.current.typedContent += char.content;
    }

    return {
      prevStr,
      nextStr: typedCharsRef.current?.typedContent || '',
    };
  };

  /**
   * 触发打字开始回调
   * @param char 当前字符
   */
  const triggerOnStart = (char: IChar) => {
    const onStartFn = onStartRef.current;
    if (!onStartFn) {
      return;
    }
    const { prevStr } = recordTypedChars(char);
    onStartRef.current?.({
      currentIndex: prevStr.length,
      currentChar: char.content,
      answerType: char.answerType,
      prevStr,
    });
  };

  /**
   * 触发打字结束回调
   */
  const triggerOnEnd = () => {
    const onEndFn = onEndRef.current;
    if (!onEndFn) {
      return;
    }

    onEndFn({
      str: typedCharsRef.current?.typedContent,
      answerType: typedCharsRef.current?.answerType,
    });
  };

  const startTypedTask = () => {
    if (isTypedRef.current) {
      return;
    }

    const chars = charsRef.current;

    const firstChar = chars[0];
    if (firstChar) {
      triggerOnStart(firstChar);
    }

    const stopTyped = () => {
      isTypedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      triggerOnEnd();
    };

    function nextTyped() {
      if (chars.length === 0) {
        stopTyped();
        return;
      }
      timerRef.current = setTimeout(startTyped, interval);
    }

    function startTyped() {
      if (isUnmountRef.current) {
        return;
      }
      isTypedRef.current = true;

      const char = chars.shift();
      if (char === undefined) {
        stopTyped();
        return;
      }
      recordTypedChars(char);
      const currentParagraph = currentParagraphRef.current;
      /** 如果碰到 则需要处理成两个段落 */
      if (char.content === '\n\n') {
        if (currentParagraph) {
          setStableParagraphs((prev) => {
            const newParagraphs = [...prev];
            if (currentParagraph) {
              newParagraphs.push({ ...currentParagraph, isTyped: false });
            }
            newParagraphs.push({
              content: '',
              isTyped: false,
              type: 'br',
              answerType: char.answerType,
            });
            return newParagraphs;
          });
          setCurrentParagraph(undefined);
        } else {
          setStableParagraphs((prev) => {
            const newParagraphs = [...prev];
            newParagraphs.push({
              content: '',
              isTyped: false,
              type: 'br',
              answerType: char.answerType,
            });
            return newParagraphs;
          });
        }
        nextTyped();
        return;
      }

      // 处理当前段落
      let _currentParagraph = currentParagraph;
      const newCurrentParagraph: IParagraph = {
        content: '',
        isTyped: false,
        type: 'text',
        answerType: char.answerType,
      };

      if (!_currentParagraph) {
        // 如果当前没有段落，则直接设置为当前段落
        _currentParagraph = newCurrentParagraph;
      } else if (currentParagraph && currentParagraph?.answerType !== char.answerType) {
        // 如果当前段落和当前字符的回答类型不一致，则需要处理成两个段落
        setStableParagraphs((prev) => {
          const newParagraphs = [...prev];
          newParagraphs.push({ ...currentParagraph, isTyped: false });
          return newParagraphs;
        });
        _currentParagraph = newCurrentParagraph;
        setCurrentParagraph(_currentParagraph);
      }

      setCurrentParagraph((prev) => {
        return {
          ..._currentParagraph,
          content: (prev?.content || '') + char.content,
          isTyped: true,
        };
      });

      nextTyped();
    }

    startTyped();
  };

  useImperativeHandle(ref, () => ({
    push: (content: string, answerType: AnswerType) => {
      // 如果两个\n,则\n这两个字符要合一起，作为一个字符处理,并且把多个\n处理成一个\n
      const charsGroup = content.split('\n\n');
      charsGroup.forEach((chars, index) => {
        if (isClosePrettyTyped) {
          charsRef.current.push({ content: chars, answerType });
        } else {
          charsRef.current.push(...chars.split('').map((char) => ({ content: char, answerType })));
        }
        if (index !== charsGroup.length - 1) {
          charsRef.current.push({ content: '\n\n', answerType });
        }
      });

      if (!isTypedRef.current) {
        startTypedTask();
      }
    },
    clear: () => {
      clearTimer();
      charsRef.current = [];
      setStableParagraphs([]);
      setCurrentParagraph(undefined);
    },
  }));

  const getParagraphs = (paragraphs: IParagraph[], answerType: AnswerType) => {
    return (
      <div className={`ds-markdown-paragraph ds-typed-${answerType}`}>
        {paragraphs.map((paragraph, index) => {
          if (paragraph.type === 'br') {
            return null;
          }
          return <HighReactMarkdown key={index}>{paragraph.content || ''}</HighReactMarkdown>;
        })}
        {currentParagraph?.answerType === answerType && <HighReactMarkdown key={currentParagraph.content}>{currentParagraph.content || ''}</HighReactMarkdown>}
      </div>
    );
  };

  return (
    <div
      className={classNames({
        'ds-markdown': true,
        apple: true,
      })}
    >
      {(thinkingParagraphs.length > 0 || currentParagraph?.answerType === 'thinking') && <div className="ds-markdown-thinking">{getParagraphs(thinkingParagraphs, 'thinking')}</div>}
      {(answerParagraphs.length > 0 || currentParagraph?.answerType === 'answer') && <div className="ds-markdown-answer">{getParagraphs(answerParagraphs, 'answer')}</div>}
    </div>
  );
});

export default MarkdownCMD;
