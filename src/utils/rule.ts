/** 此文件借鉴 marked 的部分代码 */

export const other = {
  caret: /(^|[^[])\^/g,
};

/**
 * 编辑正则表达式
 * @param regex 正则表达式
 * @param opt 正则表达式选项
 * @returns 编辑后的正则表达式
 */
function edit(regex: string | RegExp, opt = '') {
  let source = typeof regex === 'string' ? regex : regex.source;
  const obj = {
    replace: (name: string | RegExp, val: string | RegExp) => {
      let valSource = typeof val === 'string' ? val : val.source;
      valSource = valSource.replace(other.caret, '$1');
      source = source.replace(name, valSource);
      return obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    },
  };
  return obj;
}

const newline = /^(?:[ \t]*(?:\n|$))+/;
/** 围栏 fence
 * 什么是围栏： 围栏是用来包裹代码块的，比如 ```javascript 和 ``` 之间就是围栏
 */
const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
// 一个块
const _segment = /^([^\n]+(?:\n(?!fences| +\n)[^\n]+)*)/;

const segment = edit(_segment)
  .replace(/fences/, fences)
  .getRegex();

export const blockNormal = {
  newline,
  fences,
  segment,
};
