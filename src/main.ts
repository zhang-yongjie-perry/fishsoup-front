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
import { chatOnline } from '@/utils/websocketUtil'
import { useWebsocketStore } from '@/store/websocket'
import { init } from '@/utils/init'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// 守卫路由
let currentUrl = null
const userState = useUserInfo()
const routerState = useRouterState()
const whiteList = ['/', '/login']

router.beforeEach(async (to, from, next) => {
    currentUrl = routerState.to
    if (!whiteList.includes(to.path) && !userState.token) {
        warningAlert('您尚未登录, 请先登录')
        router.push("/login")
        return
    }

    // 获取展示菜单
    if (userState.token && (!routerState.getMenus() || routerState.getMenus().length < 1)) {
        await init()
    }

    routerState.from = from.path
    routerState.to = to.path
    if (!whiteList.includes(routerState.to === undefined || !routerState.to ? "/" : routerState.to) 
        && userState.token && useWebsocketStore().getWebsocket()?.readyState !== WebSocket.OPEN) {
        chatOnline()
    }
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