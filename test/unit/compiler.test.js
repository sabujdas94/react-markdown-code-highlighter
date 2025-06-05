import { compiler } from '../../dist/esm/utils/compiler.js';

describe('Compiler', () => {
  test('should handle empty string', () => {
    const result = compiler('');
    expect(result).toEqual([]);
  });

  test('should parse basic text segment', () => {
    const input = 'Hello World';
    const result = compiler(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('segment');
    expect(result[0].raw).toBe('Hello World');
  });

  test('should parse code segment', () => {
    const input = '```javascript\nconsole.log("hello");\n```';
    const result = compiler(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('fence');
    expect(result[0].raw).toBe(input);
  });

  test('should handle multiple blocks with spaces', () => {
    const input = 'First segment\n\nSecond segment';
    const result = compiler(input);
    expect(result).toHaveLength(3); // Two blocks and one space
    expect(result[0].type).toBe('segment');
    expect(result[1].type).toBe('space');
    expect(result[2].type).toBe('segment');
  });

  test('includes fence, blockquote, heading, paragraph', () => {
    const input = `# heading\n\n this is paragraph\n\n[link](https://www.google.com)\n\n\`\`\`javascript\n\nconsole.log('hello');\n\`\`\`\n\n> blockquote\n\n`;
    const result = compiler(input);
    expect(result).toHaveLength(10);
    expect(result[0].type).toBe('segment');
  });

  test('items include fence code and code double newline', () => {
    const input =
      '### 3. **动作处理（Actions）**\n   - **简化表单处理**：通过 `useActionState` 和 `useFormStatus` 等新 Hook，统一管理表单提交状态和结果。\n   - **示例代码**：\n     ```jsx\n     function Form({ action }) {\n\n       const [state, formAction] = useActionState(action, null);\n       return (\n         <form action={formAction}>\n           <button>Submit</button>\n           {state && <p>{state.message}</p>}\n         </form>\n       );\n     }\n     ```\n\n---\n\n### 4. **文档元数据支持**\n   - **SEO 优化**：直接在组件内使用 `<title>`、`<meta>` 等标签管理文档元数据，无需第三方库。\n   - **示…     );\n     ```\n\n---\n\n### 7. **错误处理改进**\n   - **服务端错误恢复**：服务端组件渲染出错时，客户端可自动尝试重新渲染，避免页面崩溃。\n   - **更清晰的错误边界**：通过 `errorBoundary` 属性指定错误处理组件。\n\n---\n\n### 8. **兼容性调整**\n   - **弃用 `react-dom/createRoot`**：推荐使用新的根 API `react-dom/client`。\n   - **移除旧版 API**：如 `ReactDOM.render` 和 `react-dom/server` 的遗留方法。\n\n---\n\n### 升级建议\n- **测试环境验证**：在非生产环境充分测试现有代码，尤其是涉及服务端渲染和表单处理的逻辑。\n- **关注官方迁移指南**：React 官网通常会提供详细的版本迁移说明。\n\n---\n\nReact 19 的这些改进显著降低了开发复杂性，同时提升了性能和用户体验。建议开发者参考 [React 官方博客](https://react.dev/blog) 获取最新动态和详细文档。';
    const result = compiler(input);
    expect(result[0].type).toBe('segment');
  });
});
