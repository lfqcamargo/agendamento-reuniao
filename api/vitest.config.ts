import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const tsConfigPaths = await import('vite-tsconfig-paths').then(
    (mod) => mod.default,
  )

  return {
    test: {
      globals: true,
      root: './',
    },
    plugins: [
      tsConfigPaths(),
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  }
})
