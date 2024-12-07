<template>
    <a-layout class="fish-home">
        <a-layout-header class="fish-header">
            <a-row>
                <a-col :span="9">
                    <ul class="left-entry">
                        <li v-for="link in links" class="entry-element">
                            <router-link :to="link.url" style="background-color: transparent;">
                                <span class="entry-title" :style="{
                                    'font-weight': routerState.to === link.url ? 'bold' : 'normal',
                                    'text-decoration': routerState.to === link.url ? 'underline' : 'none'
                                    }">{{ link.name }}</span>
                            </router-link>
                        </li>
                    </ul>
                </a-col>
                <a-col :span="9">
                    <a-input-search
                        v-model:value="searchRef"
                        :allowClear="true"
                        placeholder="请输入查询内容"
                        @search="onSearch">
                        <template #enterButton>
                            <a-button>搜索</a-button>
                        </template>
                    </a-input-search>
                </a-col>
                <a-col :span="1" :offset="1">
                    <span class="go-back" @click="goBack()">返回</span>
                </a-col>
                <a-col :span="4">
                    <ul class="right-entry">
                        <li>
                            <span class="entry-username" @click="toLogin()">{{ userStore.loginName ? "hi~ " + userStore.loginName : "登录" }}</span>
                        </li>
                        <li style="margin-left: 20px;">
                            <div style="display: inline-block;">
                                <span v-if="!userStore.loginName" class="entry-username">尚未登录</span>
                                <a-collapse v-else class="collapse" v-model:activeKey="activeKey">
                                    <a-collapse-panel header="管理" key="1" :bordered="false" :showArrow="false">
                                        <ul style="list-style-type: none;padding-inline-start: 0;cursor: pointer;" >
                                            <li>资料</li>
                                            <li>设置</li>
                                            <li @click="toLogout()">退出</li>
                                        </ul>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                        </li>
                    </ul>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout :style="{'padding': '12px 24px 12px 24px', 'min-height': height + 'px'}">
            <slot></slot>
        </a-layout>
        <a-layout-footer style="text-align: center;height: 20px;margin-bottom: 20px;margin-top: 0px;">路虽远，行则将至；梦虽遥，做则必成</a-layout-footer>
    </a-layout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { logout } from '@/api/user'
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import useSearchTextState from '@/store/seach';
import useUserInfo from '@/store/user';
import useRouterState from '@/store/router';

const { height } = defineProps(['height'])
const searchRef = ref('');
const router = useRouter();
const routerState = useRouterState();
const activeKey = ref<string[]>([]);
const userStore = useUserInfo();
const searchTextState = useSearchTextState();
const links = ref([
    { name: '影视', url: '/home' },
	{ name: '知识库', url: '/knowledgeBase' },
	{ name: '我的', url: '/myCreation' },
	{ name: '足迹', url: '/footsteps' },
])

const emits = defineEmits(['update:toSearch'])

onMounted(() => {
    searchRef.value = searchTextState.getSearchText();
})

watch(() => searchRef.value, (value) => {
    searchTextState.setSearchText(value);
});

function toLogin() {
    if (userStore.loginName) {
		return;
	}
	router.push("/login");
}

function toLogout() {
    if (!userStore.loginName) {
		return;
	}
	logout({'username': userStore.loginName}).then(result => {
		if (result.data.code !== '0') {
			message.warning(result.data.msg ? result.data.msg : '退出失败, 请稍后重试', 1)
			return;
		}
		userStore.setUserState("", "", "");
	})
}

function onSearch() {
    emits('update:toSearch');
}

function goBack() {
    router.go(-1);
}
</script>

<style lang="scss">
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
        color: #fff;
        font-size: 18px;
        cursor: pointer;
    }

	.right-entry {
		float: right;
		list-style-type: none;
		display: flex;
		flex-direction: row;
        .collapse {
            width: 100%;
            height: 100%; 
            background-color: transparent;
            border: none;
            align-items: center;
            justify-content: center;
        }
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

.ant-collapse {
    border: none;
    .ant-collapse-item {
        border: none;
        .ant-collapse-header {
            font-size: large;
            color: #fff;
            &:hover {
                font-weight: lighter;
            }
        }
    }
}

.ant-collapse-content {
    border: none;
    font-size: medium;
    color: #fff;
    background-color: transparent;
    .ant-collapse-content-box {
        padding-top: 0px;
        padding-bottom: 0px;
    }
}
</style>