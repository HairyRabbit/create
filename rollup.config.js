import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: path.resolve('lib/index.js'),
  output: {
    file: path.resolve('dist/index.js'),
    format: 'cjs',
    exports: 'named'
  },
  plugins: [
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    json({ exclude: 'node_modules/**' }),
    commonjs({ exclude: 'node_modules/**' })
  ],
  external: ['which', '@octokit/rest', 'yargs-parser']
}
