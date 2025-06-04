/** 此文件借鉴 marked 的部分代码 */

export const other = {
  caret: /(^|[^[])\^/g,
};

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
const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
// 一个块
const _block = /^([^\n]+(?:\n(?!fences| +\n)[^\n]+)*)/;

const block = edit(_block)
  .replace(/fences/, fences)
  .getRegex();

export const blockNormal = {
  newline,
  fences,
  block,
};
