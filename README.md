# ds-markdown

`ds-markdown`是一个[React](https://react.dev)组件, 类似[deepseek官网](https://chat.deepseek.com/)风格的 `Markdown`

## 特性

- 🛠 自带打字效果
- 🦮 内部封装了常用的`markdown`格式的文本显示
- 🔤 对大文档进行了性能优化，进行分批处理，生成打字效果的时候不会对页面造成卡顿现象

## 安装

```bash
npm install ds-markdown
```

<a href="https://www.npmjs.com/package/ds-markdown"><img src="https://img.shields.io/npm/v/ds-markdown" alt="npm version"/></a>
<img src="https://img.shields.io/npm/dm/ds-markdown.svg" alt="npm downloads"/> <img src="https://img.shields.io/bundlephobia/minzip/ds-markdown" alt="Min gzipped size"/>

## 示例

```tsx
import { useRef, useEffect } from 'react';
import DsMarkdown from 'ds-markdown';
import 'ds-markdown/style.css';

const markdown = `# ds-markdown

\`ds-markdown\`是一个[React](https://react.dev)组件, 类似[deepseek官网](https://chat.deepseek.com/)风格的 \`Markdown\`

## 特性

- 🛠 自带打字效果
- 🦮 内部封装了常用的`markdown`格式的文本显示
- 🔤 对大文档进行了性能优化，进行分批处理，生成打字效果的时候不会对页面造成卡顿现象
`

function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();

  const ref = useRef();

  const onClick = () => {
    ref.current.push('这是思考过程:我正在思考 ds-markdown是什么', 'thinking');
    ref.current.push('markdown', 'answer');
  };

  return (
    <div>
      <button onClick={onClick}>显示文字</button>
      <DsMarkdown ref={ref} />
    </div>
  );
}
```
