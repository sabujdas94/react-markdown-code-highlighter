import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle(fn: (...args: any[]) => void, delay: number) {
  let lastTime = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn(...args);
      lastTime = now;
    }
  };
}

const App = () => {
  const [thinkingContent, setThinkingContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const messageDivRef = useRef<HTMLDivElement>(null!);

  const scrollCacheRef = useRef<{
    type: 'manual' | 'auto';
    needAutoScroll: boolean;
  }>({
    type: 'manual',
    needAutoScroll: true,
  });

  const onClick = () => {
    setThinkingContent(json.thinking_content);
  };
  const onReset = () => {
    setThinkingContent('');
    setAnswerContent('');
  };

  const throttleOnTypedChar = useMemo(() => {
    return throttle(() => {
      if (!scrollCacheRef.current.needAutoScroll) return;
      const messageDiv = messageDivRef.current;
      // 自动滑动到最底部
      if (messageDiv) {
        scrollCacheRef.current.type = 'auto';
        messageDiv.scrollTop = messageDiv.scrollHeight;
        scrollCacheRef.current.type = 'manual';
      }
    }, 50);
  }, []);

  const onScroll = useMemo(() => {
    // if (scrollCacheRef.current.type === 'auto') return;
    // scrollCacheRef.current.needAutoScroll = false;
  }, []);

  return (
    <div className="ds-message">
      <div className="ds-message-actions">
        {thinkingContent ? <button onClick={onReset}>重置</button> : <button onClick={onClick}>显示</button>} <span style={{ marginLeft: 30 }}>React 19有哪些新特性</span>
      </div>
      <div className="ds-message-box" ref={messageDivRef} onScroll={onScroll}>
        <div className="ds-message-list">
          <Markdown
            interval={5}
            answerType="thinking"
            onEnd={(args) => {
              // console.log('思考完成', args);
              if (thinkingContent) {
                setAnswerContent(json.content);
              }
            }}
            // onStart={(args) => {
            //   console.log('思考开始', args);
            // }}
            // onTypedChar={(args) => {
            //   console.log('打字中', args);
            // }}
            onTypedChar={throttleOnTypedChar}
          >
            {thinkingContent}
          </Markdown>

          {answerContent && (
            <Markdown
              interval={5}
              answerType="answer"
              // onEnd={(args) => {
              //   console.log('思考完成', args);
              //   if (thinkingContent) {
              //     setAnswerContent(json.content);
              //   }
              // }}
              // onStart={(args) => {
              //   console.log('思考开始', args);
              // }}
              // onTypedChar={(args) => {
              //   console.log('打字中', args);
              // }}
              onTypedChar={throttleOnTypedChar}
            >
              {answerContent}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
