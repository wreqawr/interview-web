import {createApp} from 'vue'
import App from './App.vue'

// 引入路由
import router from './router'

// 引入Pinia状态管理
import pinia from './stores'

// 引入Element Plus及样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局样式
import './styles/global.css'

const app = createApp(App)

// 挂载插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 挂载到页面
app.mount('#app')
