import React from 'react';
import Prism from 'prismjs';
import classNames from 'classnames';

// 必须手动导入 TSX 相关语言定义
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx'; // TSX 核心语法

console.log(Prism.languages);

interface HighlighterProps {
  children: string;
}

const modulePrefix = 'Highlighter';
const Highlighter: React.FC<HighlighterProps> = ({ children }) => {
  const html = Prism.highlight(children, Prism.languages.jsx, 'jsx');
  return (
    <pre
      className={classNames({
        [modulePrefix]: true,
        'language-jsx': true,
      })}
    >
      <code className="language-jsx" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
};

export default Highlighter;
