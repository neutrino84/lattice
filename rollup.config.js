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
        typescript(),
        resolve()
      ],
      output: {
        file: pkg.main,
        format: 'cjs',
        // entryFileNames: 'ngrid.[format].js',
        exports: 'auto'
      }
    }, {
      watch: watchOptions,
      input: './src/main.ts',
      plugins: [
        typescript(),
        resolve()
      ],
      output: {
        file: pkg.module,
        format: 'es'
        // entryFileNames: 'ngrid.[format].js'
      }
    }, {
      watch: watchOptions,
      input: './src/main.ts',
      plugins: [
        typescript(),
        resolve()
      ],
      output: {
        file: pkg.browser,
        format: 'iife',
        name: 'nGrid',
      },
    })

export default configurations