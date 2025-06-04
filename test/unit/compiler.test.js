import { compiler } from '../../dist/esm/utils/compiler.js';

describe('Compiler', () => {
  test('should handle empty string', () => {
    const result = compiler('');
    expect(result).toEqual([]);
  });

  test('should parse basic text block', () => {
    const input = 'Hello World';
    const result = compiler(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('block');
    expect(result[0].raw).toBe('Hello World');
  });

  test('should parse code block', () => {
    const input = '```javascript\nconsole.log("hello");\n```';
    const result = compiler(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('fence');
    expect(result[0].raw).toBe(input);
  });

  test('should handle multiple blocks with spaces', () => {
    const input = 'First block\n\nSecond block';
    const result = compiler(input);
    expect(result).toHaveLength(3); // Two blocks and one space
    expect(result[0].type).toBe('block');
    expect(result[1].type).toBe('space');
    expect(result[2].type).toBe('block');
  });

  test('includes fence, blockquote, heading, paragraph', () => {
    const input = `# heading\n\n this is paragraph\n\n[link](https://www.google.com)\n\n\`\`\`javascript\n\nconsole.log('hello');\n\`\`\`\n\n> blockquote\n\n`;
    const result = compiler(input);
    expect(result).toHaveLength(10);
    expect(result[0].type).toBe('block');
  });
});
