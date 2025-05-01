import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 格式化规则
      'indent': ['error', 2], // 缩进使用2个空格
      'quotes': ['error', 'single'], // 使用单引号
      'semi': ['error', 'always'], // 总是使用分号
      'comma-dangle': ['error', 'always-multiline'], // 多行时尾随逗号
      'no-trailing-spaces': 'error', // 禁止行尾空格
      'eol-last': ['error', 'always'], // 文件末尾空行
      'no-multiple-empty-lines': ['error', { 'max': 1 }], // 最多允许一个空行
      'object-curly-spacing': ['error', 'always'], // 对象字面量中的空格
      'array-bracket-spacing': ['error', 'never'], // 数组括号内不允许空格
      'arrow-spacing': ['error', { 'before': true, 'after': true }], // 箭头函数空格
    },
  },
)
