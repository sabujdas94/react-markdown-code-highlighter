import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import remarkGfm from "remark-gfm";

import HighReactMarkdown from "./components/HighReactMarkdown";
import "./index.less";

type AnswerType = "answer" | "thinking";

interface IParagraph {
  content?: string;
  isTyped: boolean;
  type: "br" | "text";
  answerType: AnswerType;
}

interface MarkdownProps {
  /** 打字机效果间隔时间 */
  interval: number;
  /** 是否关闭匀速打字机效果 */
  isClosePrettyTyped?: boolean;
}

export interface MarkdownRef {
  push: (content: string, answerType: AnswerType) => void;
}
const Markdown = forwardRef<MarkdownRef, MarkdownProps>(
  ({ interval = 30, isClosePrettyTyped = false }, ref) => {
    // const [content, setContent] = useState(initialContent)
    const charsRef = useRef<{ content: string; answerType: AnswerType }[]>([]);
    const isTypedRef = useRef(false);

    const timerRef = useRef<number | null>(null);
    const [stableParagraphs, setStableParagraphs] = useState<IParagraph[]>([]);
    const [currentParagraph, setCurrentParagraph] = useState<
      IParagraph | undefined
    >(undefined);
    const currentParagraphRef = useRef<IParagraph | undefined>(undefined);
    currentParagraphRef.current = currentParagraph;

    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, []);

    function startTypedTask() {
      if (isTypedRef.current) {
        return;
      }

      const chars = charsRef.current;

      function _startTyped() {
        if (chars.length === 0) {
          isTypedRef.current = false;
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
        isTypedRef.current = true;
        timerRef.current = setTimeout(() => {
          const char = chars.shift();
          if (char === undefined) {
            isTypedRef.current = false;
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            return;
          }
          const currentParagraph = currentParagraphRef.current;
          if (char.content === "\n\n") {
            if (currentParagraph) {
              setStableParagraphs((prev) => {
                const newParagraphs = [...prev];
                if (currentParagraph) {
                  newParagraphs.push({ ...currentParagraph, isTyped: false });
                }
                newParagraphs.push({
                  content: "",
                  isTyped: false,
                  type: "br",
                  answerType: char.answerType,
                });
                return newParagraphs;
              });
              setCurrentParagraph(undefined);
            } else {
              setStableParagraphs((prev) => {
                const newParagraphs = [...prev];
                newParagraphs.push({
                  content: "",
                  isTyped: false,
                  type: "br",
                  answerType: char.answerType,
                });
                return newParagraphs;
              });
            }
            _startTyped();
            return;
          }

          let _currentParagraph = currentParagraph;
          const newCurrentParagraph: IParagraph = {
            content: "",
            isTyped: false,
            type: "text",
            answerType: char.answerType,
          };
          if (!_currentParagraph) {
            // 如果当前没有段落，则直接设置为当前段落
            _currentParagraph = newCurrentParagraph;
          } else if (
            currentParagraph &&
            currentParagraph?.answerType !== char.answerType
          ) {
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
              content: (prev?.content || "") + char.content,
              isTyped: true,
            };
          });

          _startTyped();
        }, interval);
      }

      _startTyped();
    }

    useImperativeHandle(ref, () => ({
      push: (content: string, answerType: AnswerType) => {
        // 如果朋友\n,则\n这两个字符要合一起，作为一个字符处理,并且把多个\n处理成一个\n
        const charsGroup = content.split("\n\n");
        charsGroup.forEach((chars, index) => {
          if (isClosePrettyTyped) {
            charsRef.current.push({ content: chars, answerType });
          } else {
            charsRef.current.push(
              ...chars.split("").map((char) => ({ content: char, answerType })),
            );
          }
          if (index !== charsGroup.length - 1) {
            charsRef.current.push({ content: "\n\n", answerType });
          }
        });

        // charsRef.current.push({ content: content, answerType });

        if (!isTypedRef.current) {
          startTypedTask();
        }
      },
    }));

    const thinkingParagraphs = stableParagraphs.filter(
      (paragraph) => paragraph.answerType === "thinking",
    );
    const answerParagraphs = stableParagraphs.filter(
      (paragraph) => paragraph.answerType === "answer",
    );

    const getParagraphs = (
      paragraphs: IParagraph[],
      answerType: AnswerType,
    ) => {
      return (
        <div className={`ds-typed-${answerType}`}>
          {paragraphs.map((paragraph, index) => {
            if (paragraph.type === "br") {
              return null;
            }
            return (
              <HighReactMarkdown key={index}>
                {paragraph.content || ""}
              </HighReactMarkdown>
            );
          })}
          {currentParagraph?.answerType === answerType && (
            <HighReactMarkdown key={currentParagraph.content}>
              {currentParagraph.content || ""}
            </HighReactMarkdown>
          )}
        </div>
      );
    };

    return (
      <div className="ds-markdown">
        <div className="ds-markdown-thinking">
          {getParagraphs(thinkingParagraphs, "thinking")}
        </div>
        <div className="ds-markdown-answer">
          {getParagraphs(answerParagraphs, "answer")}
        </div>
      </div>
    );
  },
);

export default Markdown;

