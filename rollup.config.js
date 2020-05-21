import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const extensions = ['.js', '.ts']
const watchOptions = {
  buildDelay: 500,
  exclude: ['node_modules/**', 'dist/**']
}

let configurations = []
    configurations.push({
      watch: watchOptions,
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
      watch: watchOptions,
      input: './src/main.ts',
      plugins: [
        typescript({ target: 'es6', module: 'es6' }),
        resolve(),
      ],
      output: {
        file: pkg.module,
        format: 'es',
        // entryFileNames: 'ngrid.[format].js'
      }
    }, {
      watch: watchOptions,
      input: './src/main.ts',
      plugins: [
        typescript({ target: 'es5', module: 'commonjs' }),
        resolve({ extensions }),
        commonjs({ extensions }),
      ],
      output: {
        file: pkg.browser,
        format: 'iife',
        name: 'nGrid',
      },
    })

export default configurations