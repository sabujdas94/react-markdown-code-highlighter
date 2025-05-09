# ds-markdown

`ds-markdown`是一个[React](https://react.dev)组件, 类似[deepseek官网](https://chat.deepseek.com/)风格的 `Markdown`

## 特性

- 🛠 自带打字效果
- 🦮 内部封装了常用的`markdown`格式的文本显示
- 🔤 对大文档进行了性能优化，进行分批处理，生成打字效果的时候不会对页面造成卡顿现象

## 期待中的功能

- 支持多种主题（开发中）
- 增加测试用例（开发中）
- 支持H5端（未开始，预计2025年5月底完成）
- 支持微信、支付宝小程序端（未开始，预计2025年6月底完成）

由于本页面仔写业务写的飞起，只能在闲暇之余来开发本库，也希望各位小伙伴一起来共建😘

## 安装

```bash
npm install ds-markdown
```

<a href="https://www.npmjs.com/package/ds-markdown"><img src="https://img.shields.io/npm/v/ds-markdown" alt="npm version"/></a>
<img src="https://img.shields.io/npm/dm/ds-markdown.svg" alt="npm downloads"/> <img src="https://img.shields.io/bundlephobia/minzip/ds-markdown" alt="Min gzipped size"/>

## props

### 默认导出

| 属性名       | 类型                         | 说明                               | 默认值   |
| ------------ | ---------------------------- | ---------------------------------- | -------- |
| `interval`   | `number`                     | 打字的速度`ms`                     | `30`     |
| `answerType` | `thinking` \| `answer`       | `markdown`类型                     | `answer` |
| `onEnd`      | `() => void`                 | 打字结束后回调，**可能会触发多次** | -        |
| `onStart`    | `(isFirst: boolean) => void` | 打字开始回调 **可能会触发多次**    | -        |

## 使用示例 - default export

[在线查看](https://stackblitz.com/edit/vitejs-vite-ddfw8avb?file=src%2FApp.tsx)

```tsx
import { useState } from 'react';
import DsMarkdown from 'ds-markdown';
import 'ds-markdown/style.css';

const markdown = `# ds-markdown

\`ds-markdown\`是一个[React](https://react.dev)组件, 类似[deepseek官网](https://chat.deepseek.com/)风格的 \`Markdown\`

## 特性

- 🛠 自带打字效果
- 🦮 内部封装了常用的\`markdown\`格式的文本显示
- 🔤 对大文档进行了性能优化，进行分批处理，生成打字效果的时候不会对页面造成卡顿现象
`;

function App() {
  const [thinkingContent, setThinkingContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');

  const onClick = () => {
    // 如果重复点击，则会清空之前的效果
    setThinkingContent('这是我思考的内容，我已经思考完成，下面是我的答案');
  };

  console.log(answerContent);
  return (
    <div>
      <button onClick={onClick}>点击显示文字效果</button>
      <DsMarkdown
        answerType="thinking"
        interval={5}
        onEnd={() => {
          console.log('思考完成');
          setAnswerContent(markdown);
        }}
      >
        {thinkingContent}
      </DsMarkdown>

      {!!answerContent && (
        <DsMarkdown answerType="answer" interval={5}>
          {answerContent}
        </DsMarkdown>
      )}
    </div>
  );
}

export default App;
```

## 命令式示例

上面的示例中使用声明式方式来进行`markdown`的打字效果，当我们用流式拉取到数据时，文字是一个不断变化的过程，我们可以进行命令式的方式来加入文字，这样可以减少`markdown`的`rerender`
使用方式：
`import { MarkdownCMD } from 'ds-markdown';`

[在线查看](https://stackblitz.com/edit/vitejs-vite-2ri8kex3?file=src%2FApp.tsx)

```tsx
import { useRef, useState } from 'react';
import { MarkdownCMD } from 'ds-markdown';
import 'ds-markdown/style.css';

const markdown = `# ds-markdown

\`ds-markdown\`是一个[React](https://react.dev)组件, 类似[deepseek官网](https://chat.deepseek.com/)风格的 \`Markdown\`

## 特性

- 🛠 自带打字效果
- 🦮 内部封装了常用的\`markdown\`格式的文本显示
- 🔤 对大文档进行了性能优化，进行分批处理，生成打字效果的时候不会对页面造成卡顿现象
`;

function App() {
  const ref = useRef();

  const onClick = () => {
    // 如果重复点击，则会清空之前的效果
    ref.current.clear();
    // 显示思考过程
    ref.current.push('这是思考过程:我正在思考 ds-markdown是什么\n\n思考完成,准备发送答案', 'thinking');
    // 显示结果
    ref.current.push(markdown, 'answer');
  };

  return (
    <div>
      <button onClick={onClick}>点击显示文字效果</button>
      <MarkdownCMD ref={ref} />
    </div>
  );
}

export default App;
```

## 兼容性

由于本组件采用`react hooks`编写，所以`react`版本最低为`v16.8.0`

## License

MIT
