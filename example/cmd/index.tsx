import React, { useEffect, useRef } from 'react';
import { MarkdownCMD } from '../../src';

// 导入 ./cozeData.text

import { cozeData } from './cozeData';
import { MarkdownRef } from '../../src/MarkdownCMD';

interface CMDDemoProps {
  id?: number;
}

console.log(cozeData);

const modulePrefix = 'CMDDemo';
const CMDDemo: React.FC<CMDDemoProps> = (props: CMDDemoProps) => {
  const cmdRef = useRef<MarkdownRef>(null!);

  useEffect(() => {
    async function pushData() {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 30));

        const data = cozeData.shift();

        if (data) {
          cmdRef.current.push(data.content, data.answerType);
        }

        if (!data || cozeData.length === 0) {
          break;
        }
      }
    }

    pushData();
  }, []);

  return (
    <div className="ds-message-box">
      <div className="ds-message-list">
        <MarkdownCMD interval={10} ref={cmdRef} />
      </div>
    </div>
  );
};

export default CMDDemo;
