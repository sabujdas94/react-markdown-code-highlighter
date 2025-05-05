import React, { memo } from "react";
import Markdown from "react-markdown";
import type { Options } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import gfmPlugin from "remark-gfm";
import BlockWrap from "../BlockWrap";
import "./index.less";

interface HighReactMarkdownProps extends Options {
  id?: number;
}

const modulePrefix = "HighReactMarkdown";
const HighReactMarkdown: React.FC<HighReactMarkdownProps> = (props) => {
  return (
    <Markdown
      remarkPlugins={[gfmPlugin]}
      components={{
        code: ({ inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <BlockWrap language={match[1]}>
              <SyntaxHighlighter language={match[1]}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </BlockWrap>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table: ({ children, ...props }) => {
          return <div className="markdown-table-wrapper">{children}</div>;
        },
      }}
      {...props}
    />
  );
};
export default memo(HighReactMarkdown);
