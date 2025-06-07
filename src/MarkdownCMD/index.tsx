import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import HighReactMarkdown from '../components/HighReactMarkdown/index.js';
import classNames from 'classnames';
import { AnswerType, IParagraph, MarkdownProps } from '../defined.js';
import { __DEV__ } from '../constant.js';

type MarkdownCMDProps = MarkdownProps;

interface IChar {
  content: string;
  answerType: AnswerType;
}

export interface MarkdownRef {
  push: (content: string, answerType: AnswerType) => void;
  clear: () => void;
  triggerWholeEnd: () => void;
}
const MarkdownCMD = forwardRef<MarkdownRef, MarkdownCMDProps>(({ interval = 30, isClosePrettyTyped = false, onEnd, onStart, onTypedChar, theme }, ref) => {
  /** Current content to be typed */
  const charsRef = useRef<IChar[]>([]);

  /**
   * Whether typing is completely over
   * If typing is completely over, the typing effect will not be triggered again
   */
  const isWholeTypedEndRef = useRef(false);

  /** Already typed characters */
  const typedCharsRef = useRef<{ typedContent: string; answerType: AnswerType; prevStr: string } | undefined>(undefined);
  /** Whether the component is unmounted */
  const isUnmountRef = useRef(false);
  /** Whether typing is in progress */
  const isTypedRef = useRef(false);

  /** Typing end callback */
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  /** Typing start callback */
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;
  /** Typing character callback */
  const onTypedCharRef = useRef(onTypedChar);
  onTypedCharRef.current = onTypedChar;

  /** Typing timer */
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  /**
   * Stable paragraphs
   * Stable paragraphs are those that have been typed and will not change again
   */
  const [stableParagraphs, setStableParagraphs] = useState<IParagraph[]>([]);
  /** Current paragraph */
  const [currentParagraph, setCurrentParagraph] = useState<IParagraph | undefined>(undefined);
  /** Current paragraph reference */
  const currentParagraphRef = useRef<IParagraph | undefined>(undefined);
  currentParagraphRef.current = currentParagraph;

  /** Clear typing timer */
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

  /** Thinking paragraphs */
  const thinkingParagraphs = useMemo(() => stableParagraphs.filter((paragraph) => paragraph.answerType === 'thinking'), [stableParagraphs]);
  /** Answer paragraphs */
  const answerParagraphs = useMemo(() => stableParagraphs.filter((paragraph) => paragraph.answerType === 'answer'), [stableParagraphs]);

  /**
   * Record typed characters
   * @param char Current character
   * @returns
   */
  const recordTypedChars = (char: IChar) => {
    let prevStr = '';
    if (!typedCharsRef.current || typedCharsRef.current.answerType !== char.answerType) {
      typedCharsRef.current = {
        typedContent: char.content,
        answerType: char.answerType,
        prevStr: '',
      };
    } else {
      prevStr = typedCharsRef.current.typedContent;
      typedCharsRef.current.typedContent += char.content;
      typedCharsRef.current.prevStr = prevStr;
    }

    return {
      prevStr,
      nextStr: typedCharsRef.current?.typedContent || '',
    };
  };

  /**
   * Trigger typing start callback
   * @param char Current character
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
   * Trigger typing end callback
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

  /**
   * Trigger typing character callback
   * @param char Current character
   * @param isStartPoint Whether it is the start of typing (the first character)
   */
  const triggerOnTypedChar = (char: IChar, isStartPoint = false) => {
    const onTypedCharFn = onTypedCharRef.current;
    if (!isStartPoint) {
      recordTypedChars(char);
    }
    if (!onTypedCharFn) {
      return;
    }

    onTypedCharFn({
      currentIndex: typedCharsRef.current?.prevStr.length || 0,
      currentChar: char.content,
      answerType: char.answerType,
      prevStr: typedCharsRef.current?.prevStr || '',
    });
  };

  /** Start typing task */
  const startTypedTask = () => {
    if (isTypedRef.current) {
      return;
    }

    const chars = charsRef.current;

    /** Stop typing */
    const stopTyped = () => {
      isTypedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      triggerOnEnd();
    };

    /** Type next character */
    const nextTyped = () => {
      if (chars.length === 0) {
        stopTyped();
        return;
      }
      timerRef.current = setTimeout(startTyped, interval);
    };

    /**
     * Start typing
     * @param isStartPoint Whether it is the start of typing
     */
    function startTyped(isStartPoint = false) {
      if (isUnmountRef.current) {
        return;
      }
      isTypedRef.current = true;

      const char = chars.shift();
      if (char === undefined) {
        stopTyped();
        return;
      }

      if (isStartPoint) {
        triggerOnStart(char);
        triggerOnTypedChar(char, isStartPoint);
      } else {
        triggerOnTypedChar(char);
      }

      const currentParagraph = currentParagraphRef.current;
      /** If encountered, need to handle as two paragraphs */
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

      // Handle current paragraph
      let _currentParagraph = currentParagraph;
      const newCurrentParagraph: IParagraph = {
        content: '',
        isTyped: false,
        type: 'text',
        answerType: char.answerType,
      };

      if (!_currentParagraph) {
        // If there is no current paragraph, set as current paragraph
        _currentParagraph = newCurrentParagraph;
      } else if (currentParagraph && currentParagraph?.answerType !== char.answerType) {
        // If the current paragraph and character answerType are different, handle as two paragraphs
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

    startTyped(true);
  };

  useImperativeHandle(ref, () => ({
    /**
     * Add content
     * @param content Content {string}
     * @param answerType Answer type {AnswerType}
     */
    push: (content: string, answerType: AnswerType) => {
      if (isWholeTypedEndRef.current) {
        if (__DEV__) {
          console.warn('Typing is already complete, unable to add new content');
        }
        return;
      }
      // If there are two \n, treat them as one character, and merge multiple \n into one \n

      const fencedContent = processFencedCodeBlocks(content).content;
      const charsGroup = fencedContent.split('\n\n');
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
    /**
     * Clear typing task
     */
    clear: () => {
      clearTimer();
      charsRef.current = [];
      setStableParagraphs([]);
      setCurrentParagraph(undefined);
      isWholeTypedEndRef.current = false;
    },
    /**
     * Manually trigger typing end
     */
    triggerWholeEnd: () => {
      isWholeTypedEndRef.current = true;
      if (!isTypedRef.current) {
        triggerOnEnd();
      }
    },
  }));

  const getParagraphs = (paragraphs: IParagraph[], answerType: AnswerType) => {
    return (
      <div className={`ds-markdown-paragraph ds-typed-${answerType}`}>
        {paragraphs.map((paragraph, index) => {
          if (paragraph.type === 'br') {
            return null;
          }
          return (
            <HighReactMarkdown key={index} theme={theme}>
              {paragraph.content || ''}
            </HighReactMarkdown>
          );
        })}
        {currentParagraph?.answerType === answerType && (
          <HighReactMarkdown key={currentParagraph.content} theme={theme}>
            {currentParagraph.content || ''}
          </HighReactMarkdown>
        )}
      </div>
    );
  };

  /**
   * Detect fenced code blocks in markdown content and replace '\n\n' with '\n \n' inside them.
   * Returns the modified content and an array of code block ranges.
   * @param content The markdown string
   */
  const processFencedCodeBlocks = (content: string): { content: string; blocks: Array<{ start: number; end: number; fence: string }> } => {
    const lines = content.split('\n');
    const blocks: Array<{ start: number; end: number; fence: string }> = [];
    let inCodeBlock = false;
    let codeBlockStart = -1;
    let codeBlockFence = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
      if (fenceMatch) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockStart = i;
          codeBlockFence = fenceMatch[1];
        } else if (line.trim().startsWith(codeBlockFence)) {
          inCodeBlock = false;
          blocks.push({ start: codeBlockStart, end: i, fence: codeBlockFence });
          codeBlockStart = -1;
          codeBlockFence = '';
        }
      }
      // If in code block, replace any empty line after this line
      if (inCodeBlock && i < lines.length - 1 && lines[i + 1] === '') {
        lines[i + 1] = ' ';
      }
    }
    // After processing, join lines back
    const processedContent = lines.join('\n');
    return { content: processedContent, blocks };
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
