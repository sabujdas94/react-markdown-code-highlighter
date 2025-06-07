import React, { memo, useEffect, useMemo, useRef } from 'react';
import { __DEV__ } from '../constant.js';
import { AnswerType, MarkdownProps, ThemeType } from '../defined.js';
import MarkdownCMD, { MarkdownRef } from '../MarkdownCMD/index.js';

interface MarkdownImplProps extends MarkdownProps {
  children: string | undefined;
  answerType: AnswerType;
  theme?: ThemeType; // Add theme prop
}

const MarkdownInner: React.FC<MarkdownImplProps> = ({ children: _children = '', answerType, theme = 'light', ...rest }) => {
  const cmdRef = useRef<MarkdownRef>(null!);
  const prefixRef = useRef('');
  const content = useMemo(() => {
    if (typeof _children === 'string') {
      return _children;
    }
    if (__DEV__) {
      console.error('The child of Markdown component must be a string');
    }
    return '';
  }, [_children]);

  useEffect(() => {
    if (prefixRef.current !== content) {
      let newContent = '';
      if (prefixRef.current === '') {
        newContent = content;
      } else {
        if (content.startsWith(prefixRef.current)) {
          newContent = content.slice(prefixRef.current.length);
        } else {
          newContent = content;
          cmdRef.current.clear();
        }
      }
      cmdRef.current.push(newContent, answerType);
      prefixRef.current = content;
    }
  }, [answerType, content]);

  return <MarkdownCMD ref={cmdRef} theme={theme} {...rest} />;
};

const Markdown: React.FC<MarkdownImplProps> = (props) => {
  const { children = '', answerType = 'answer', theme = 'light' } = props;

  if (__DEV__) {
    if (!['thinking', 'answer'].includes(answerType)) {
      throw new Error('The answerType of Markdown component must be either "thinking" or "answer"');
    }
    if (typeof children !== 'string') {
      throw new Error('The child of Markdown component must be a string');
    }
    if (theme && !['dark', 'light'].includes(theme)) {
      throw new Error('The theme of Markdown component must be either "dark" or "light"');
    }
  }

  return <MarkdownInner {...props} answerType={answerType} theme={theme} />;
};

export default memo(Markdown);
