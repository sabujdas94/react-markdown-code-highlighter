import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import HighReactMarkdown from '../components/HighReactMarkdown/index.js';
import classNames from 'classnames';
import { AnswerType, IParagraph, MarkdownProps } from '../defined.js';

type MarkdownCMDProps = MarkdownProps;

export interface MarkdownRef {
  push: (content: string, answerType: AnswerType) => void;
  clear: () => void;
}
const MarkdownCMD = forwardRef<MarkdownRef, MarkdownCMDProps>(({ interval = 30, isClosePrettyTyped = false, onEnd, onStart }, ref) => {
  const charsRef = useRef<{ content: string; answerType: AnswerType }[]>([]);
  const isTypedRef = useRef(false);

  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
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
    return () => {
      clearTimer();
    };
  }, []);

  function startTypedTask() {
    if (isTypedRef.current) {
      return;
    }

    const chars = charsRef.current;

    function nextTyped() {
      timerRef.current = setTimeout(startTyped, interval);
    }

    function startTyped() {
      isTypedRef.current = true;
      onStartRef.current?.();
      const char = chars.shift();
      if (char === undefined) {
        isTypedRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        onEndRef.current?.();
        return;
      }
      const currentParagraph = currentParagraphRef.current;
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
  }

  useImperativeHandle(ref, () => ({
    push: (content: string, answerType: AnswerType) => {
      // 如果朋友\n,则\n这两个字符要合一起，作为一个字符处理,并且把多个\n处理成一个\n
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

      // charsRef.current.push({ content: content, answerType });

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

  const thinkingParagraphs = stableParagraphs.filter((paragraph) => paragraph.answerType === 'thinking');
  const answerParagraphs = stableParagraphs.filter((paragraph) => paragraph.answerType === 'answer');

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
