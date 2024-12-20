<template>

</template>

<script setup lang="ts">

</script>

<style lang="scss"></style>

<template>
    <div style="width: 100%;">
        <router-view></router-view>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import useWebsocketStore from '@/store/websocket'
import useUserInfo from '@/store/user'
import useRouterState from '@/store/router'

const websocketStore = useWebsocketStore()
const userStore = useUserInfo()
const routerState = useRouterState()

const initWebSocket = () => {
    // WebSocket连接
    websocketStore.setWebsocket(new WebSocket('ws://localhost:9000/fish'), new Array(), 0)
    let websocket: WebSocket = websocketStore.getWebsocket().websocket!
    websocket.onopen = () => {
        websocket.send(userStore.token)
    }

    websocket.onmessage = (event: any) => {
        console.log('接到消息');
        if (routerState.to === '/chatRoom') {
        return
        }
        console.log('开始保存');
        websocketStore.setMessage(JSON.parse(event.data))
        websocketStore.increaseCount()
    }

    websocket.onerror = () => {
        console.log('WebSocket连接错误')
    
    }

    websocket.onclose = () => {
        console.log('WebSocket连接关闭')
    }
}

onMounted(() => {
    initWebSocket()
})

onBeforeUnmount(() => {
    let websocket: WebSocket | null = websocketStore.getWebsocket().websocket
    if (websocket) {
        websocket.close()
    }
})
</script>