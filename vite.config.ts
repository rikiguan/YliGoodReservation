import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'http://tampermonkey.net/',
        match: ['*://ggtypt.nju.edu.cn/*'],
        name: 'YliGoodReservation',
        description: 'help u get a place 2 play',
        author: 'riki',
        version: '0.2.0',
      }
      // ,
      // build: {
      //   externalGlobals: {
      //     vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
      //     'element-plus': cdn.jsdelivr('ElementPlus', 'dist/index.full.min.js'),
      //     '@element-plus/icons-vue': cdn.jsdelivr('ElementPlusIconsVue', 'dist/index.min.js'),
      //     'pinia': cdn.jsdelivr('Pinia', 'dist/pinia.iife.min.js')
      //   },
      //   externalResource: {
      //     'element-plus/dist/index.css': cdn.jsdelivr('ElementPlus', 'dist/index.css')
      //   }
      // }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
