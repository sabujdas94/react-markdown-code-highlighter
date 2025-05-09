/**
 * 回答类型，思考和回答
 */
export type AnswerType = 'answer' | 'thinking';

/**
 * 段落类型
 * 段落类型为br时，表示换行
 * 段落类型为text时，表示文本
 */
export interface IParagraph {
  /** 段落内容 */
  content?: string;
  /** 是否已打字 */
  isTyped: boolean;
  /** 段落类型 */
  type: 'br' | 'text';
  /** 回答类型 */
  answerType: AnswerType;
}

export interface MarkdownProps {
  /** 打字机效果间隔时间 */
  interval: number;
  /** 是否关闭匀速打字机效果 */
  isClosePrettyTyped?: boolean;
  /** 打字完成后回调 */
  onEnd?: () => void;
  /** 开始打字回调 */
  onStart?: () => void;
}
