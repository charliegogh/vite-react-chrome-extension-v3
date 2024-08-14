import { dirname, join, relative, resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(join(__dirname, 'src')),
      src: resolve(join(__dirname, 'src'))
    }
  },
  plugins: [
    react(),

    Pages({
      dirs: [
        {
          dir: 'src/pages',
          baseRoute: 'common'
        },
        {
          dir: 'src/options/pages',
          baseRoute: 'options'
        },
        {
          dir: 'src/popup/pages',
          baseRoute: 'popup'
        },
        {
          dir: 'src/content-script/iframe/pages',
          baseRoute: 'iframe'
        },
        {
          dir: 'src/tabs/sidepanel.html',
          baseRoute: 'sidepanel'
        }
      ]
    }),

    AutoImport({
      imports: ['react'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/']
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`
        )
      }
    }
  ],
  build: {
    manifest: true,
    terserOptions: {
      compress: true,
      mangle: true,
      sourceMap: false
    }
  },
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: false
    }
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi']
  }
})
