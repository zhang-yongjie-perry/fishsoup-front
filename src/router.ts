import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Movie from '@/pages/movies/Movie.vue'
import KnowledgeBase from '@/pages/knowledgeBase/KnowledgeBase.vue'
import MyCreation from '@/pages/myCreation/MyCreation.vue'
import Creation from '@/pages/myCreation/Creation.vue'
import CreationList from '@/pages/creationList/CreationList.vue'
import HotNews from '@/pages/hotNews/HotNews.vue'
import Footsteps from '@/pages/footsteps/Footsteps.vue'
import PersonalInfo from '@/pages/user/PersonalInfo.vue'
import ChatRoom from '@/pages/user/ChatRoom.vue'

const routes = [
    {path: '/', component: Home, breadcrumbName: '首页'},
    {path: '/home', component: Home, breadcrumbName: '首页'},
    {path: '/login', component: Login, breadcrumbName: '登录'},
    {path: '/movie/:mv_id', component: Movie, props: true, breadcrumbName: '影视播放'},
    {path: '/knowledgeBase', component: KnowledgeBase, breadcrumbName: '知识库'},
    {path: '/myCreation', component: MyCreation, breadcrumbName: '我的'},
    {path: '/creation', component: Creation, breadcrumbName: '作品'},
    {path: '/creation/:id', component: Creation, props: true, breadcrumbName: '作品'},
    {path: '/creationList/:page/:name', component: CreationList, props: true, breadcrumbName: '作品列表'},
    {path: '/hotNews', component: HotNews, breadcrumbName: '热点新闻'},
    {path: '/footsteps', component: Footsteps, breadcrumbName: '足迹'},
    {path: '/personalInfo', component: PersonalInfo, breadcrumbName: '个人信息'},
    {path: '/chatRoom', component: ChatRoom, breadcrumbName: '聊天室'},
]

const router = createRouter({
    routes, 
    history: createWebHashHistory(),
    scrollBehavior (to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router