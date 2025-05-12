import React, { memo } from 'react';
import Markdown from 'react-markdown';
import type { Options } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/prism/coy';
import gfmPlugin from 'remark-gfm';

import BlockWrap from '../BlockWrap/index.js';

interface HighReactMarkdownProps extends Options {
  id?: number;
}

const modulePrefix = 'HighReactMarkdown';
const HighReactMarkdown: React.FC<HighReactMarkdownProps> = (props) => {
  return (
    <Markdown
      remarkPlugins={[gfmPlugin]}
      components={{
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <BlockWrap language={match[1]}>
              <SyntaxHighlighter useInlineStyles={false} language={match[1]} style={style}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              {/* <Highlighter>{String(children).replace(/\n$/, '')}</Highlighter> */}
            </BlockWrap>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table: ({ children, ...props }) => {
          return (
            <div className="markdown-table-wrapper">
              <table className="ds-markdown-table">{children}</table>
            </div>
          );
        },
      }}
      {...props}
    />
  );
};
export default memo(HighReactMarkdown);
