import '@/assets/main.css'
import 'ant-design-vue/dist/antd.css';
import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/iconfont/iconfont.js'
import useRouterState from '@/store/router'
import useUserInfo from '@/store/user';
import { warningAlert } from '@/utils/AlertUtil'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// 守卫路由
const userState = useUserInfo();
const routerState = useRouterState();
const whiteList = ['/', '/home', '/login']
router.beforeEach((to, from, next) => {
    if (!whiteList.includes(to.path) && !userState.token) {
        warningAlert('您尚未登录, 请先登录');
        return '/home';
    }
    routerState.from = from.path;
    routerState.to = to.path;
    next();
})