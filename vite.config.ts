import fs from 'node:fs'
import * as process from 'node:process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import UnoCss from 'unocss/vite'
import pkg from './package.json'

export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(),
      UnoCss(),
      // VueDevTools(),
      electron({
        main: {
          entry: 'src/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG)
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            else
              startup()
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          input: 'src/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        renderer: {},
      }),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),

    build: {
      rollupOptions: {
        input: {
          index: 'index.html',
          clip: 'clip.html',
        },
      },
    },

    clearScreen: false,
  }
})
