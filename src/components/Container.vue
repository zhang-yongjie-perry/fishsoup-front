<template>
    <a-layout class="fish-home">
        <a-layout-header class="fish-header">
            <a-row>
                <a-col :xl="{span: 9, pull: 0}" :xs="{span: 12, pull: 1}">
                    <ul class="left-entry">
                        <li v-for="link in links" class="entry-element">
                            <a-badge v-if="link.url === '/chatRoom'" :count="useWebsocketStore().getCount()">
                                <router-link :to="link.url" style="background-color: transparent;">
                                    <span class="entry-title" :style="{
                                        'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                        'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                    }">{{ link.name }}</span>
                                </router-link>
                            </a-badge>
                            <router-link v-else :to="link.url" style="background-color: transparent;">
                                <span class="entry-title" :style="{
                                    'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                    'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                }">{{ link.name }}</span>
                            </router-link>
                        </li>
                    </ul>
                </a-col>
                <a-col :xl="{span: 8, pull: 0}" :xs="{span: 12, pull: 1}">
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
                <a-col :xl="{span: 1, push: 1}" :xs="{span: 3, push: 1}">
                    <div class="go-back" @click="goBack()">返回</div>
                </a-col>
                <a-col :xl="{span: 5, push: 1}" :xs="{span: 20, push: 0}">
                    <ul class="right-entry">
                        <li>
                            <span v-if="userStore.loginName" class="entry-username">
                                您好, 
                                <a-dropdown placement="bottom">
                                    <a class="ant-dropdown-link" @click.prevent style="background-color: transparent;">
                                        <span class="entry-username">{{ userStore.loginName }}</span>
                                        <DownOutlined />
                                    </a>
                                    <template #overlay>
                                        <a-menu style="opacity: 0.9;">
                                            <a-menu-item>
                                                <router-link to="/personalInfo" style="background-color: transparent;">
                                                    个人信息
                                                </router-link>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </span>
                            <span v-else class="entry-username">"游客"</span>
                        </li>
                        <li style="margin-left: 20px;">
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
        <a-layout-footer class="footer">路虽远，行则将至；梦虽遥，做则必成</a-layout-footer>
    </a-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { logout } from '@/api/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useSearchTextState from '@/store/seach'
import useUserInfo from '@/store/user'
import useRouterState from '@/store/router'
import DownOutlined from 'ant-design-vue'
import useWebsocketStore from '@/store/websocket'
import { connectWebSocket, chatOffline } from '@/utils/websocketUtil'

const { height } = defineProps(['height'])
const searchRef = ref('')
const router = useRouter()
const routerState = useRouterState()
const userStore = useUserInfo()
const searchTextState = useSearchTextState()
const links = ref([
    { name: '影视', url: '/home' },
	{ name: '知识库', url: '/knowledgeBase' },
	{ name: '我的', url: '/myCreation' },
	{ name: '联系', url: '/chatRoom' },
	{ name: '足迹', url: '/footsteps' },
])

const emits = defineEmits(['update:toSearch'])

onMounted(() => {
    searchRef.value = searchTextState.getSearchText()
})

watch(() => searchRef.value, (value) => {
    searchTextState.setSearchText(value)
});

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
</script>

<style lang="scss">
@media (max-width: 389px) {
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
                margin-left: 3px;
            }
        }
    
        .go-back {
            display: inline-block;
            margin-top: 16px;
            margin-left: 13px;
            color: #fff;
            font-size: x-small;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-top: 16px;
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


@media (min-width: 390px) and (max-width: 647px) {
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
            font-size: small;
            border: 0px;
        }

        .ant-btn {
            font-size: small;
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
                margin-left: 3px;
            }
        }
    
        .go-back {
            display: inline-block;
            margin-top: 16px;
            margin-left: 13px;
            color: #fff;
            font-size: small;
            cursor: pointer;
        }
    
        .right-entry {
            float: right;
            margin-top: 16px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
        }
    
        .entry-username {
            float: none;
            color: #fff;
            font-size: small;
            cursor: pointer;
        }
    
        .entry-title {
            color: #fff;
            font-size: small;
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

@media (min-width: 648px) and (max-width: 1495px) {
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
                margin-left: 20px;
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
            margin-right: 34px;
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

@media (min-width: 1496px) {
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
                margin-left: 50px;
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
            margin-right: 34px;
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