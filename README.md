# react-markdown-code-highlighter

`react-markdown-code-highlighter` is a flexible [React](https://react.dev) component for rendering Markdown with syntax-highlighted code blocks using [highlight.js](https://highlightjs.org/). It is designed for use in chat systems and AI assistants like ChatGPT, Claude, DeepSeek, and any application that needs beautiful, performant Markdown rendering with code highlighting.

[DEMO](https://onshinpei.github.io/ds-markdown/)

## Features

- 💬 Perfect for chat UIs and AI assistants (ChatGPT, Claude, DeepSeek, etc.)
- 🖍 Syntax highlighting for code blocks via highlight.js
- 🛠 Optional typing effect for streaming/AI responses
- ⚡ Optimized for large documents and fast rendering
- 📦 Easy integration with any React project

## Installation

```bash
npm install react-markdown-code-highlighter
```

<a href="https://www.npmjs.com/package/react-markdown-code-highlighter"><img src="https://img.shields.io/npm/v/react-markdown-code-highlighter" alt="npm version"/></a>
<img src="https://img.shields.io/npm/dm/react-markdown-code-highlighter.svg" alt="npm downloads"/> <img src="https://img.shields.io/bundlephobia/minzip/react-markdown-code-highlighter" alt="Min gzipped size"/>

## Props

### Default Export

| Name           | Type                                                                                                     | Description                                                                 | Default  |
| -------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- |
| `interval`     | `number`                                                                                                 | Typing speed in milliseconds                                                | `30`     |
| `answerType`   | `thinking` \| `answer`                                                                                   | Markdown type                                                               | `answer` |
| `onEnd`        | `(data: { str: string; answerType: AnswerType }) => void`                                                | Callback after typing ends. **May trigger multiple times due to AI streaming** | -        |
| `onStart`      | `(data: { currentIndex: number; currentChar: string; answerType: AnswerType; prevStr: string }) => void` | Callback when typing starts. **May trigger multiple times**                 | -        |
| `onTypedChar`  | `(data: { currentIndex: number; currentChar: string; answerType: AnswerType; prevStr: string }) => void` | Callback for each character being typed                                     | -        |

## Usage Example - Default Export

[View Online](https://stackblitz.com/edit/vitejs-vite-ddfw8avb?file=src%2FApp.tsx)

```tsx
import { useState } from 'react';
import DsMarkdown from 'ds-markdown';
import 'ds-markdown/style.css';

const markdown = `# ds-markdown

\`ds-markdown\` is a [React](https://react.dev) component, similar in style to the deepseek official website \`Markdown\`

## Features

- 🦮 1:1 reproduction of the chat response effect from the deepseek official website
- 🛠 Built-in typing effect
- 🦮 Built-in common \`markdown\` text display
- 🔤 Performance optimization for large documents: processes in batches to avoid UI lag when generating typing effects
`;

function App() {
  const [thinkingContent, setThinkingContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');

  const onClick = () => {
    // If clicked repeatedly, previous effects will be cleared
    setThinkingContent('This is my thinking content. I have finished thinking, here is my answer.');
  };

  return (
    <div>
      <button onClick={onClick}>Show Typing Effect</button>
      <DsMarkdown
        answerType="thinking"
        interval={5}
        onEnd={() => {
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

## Imperative Example

In the above example, the typing effect is handled declaratively. When streaming data, the text changes continuously, so you can use the imperative approach to add text, reducing markdown rerenders.

Usage:
`import { MarkdownCMD } from 'ds-markdown';`

[View Online](https://stackblitz.com/edit/vitejs-vite-2ri8kex3?file=src%2FApp.tsx)

```tsx
import { useRef } from 'react';
import { MarkdownCMD } from 'ds-markdown';
import 'ds-markdown/style.css';

const markdown = `# ds-markdown

\`ds-markdown\` is a [React](https://react.dev) component, similar in style to the deepseek official website \`Markdown\`

## Features

- 🦮 1:1 reproduction of the chat response effect from the deepseek official website
- 🛠 Built-in typing effect
- 🦮 Built-in common \`markdown\` text display
- 🔤 Performance optimization for large documents: processes in batches to avoid UI lag when generating typing effects
`;

function App() {
  const ref = useRef();

  const onClick = () => {
    // If clicked repeatedly, previous effects will be cleared
    ref.current.clear();
    // Show thinking process
    ref.current.push('Thinking process: I am thinking about what ds-markdown is\n\nThinking finished, preparing to send answer', 'thinking');
    // Show result
    ref.current.push(markdown, 'answer');
  };

  return (
    <div>
      <button onClick={onClick}>Show Typing Effect</button>
      <MarkdownCMD ref={ref} />
    </div>
  );
}

export default App;
```

## Dark Mode Support

### How Dark Mode Works

The code block theme (light or dark) is determined by the value of `vite-ui-theme` in your browser's `localStorage`:
- If `vite-ui-theme` is set to `'dark'`, code blocks will use the dark theme.
- Any other value (or unset) will use the light theme.

### How to Enable Dark Mode

Set the theme in your application using JavaScript:

```js
window.localStorage.setItem('vite-ui-theme', 'dark'); // Enable dark mode
window.localStorage.setItem('vite-ui-theme', 'light'); // Enable light mode
```

You can toggle this value based on your app's theme switcher or user preference.

### Example: Toggle Dark Mode

```js
function toggleTheme() {
  const current = window.localStorage.getItem('vite-ui-theme');
  window.localStorage.setItem('vite-ui-theme', current === 'dark' ? 'light' : 'dark');
  window.location.reload(); // or trigger a re-render in your app
}
```

> **Note:** The code block theme is read once on component mount. If you change the theme, you may need to reload or re-render the component to see the effect.

## Compatibility

This component uses `react hooks`, so the minimum required `react` version is `v16.8.0`.

## License

MIT
