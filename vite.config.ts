import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'
import pkg from "./package.json" with { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://www.nju.edu.cn/images/favicon.png',
        namespace: 'http://tampermonkey.net/',
        match: ['*://ggtypt.nju.edu.cn/*'],
        name: 'YliGood预约助手',
        description: 'help u get a place 2 play',
        author: 'riki',
        version: pkg.version,
        // grant: ['unsafeWindow'],
        homepage: 'https://github.com/rikiguan/YliGoodReservation',
        updateURL: 'https://github.com/rikiguan/YliGoodReservation/releases/latest/download/YliGoodReservation.user.js',
        downloadURL: 'https://github.com/rikiguan/YliGoodReservation/releases/latest/download/YliGoodReservation.user.js'
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
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
