/* eslint-disable no-unused-vars */
/**
 * Answer type: thinking or answer
 */
export type AnswerType = 'answer' | 'thinking';

export type ThemeType = 'dark' | 'light';

/**
 * Paragraph type
 * If the type is 'br', it means a line break
 * If the type is 'text', it means text
 */
export interface IParagraph {
  /** Paragraph content */
  content?: string;
  /** Whether it has been typed */
  isTyped: boolean;
  /** Paragraph type */
  type: 'br' | 'text';
  /** Answer type */
  answerType: AnswerType;
}

export interface MarkdownProps {
  /** Typing effect interval time */
  interval: number;
  /** Whether to disable pretty typing effect */
  isClosePrettyTyped?: boolean;
  /** Callback after typing is finished */
  onEnd?: (data?: { str?: string; answerType?: AnswerType }) => void;
  /** Callback when typing starts */
  onStart?: (data?: { currentIndex: number; currentChar: string; answerType: AnswerType; prevStr: string }) => void;
  /**
   * Callback after typing a character
   * @param char Character
   * @param index Character index
   */
  onTypedChar?: (data?: { currentIndex: number; currentChar: string; answerType: AnswerType; prevStr: string }) => void;
  /** Theme type: 'dark' or 'light' */
  theme: ThemeType;
}
