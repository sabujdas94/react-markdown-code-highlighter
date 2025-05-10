import React from 'react';

interface HighlighterProps {
  children: string;
}

const modulePrefix = 'Highlighter';
const Highlighter: React.FC<HighlighterProps> = ({ children }) => {
  return <div className={modulePrefix}></div>;
};

export default Highlighter;
