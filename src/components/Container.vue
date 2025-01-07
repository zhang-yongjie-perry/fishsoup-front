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
        <a-modal cancelText="关闭" okText="保存" 
            v-model:visible="memoVisible" 
            :title="memoTitle" 
            @ok="memoHandleOk"
            @cancel="afterClose"
            style="width: 90%;">
            <div>
                <div :style="{'background-color': colorRef}" style="margin-right: 24px;padding: 3px 10px;border-radius: 5px;user-select: none;display: inline-block;">
                    <span :style="{'color': colorRef === 'transparent' ? '#aaa' : '#fff'}">请选择今天的颜色</span>
                </div>
                <div v-for="color in colors" class="select-color"
                    :style="{'background-color': color.color, 'border': color.color === 'transparent' ? '1px solid #aaa' : '0px'}"
                    @click="getColor(color.color)">
                    <span class="select-font" :style="{'color': color.color === 'transparent' ? '#888' : '#fff'}">{{ color.name }}</span>
                </div>
            </div>
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
import '@/assets/container.scss'
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
import type { MenuSetting } from '@/interfaces/Entity'

const { height, today = today_format, openMemo = false } = defineProps<{ height?: number, today?:string, openMemo?: boolean }>()
const searchRef = ref('')
const router = useRouter()
const routerState = useRouterState()
const userStore = useUserInfo()
const searchTextState = useSearchTextState()
const memoVisible = ref(false)
const memoValue = ref('')
const colorRef = ref('transparent')
const links = reactive<MenuSetting[]>(routerState.getMenus().filter(menu => menu.display))
const colors = ref([
    {color: '#f84141', name: '赤'}, 
    {color: 'orange', name: '橙'},
    {color: '#d0d010', name: '黄'},
    {color: '#52c41a', name: '绿'},
    {color: '#29eeee', name: '青'},
    {color: '#7272f6', name: '蓝'},
    {color: '#d801d8', name: '紫'},
    {color: '#3a3a3a', name: '黑'},
    {color: 'transparent', name: '无'}, 
])

const emits = defineEmits(['update:toSearch', 'update:memo', 'update:memoClose', 'update:memoSave'])

onMounted(async () => {
    searchRef.value = searchTextState.getSearchText()
    window.addEventListener('keydown', autoSaveMemo)
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
    
    if (openMemo) {
        toGetMemo()
    }
})

const memoTitle = computed(() => {
    return today + ' 待办: 以#开头表示待完成, 以$开头表示已完成, 任务需以回车作为结尾'
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
        memoValue.value = res.data ? res.data.content : ''
        colorRef.value = res.data ? res.data.color : 'transparent'
        memoVisible.value = true
    })
}

function memoHandleOk() {
    saveMemo({content: memoValue.value, date: today, color: colorRef.value}).then(res => {
        if (res.data.code === '1') {
            warningAlert('保存失败, 请重试')
            return
        }
        successAlert('保存成功')
        emits('update:memoSave')
    })
}

function afterClose() {
    emits('update:memoClose', false)
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

function getColor(color: string) {
    colorRef.value = color
}
</script>

<style lang="scss">
</style>