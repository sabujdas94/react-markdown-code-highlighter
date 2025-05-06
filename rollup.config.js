import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import babel from '@rollup/plugin-babel';

export default {
  input: './src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    // commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
      include: ['src/**/*'],
    }),
    postcss({
      extensions: ['.css', '.less'],
      extract: true,
      minimize: true,
      use: {
        less: { javascriptEnabled: true },
      },
    }),
  ],
  external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
};
