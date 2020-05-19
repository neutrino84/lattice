import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const extensions = ['.js', '.ts']
export default [
  {
    input: './src/main.ts',
    plugins: [
      typescript({ target: 'es5', module: 'commonjs' }),
      commonjs({ extensions }),
      resolve(),
    ],
    output: {
      file: pkg.main,
      format: 'cjs',
      // entryFileNames: 'ngrid.[format].js',
    }
  }, {
    input: './src/main.ts',
    plugins: [
      typescript({ target: 'es2017', module: 'es2015' }),
      // commonjs(),
      resolve(),
    ],
    output: {
      file: pkg.module,
      format: 'es',
      // entryFileNames: 'ngrid.[format].js'
    }
  }, {
    input: './src/main.ts',
    plugins: [
      typescript({ target: 'es5', module: 'commonjs' }),
      resolve({ extensions }),
      commonjs({ extensions })
    ],
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'nGrid',
      compact: false,
      sourcemap: false
    },
  }
]