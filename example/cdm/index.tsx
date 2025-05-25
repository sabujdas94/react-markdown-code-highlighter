import React from 'react';

// 导入 ./cozeData.text

import cozeData from './cozeData';

interface CMDDemoProps {
  id?: number;
}

const modulePrefix = 'CMDDemo';
const CMDDemo: React.FC<CMDDemoProps> = (props: CMDDemoProps) => {
  return <div className={modulePrefix}></div>;
};

export default CMDDemo;
