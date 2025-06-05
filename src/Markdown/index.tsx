import React, { memo, useEffect, useMemo, useRef } from 'react';
import { __DEV__ } from '../constant.js';
import { AnswerType, MarkdownProps } from '../defined.js';
import MarkdownCMD, { MarkdownRef } from '../MarkdownCMD/index.js';

interface MarkdownImplProps extends MarkdownProps {
  children: string | undefined;
  answerType: AnswerType;
}

const MarkdownInner: React.FC<MarkdownImplProps> = ({ children: _children = '', answerType, ...rest }) => {
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

  return <MarkdownCMD ref={cmdRef} {...rest} />;
};

const Markdown: React.FC<MarkdownImplProps> = (props) => {
  const { children = '', answerType = 'answer' } = props;

  if (__DEV__) {
    if (!['thinking', 'answer'].includes(answerType)) {
      throw new Error('The answerType of Markdown component must be either "thinking" or "answer"');
    }
    if (typeof children !== 'string') {
      throw new Error('The child of Markdown component must be a string');
    }
  }

  return <MarkdownInner {...props} answerType={answerType} />;
};

export default memo(Markdown);
