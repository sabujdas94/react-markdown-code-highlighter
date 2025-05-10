import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // 选择你喜欢的主题样式

interface HighlighterProps {
  children: string;
}

const modulePrefix = 'Highlighter';
const Highlighter: React.FC<HighlighterProps> = ({ children }) => {
  const html = Prism.highlight(children, Prism.languages.javascript, 'javascript');
  return <pre className={modulePrefix} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Highlighter;
