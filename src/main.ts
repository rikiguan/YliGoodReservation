import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入 Element Plus 的样式
import 'element-plus/dist/index.css'
import App from './App.vue'
import { insertGoogleTag } from './utils/analytics'

// 创建应用
const app = createApp(App)

// 设置Pinia
app.use(createPinia())

// 设置ElementPlus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 创建挂载点
const mountPoint = document.createElement('div')
mountPoint.id = 'yligood-app'
document.body.appendChild(mountPoint)

// 挂载应用
app.mount(mountPoint)

insertGoogleTag();
console.log('YliGood Reservation 初始化完成')
