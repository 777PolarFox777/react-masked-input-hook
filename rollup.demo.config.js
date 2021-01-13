import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProd = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'demo/index.tsx',
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript({
        tsconfig: 'tsconfig.demo.json',
      }), // so Rollup can convert TypeScript to JavaScript
      html({
        publicPath: 'dist',
        fileName: 'index.html',
        title: 'React MaskedInput Demo',
        template: ({ title }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>
`,
      }),
      scss({
        output: 'dist/index.css',
      }),
      (!isProd && serve({
        host: 'localhost',
        port: 3000,
        open: true,
        contentBase: ['dist'],
      })),
      (!isProd && livereload({
        watch: 'dist',
      })),
    ],
    output: [
      { file: 'dist/index.js', format: 'cjs' },
    ],
  },
];
