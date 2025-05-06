import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import Markdown, { type MarkdownRef } from '../src/index.tsx';
import json from './data2.json';

import './index.css';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(`# Hello, world!

| 姓名 | 年龄 |
| --- | --- |
| 张三 | 20 |

    `);

console.dir(processor.value);

const App = () => {
//   return null;
  const markdownRef = useRef<MarkdownRef>(null);

  useEffect(() => {
    markdownRef.current?.push(json.thinking_content, 'thinking');
    markdownRef.current?.push(json.content, 'answer');
  }, []);
  return <div className="ds-message-box">
    <Markdown ref={markdownRef} interval={1} /></div>;
};

createRoot(document.getElementById('root')!).render(
  <App />,
);
