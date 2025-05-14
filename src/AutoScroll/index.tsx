import React from 'react';

interface AutoScrollProps {
  children: React.ReactNode;
}

const modulePrefix = 'AutoScroll';
const AutoScroll: React.FC<AutoScrollProps> = (props: AutoScrollProps) => {
  return <div className="ds-markdown_auto_scroll">{props.children}</div>;
};

export default AutoScroll;
