import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import remarkGfm from 'remark-gfm';
// import remarkRehype from 'remark-rehype';
// import rehypeStringify from 'rehype-stringify';
import Markdown from '../src';
import '../src/style.less';
import json from './data4.json';

import './index.css';

// const processor = unified()
//   .use(remarkParse)
//   .use(remarkGfm)
//   .use(remarkRehype)
//   .use(rehypeStringify)
//   .processSync(`# Hello, world!

// | 姓名 | 年龄 |
// | --- | --- |
// | 张三 | 20 |

//     `);

// console.dir(processor.value);

const App = () => {
  const [thinkingContent, setThinkingContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const onClick = () => {
    setThinkingContent(json.thinking_content);
  };
  const onReset = () => {
    setThinkingContent('');
    setAnswerContent('');
  };
  return (
    <div className="ds-message-box">
      <div className="ds-message-actions">
        {thinkingContent ? <button onClick={onReset}>重置</button> : <button onClick={onClick}>显示</button>} <span style={{ marginLeft: 30 }}>React 19有哪些新特性</span>
      </div>
      <Markdown
        interval={10}
        answerType="thinking"
        onEnd={() => {
          console.log('思考完成');
          if (thinkingContent) {
            setAnswerContent(json.content);
          }
        }}
      >
        {thinkingContent}
      </Markdown>

      {answerContent && (
        <Markdown interval={10} answerType="answer">
          {answerContent}
        </Markdown>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
