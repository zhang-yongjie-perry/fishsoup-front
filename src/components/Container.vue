<template>
    <a-layout class="fish-home">
        <a-layout-header class="fish-header">
            <a-row>
                <a-col :xs="{span: 24, pull: 2}" :sm="{span: 12, pull: 1}" :md="{span: 9, pull: 1}" 
                :lg="{span: 9, pull: 0}" :xl="{span: 9, pull: 0}">
                    <ul class="left-entry">
                        <li v-for="link in links" class="entry-element">
                            <a-badge v-if="link.url === '/chatRoom'" :count="useWebsocketStore().getCount()" style="display: inline;">
                                <router-link :to="link.url" style="background-color: transparent;">
                                    <span class="entry-title" :style="{
                                        'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                        'text-decoration': routerState.to === link.url ? 'underline' : 'none',
                                    }">{{ link.name }}</span>
                                </router-link>
                            </a-badge>
                            <a-badge v-else-if="link.url === '/memo'">
                                <span class="entry-title" :style="{
                                    'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                    'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                }" @click="toGetMemo">{{ link.name }}</span>
                            </a-badge>
                            <a-badge v-else-if="link.url === '/blindBox'">
                                <span class="entry-title" :style="{
                                    'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                    'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                }" @click="drawDivination">{{ link.name }}</span>
                            </a-badge>
                            <a-badge v-else style="display: inline;">
                                <router-link :to="link.url" style="background-color: transparent;">
                                    <span class="entry-title" :style="{
                                        'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                        'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                    }">{{ link.name }}</span>
                                </router-link>
                            </a-badge>
                        </li>
                    </ul>
                </a-col>
                <a-col :xs="{span: 12, pull: 0}" :sm="{span: 10, pull: 1}" :md="{span: 12, push: 1}" 
                :lg="{span: 12, push: 1}" :xl="{span: 8, pull: 1}">
                    <a-input-search
                        v-model:value="searchRef"
                        :allowClear="true"
                        placeholder="请输入查询内容"
                        @search="onSearch">
                        <template #enterButton>
                            <a-button v-antishake>搜索</a-button>
                        </template>
                    </a-input-search>
                </a-col>
                <a-col :xs="{span: 4, push: 1}" :sm="{span: 4, push: 1}" :md="{span: 4, push: 1}" 
                :lg="{span: 4, push: 1}" :xl="{span: 2, push: 2}">
                    <div class="go-back" @click="goBack()">返回</div>
                </a-col>
                <a-col :xs="{span: 8, pull: 1}" :sm="{span: 20, push: 0}" :md="{span: 20, push: 0}" 
                :lg="{span: 20, push: 0}" :xl="{span: 3, push: 1}">
                    <ul class="right-entry">
                        <li>
                            <span v-if="userStore.loginName" class="entry-username">
                                <span id="hello">您好,</span> 
                                <a-dropdown placement="bottom">
                                    <a class="ant-dropdown-link" @click.prevent style="background-color: transparent;">
                                        <span class="entry-username">{{ userStore.loginName }}</span>
                                    </a>
                                    <template #overlay>
                                        <a-menu style="opacity: 0.9;">
                                            <a-menu-item>
                                                <router-link to="/personalInfo" style="background-color: transparent;">
                                                    个人信息
                                                </router-link>
                                            </a-menu-item>
                                            <a-menu-item>
                                                <router-link to="/menuSetting" style="background-color: transparent;">
                                                    菜单设置
                                                </router-link>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </span>
                            <span v-else class="entry-username">"游客"</span>
                        </li>
                        <li id="login">
                            <div style="display: inline-block;">
                                <span v-if="!userStore.loginName" class="entry-username" @click="toLogin()">登录</span>
                                <a-popconfirm v-else class="entry-username"
                                    placement="bottomRight"
                                    arrowPointAtCenter
                                    title="确认退出吗?"
                                    ok-text="退出"
                                    cancel-text="取消"
                                    @confirm="toLogout()"
                                >
                                    <a v-antishake href="#" style="background-color: transparent;">退出</a>
                                </a-popconfirm>
                            </div>
                        </li>
                    </ul>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout class="content" :style="{'min-height': height + 'px'}">
            <slot></slot>
        </a-layout>
        <a-modal cancelText="关闭" okText="保存" v-model:visible="memoVisible" :title="memoTitle" @ok="memoHandleOk" style="width: 90%;">
            <a-textarea v-model:value="memoValue" placeholder="请输入内容" :rows="15" />
        </a-modal>
        <a-layout-footer class="footer">路虽远，行则将至；梦虽遥，做则必成</a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
// 由于setup函数中的defineProps无法引用本地变量, 再增加一个script标签声明变量
const now = new Date()
const today_format = now.getFullYear() + '-' + (now.getMonth().toString().length == 1 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1)
    + '-' + (now.getDate().toString().length == 1 ? '0' + now.getDate() : now.getDate())
</script>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { logout } from '@/api/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useSearchTextState from '@/store/seach'
import useUserInfo from '@/store/user'
import useRouterState from '@/store/router'
import useWebsocketStore from '@/store/websocket'
import { chatOffline } from '@/utils/websocketUtil'
import { successAlert, warningAlert } from '@/utils/AlertUtil'
import { saveMemo, getMemo } from '@/api/memo'
// import { listMenus } from '@/api/menu'
import type { MenuSetting } from '@/interfaces/Entity'

const { height, today = today_format } = defineProps<{ height?: number, today?:string }>()
const searchRef = ref('')
const router = useRouter()
const routerState = useRouterState()
const userStore = useUserInfo()
const searchTextState = useSearchTextState()
const memoVisible = ref(false)
const memoValue = ref('')
const links = reactive<MenuSetting[]>(routerState.getMenus().filter(menu => menu.display))
// const links = ref([
//     { name: '影视', url: '/home' },
// 	{ name: '知识库', url: '/knowledgeBase' },
// 	{ name: '我的', url: '/myCreation' },
// 	{ name: '联系', url: '/chatRoom' },
// 	{ name: '足迹', url: '/footsteps' },
// 	{ name: '备忘录', url: '/memo' },
// 	{ name: '盲盒', url: '/blindBox' },
// ])

const emits = defineEmits(['update:toSearch', 'update:memo'])

onMounted(async () => {
    searchRef.value = searchTextState.getSearchText()
    window.addEventListener('keydown', autoSaveMemo)
    // let res = await listMenus()
    // if (res.data.code === '1') {
    //     warningAlert('菜单请求失败: ' + res.data.msg)
    //     return
    // }
    // links.splice(0)
    // res.data.foreach((menu: MenuSetting) => {
    //     if (menu.display === 1) {
    //         links.push(menu)
    //     }
    // })
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', autoSaveMemo)
})

watch(() => searchRef.value, (value) => {
    searchTextState.setSearchText(value)
})

watchEffect(() => {
    getMemo(today).then(res => {
        if (res.data.code === '1') {
            return
        }
        emits('update:memo', res.data.content)
    })
})

const memoTitle = computed(() => {
    return today + ' 待办'
})

function toLogin() {
    if (userStore.loginName) {
		return
	}
	router.push("/login")
}

function toLogout() {
    if (!userStore.loginName) {
        router.push("/login")
		return
	}
	logout({'username': userStore.loginName}).then(result => {
		if (result.data.code !== '0') {
			message.warning(result.data.msg ? result.data.msg : '退出失败, 请稍后重试', 1)
			return
		}
        chatOffline()
		userStore.setUserState('', '', '', '', '')
        router.push("/login")
	})
}

function onSearch() {
    emits('update:toSearch')
}

function goBack() {
    router.go(-1)
}

function toGetMemo() {
    getMemo(today).then(res => {
        if (res.data.code === '1') {
            warningAlert('网络异常, 请稍后重试')
            return
        }
        memoValue.value = res.data.content
        memoVisible.value = true
    })
}

function memoHandleOk() {
    saveMemo({content: memoValue.value, date: today}).then(res => {
        if (res.data.code === '1') {
            warningAlert('保存失败, 请重试')
            return
        }
        successAlert('保存成功')
    })
}

function drawDivination() {
    warningAlert('暂未开放, 敬请期待')
}

function autoSaveMemo(event: any) {
    if (!memoVisible.value) {
        return
    }
    // 检查是否按下了 Ctrl 键和 S 键
    if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
        // 阻止默认行为（如果有的话，比如浏览器的保存页面功能）
        event.preventDefault()
        // 执行保存操作
        memoHandleOk()
    }
}
</script>

<style lang="scss">
@media (max-width: 576px) {
    #hello {
        display: none;
    }
    #login {
        margin-left: 15px;
    }
    .ant-popover-buttons button {
        margin-left: 3px;
    }
    .ant-popover-message-title {
        width: 110px;
    }
    .ant-layout-header{
        padding: 0;
        line-height: 10px;
    }
    .fish-header {
        width: 100%;
        height: 100px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-left: 24px;
            opacity: 0.85;
        }

        .ant-input-affix-wrapper {
            border: 0px;
            padding: 5px 10px;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }

        .ant-input {
            font-size: x-small;
            border: 0px;
        }

        .ant-btn {
            font-size: x-small;
            border: 0px;
            margin-left: 0px
        }
    
        .left-entry {
            margin-top: 25px;
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
    
            .entry-element {
                margin-left: 15px;
            }
        }
    
        .go-back {
            display: inline-block;
            margin-top: 12px;
            margin-left: 24px;
            color: #fff;
            font-size: x-small;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-top: 12px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            float: none;
            color: #fff;
            font-size: x-small;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: x-small;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 12px;
        margin-top: 12px !important;
    }

    .footer {
        text-align: center;
        height: 12px;
        margin-bottom: 12px;
        margin-top: -10px;
    }
}


@media (min-width: 576px) and (max-width: 768px) {
    #login {
        margin-left: 24px;
    }
    .ant-layout-header{
        padding: 0;
        line-height: 10px;
    }
    .fish-header {
        width: 100%;
        height: 100px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-top: 16px;
            margin-left: 24px;
            opacity: 0.85;
        }

        .ant-input-affix-wrapper {
            border: 0px;
            padding: 5px 10px;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }

        .ant-input {
            font-size: 12px;
            border: 0px;
        }

        .ant-btn {
            font-size: 12px;
            border: 0px;
            margin-left: 0px
        }
    
        .left-entry {
            margin-top: 25px;
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
    
            .entry-element {
                margin-left: 8px;
            }
        }
    
        .go-back {
            display: inline-block;
            margin-top: 12px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-top: 12px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            float: none;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: 10px;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 12px;
        margin-top: 12px !important;
    }

    .footer {
        text-align: center;
        height: 12px;
        margin-bottom: 12px;
        margin-top: -10px;
    }
}

@media (min-width: 768px) and (max-width: 992px) {
    .ant-layout-header{
        padding: 0;
    }
    .fish-header {
        width: 100%;
        height: 144px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-top: 16px;
            opacity: 0.85;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }
    
        .left-entry {
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
            font-size: 14px;
            .entry-element {
                margin-left: 8px;
            }
        }
    
        .go-back {
            display: inline-block;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-right: -12px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: 10px;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 24px;
    }

    .footer {
        text-align: center;
        height: 20px;
        margin-bottom: 20px;
        margin-top: -5px;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    #hello {
        display: inline;
    }
    #login {
        margin-left: 20px;
    }
    .ant-layout-header{
        padding: 0;
    }
    .fish-header {
        width: 100%;
        height: 144px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-top: 16px;
            opacity: 0.85;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }
    
        .left-entry {
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
    
            .entry-element {
                margin-left: 10px;
            }
        }
    
        .go-back {
            display: inline-block;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 24px;
    }

    .footer {
        text-align: center;
        height: 20px;
        margin-bottom: 20px;
        margin-top: -5px;
    }
}
@media (min-width: 1200px) and (max-width: 1600px) {
    #hello {
        display: inline;
    }
    #login {
        margin-left: 20px;
    }
    .ant-layout-header{
        padding: 0;
    }
    .fish-header {
        width: 100%;
        height: 144px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-top: 16px;
            opacity: 0.85;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }
    
        .left-entry {
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
    
            .entry-element {
                margin-left: 15px;
            }
        }
    
        .go-back {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-right: -34px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 24px;
    }

    .footer {
        text-align: center;
        height: 20px;
        margin-bottom: 20px;
        margin-top: -5px;
    }
}
@media (min-width: 1600px) {
    #hello {
        display: inline;
    }
    #login {
        margin-left: 20px;
    }
    .ant-layout-header{
        padding: 0;
    }
    .fish-header {
        width: 100%;
        height: 144px;
        background-color: #fff;
        background-image: url('/header-back.png');
    
        .ant-input-group-wrapper {
            margin-top: 16px;
            opacity: 0.85;
        }
    
        .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    
        .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child { 
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            .ant-input-search-button {
                border-radius: 0 10px 10px 0;
            }
        }
    
        .left-entry {
            float: left;
            list-style-type: none;
            display: flex;
            flex-direction: row;
    
            .entry-element {
                margin-left: 30px;
            }
        }
    
        .go-back {
            display: inline-block;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-right: -2%;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            color: #fff;
            font-size: large;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: large;
            cursor: pointer;
            &:hover {
                color: burlywood
            }
        }
    }

    .content {
        padding: 0px 24px;
    }

    .footer {
        text-align: center;
        height: 20px;
        margin-bottom: 20px;
        margin-top: -5px;
    }
}
</style>