<template>
    <Container>
        <div class="chat-room">
            <a-layout>
                <a-layout-sider
                breakpoint="sm"
                :collapsed-width="collapsedWidth"
                width="220"
                :collapsible="true"
                v-model:collapsed="collapsed"
                :trigger="null"
                :style="{ overflow: 'auto', height: '74vh' }"
                @breakpoint="breakpoint">
                    <a-menu v-model:selectedKeys="selectedKeys" theme="dark">
                        <a-menu-item v-for="friend in friends" :key="friend.username">
                            <a-row>
                                <a-col :span="19">
                                    <span v-text="friend.username"></span>
                                </a-col>
                                <a-col :span="5">
                                    <span>[{{ friend.onlineStatus }}]</span>
                                    <a-badge :dot="messagesMap[userStore.loginName + ':' + friend.username] 
                                        ? messagesMap[userStore.loginName + ':' + friend.username]!.status == 0 : false">
                                    </a-badge>
                                </a-col>
                            </a-row>
                        </a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <div class="chat-content">
                        <a-row style="padding: 3px 5px">
                            <a-col :span="3">
                                <menu-unfold-outlined
                                v-if="collapsed"
                                class="trigger"
                                @click="() => (collapsed = !collapsed)"/>
                                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                            </a-col>
                            <a-col :span="21">
                                <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ selectedKeys[0] }}</span>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="24">
                                <div class="message-list" ref="msgWin">
                                    <!-- 消息显示区 -->
                                    <div v-for="(message, index) in msgShow" :key="index" class="message-item">
                                        <div style="width: 100%;height: 100%;overflow: auto;">
                                            <DialogBox :content="message.content"
                                            :style="{'float': (message.username === userStore.loginName ? 'right' : 'left')}"
                                            :position="message.username === userStore.loginName ? 'right' : 'left'">
                                                <div>{{ message.username }}</div>
                                            </DialogBox>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="24">
                                <div class="input-area">
                                    <!-- 消息输入框 -->
                                    <a-input-group compact>
                                        <a-textarea v-model:value="inputMessage" :rows="3" placeholder="请输入消息(Ctrl+Enter发送)" @keyup.enter="handleKeyup"/>
                                        <a-button style="margin-top: 12px;" type="primary" @click="sendMessage">发送</a-button>
                                    </a-input-group>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </a-layout-content>
            </a-layout>
        </div>
    </Container>
</template>
  
<script setup lang="ts">
import { reactive, ref, onMounted, watch, useTemplateRef, nextTick, computed } from 'vue'
import { message } from 'ant-design-vue'
import DialogBox from '@/components/DialogBox.vue'
import type { UserInfo, ChatUserInfo } from '@/interfaces/User'
import useUserInfo from '@/store/user'
import { listUsers } from '@/api/user'
import useWebsocketStore from '@/store/websocket'
import Container from '@/components/Container.vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

const userStore = useUserInfo()
const selectedKeys = ref<string[]>([])
const inputMessage = ref('')
const friends = reactive<UserInfo[]>([])
const msgShow: any = reactive([])
const msgWin = ref<any>(null)
const messagesMap: any = useWebsocketStore().getMessage()!
const collapsed = ref(false)
const isXs = ref(false)
const collapsedWidth = ref(0)

onMounted(() => {
    // 进入聊天页置空提醒
    useWebsocketStore().resetCount()
    listUsers().then((res) => {
        if (res.data.code === '1') {
            message.warning('好友列表请求异常 ' + res.data.msg)
            return
        }

        // 重置好友列表
        friends.splice(0)
        friends.push(...res.data)

        // 默认选中的第一个好友, 如果之前选中过则不必重置选中
        if (useWebsocketStore().getChatKey()) {
            selectedKeys.value.splice(0)
            selectedKeys.value.push(useWebsocketStore().getChatKey().split(":")[1])
        } else {
            selectedKeys.value.splice(0)
            selectedKeys.value.push(friends[0].username)
            useWebsocketStore().setChatKey(userStore.loginName + ":" + friends[0].username)
        }

        // 默认选中的好友聊天已读
        useWebsocketStore().readMessage(userStore.loginName + ":" + selectedKeys.value[0])

        // 获取聊天窗dom元素
        msgWin.value = useTemplateRef('msgWin')

        // 清空聊天记录
        msgShow.splice(0)

        // 如果有聊天记录则进行初始化
        if (messagesMap[userStore.loginName + ":" + selectedKeys.value[0]] != null && messagesMap[userStore.loginName + ":" + selectedKeys.value[0]]!.content) {
            msgShow.push(...messagesMap[userStore.loginName + ":" + selectedKeys.value[0]]!.content)
            if (msgWin.value) {
                nextTick(() => {
                    msgWin.value.scrollTop = msgWin.value.scrollHeight
                })
            }
        }
    })
})

useWebsocketStore().$subscribe(() => {
    handleMsgChange(useWebsocketStore().getInstantMsg())
    useWebsocketStore().resetInstantMsg()
})

// 对于同一个变量而言, 先触发watch方法, 后触发computed方法
watch(() => selectedKeys.value, (value) => {
    if (isXs.value) {
        collapsed.value = true
    }
    let key = userStore.loginName + ":" + value[0]
    useWebsocketStore().setChatKey(key)
    // 选中的聊天好友设为已读
    useWebsocketStore().readMessage(key)
    // 重置聊天记录
    msgShow.splice(0)
    msgShow.push(...messagesMap[key]!.content)
    // 调整窗口位置到底部
    nextTick(() => {
        msgWin.value.scrollTop = msgWin.value.scrollHeight
    })
})

// 发送消息
const sendMessage = () => {
    if (inputMessage.value.trim()) {
        const messageToSend = {
            username: userStore.loginName,
            toUsername: selectedKeys.value[0],
            content: inputMessage.value,
            time: new Date().toLocaleString(),
        }
        let websocket = useWebsocketStore().getWebsocket()
        if (!websocket) {
            message.warning('系统连接异常, 请刷新页面重试')
            return
        }
        websocket.send(JSON.stringify(messageToSend))
        inputMessage.value = ''
    }
}

const handleMsgChange = (user: ChatUserInfo | null) => {
    if (!user) {
        return
    }
    if (user.toUsername === 'ONLINE') {
        if (user.username === userStore.loginName) {
            useWebsocketStore().setOnlineStatus(1)
            return
        }
        // 好友上线状态变更
        let friend = friends.find(friend => friend.username === user.username)
        if (!friend) {
            return
        }
        friend.onlineStatus = '在线'
        return
    }
    if (user.toUsername === 'OFFLINE') {
        if (user.username === userStore.loginName) {
            useWebsocketStore().setOnlineStatus(0)
            return
        }
        // 好友下线状态变更
        let friend = friends.find(friend => friend.username === user.username)
        if (!friend) {
            return
        }
        friend.onlineStatus = '离线'
        return
    }

    // 若为当前登录人接收的消息, 且发送人未选中, 则不处理, 但是自己给自己发的消息得处理
    if (selectedKeys.value.length > 0 && selectedKeys.value[0] !== user.username && userStore.loginName !== user.username) {
        return
    }

    // 设为已读
    useWebsocketStore().readMessage(userStore.loginName + ":" + (user.username === userStore.loginName ? user.toUsername : user.username))
    // 聊天窗内容填充
    msgShow.push(user)
    if (!msgWin.value) {
        return
    }
    // 调整窗口位置到底部
    nextTick(() => {
        msgWin.value.scrollTop = msgWin.value.scrollHeight
    })
}

function handleKeyup(event: any) {
    // 检查是否按下了Ctrl键并且键码是Enter
    if (event.ctrlKey && event.key === 'Enter') {
        sendMessage();
    }
}

function breakpoint(param: boolean) {
    isXs.value = param
    if (param) {
        collapsed.value = true
    }
}

</script>

<style scoped>
.ant-layout-sider {
    background-color: #161614;
}
.chat-room {
    height: 66vh;
    display: flex;
    flex-direction: column;
}

.message-list {
    overflow: auto;
    margin-top: 12px;
    padding-left: 10px;
    padding-right: 10px;
    border-right: 1px solid white;
    height: 50vh;
}

.message-item {
    margin-bottom: 10px;
}

.message-content {
    display: block;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #93f482;
}

.message-time {
    /* display: inline-block; */
    margin-left: 10px;
    color: #999;
}

.input-area {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #fafafa;
    border-top: 1px solid #d9d9d9;
    bottom: 0px;
}

.friend-list-header {
    padding: 10px;
    background-color: #161614;
    color: white;
    text-align: center;
}

.friend-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.friend-item {
    padding: 10px;
    cursor: pointer;
    background-color: #222220;
    color: white;
    text-align: center;
    border-bottom: 1px solid #777;
}

.friend-item:hover {
    background-color: #444;
}
</style>