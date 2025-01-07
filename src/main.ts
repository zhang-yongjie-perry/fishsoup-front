import '@/assets/main.css'
import '@/scss/mixin.scss'
import 'ant-design-vue/dist/antd.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/iconfont/iconfont.js'
import useRouterState from '@/store/router'
import useUserInfo from '@/store/user'
import { warningAlert } from '@/utils/AlertUtil'
import { connectWebSocket } from '@/utils/websocketUtil'
import { useWebsocketStore } from '@/store/websocket'
import { init } from '@/utils/init'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// 守卫路由
const userState = useUserInfo()
const routerState = useRouterState()
const whiteList = ['/', '/login']
router.beforeEach((to, from, next) => {
    if (!whiteList.includes(to.path) && !userState.token) {
        warningAlert('您尚未登录, 请先登录')
        router.push("/login")
        return
    }
    routerState.from = from.path
    routerState.to = to.path
    next()
})

// 防抖/放双击
app.directive('antishake', (el, binding) => {
    el.addEventListener('click', () => {
        if (el.getAttribute('href') && !el.classList.contains('disabled')) {
            el.classList.add('disabled')
            setTimeout(() => {
                el.classList.remove('disabled')
            }, binding.value || 3000)
            return
        }
        if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
                el.disabled = false
            }, binding.value || 3000)
        }
    })
})

if (userState.token && useWebsocketStore().getWebsocket()?.readyState !== WebSocket.OPEN) {
    connectWebSocket()
}

// 获取展示菜单
if (userState.token) {
    init()
}