import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.ts',
    external: ['react'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  }];
