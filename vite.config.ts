import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  // 消除警告信息: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0
  css:{
    preprocessorOptions:{
      scss:{
        api:"modern-compiler"
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 9090,
    host: true,
    proxy: {
      '/api/v2': {
        target: 'http://localhost:9000/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v2/, '')
      },
    }
  }
})
