import React from 'react';

interface CMDDemoProps {
  id?: number;
}

const modulePrefix = 'CMDDemo';
const CMDDemo: React.FC<CMDDemoProps> = (props: CMDDemoProps) => {
  return <div className={modulePrefix}></div>;
};

export default CMDDemo;
