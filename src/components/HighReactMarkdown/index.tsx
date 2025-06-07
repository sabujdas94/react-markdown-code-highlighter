import React, { memo } from 'react';
import Markdown from 'react-markdown';
import type { Options } from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
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
          if (match) {
            const language = match[1];
            // console.log(`${modulePrefix} code language`, language);

            const code = String(children).replace(/\n$/, '');

            // console.log(`${modulePrefix} code content`, code);
            
            const highlighted = hljs.getLanguage(language)
              ? hljs.highlight(code, { language }).value
              : hljs.highlightAuto(code).value;
            return (
              <BlockWrap language={language}>
                <pre
                  className={`hljs language-${language}`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </BlockWrap>
            );
          } else {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
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
