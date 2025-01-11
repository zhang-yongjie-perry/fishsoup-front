import { useRouterState } from '@/store/router'
import useUserInfo from '@/store/user'
import useWebsocketStore from '@/store/websocket'

export const connectWebSocket = () => {
    const userState = useUserInfo()
    const routerState = useRouterState()
    const websocketStore = useWebsocketStore()
    // WebSocket连接
    websocketStore.setWebsocket(new WebSocket(import.meta.env.VITE_WS_URL + "?Authorization=" + userState.token))
    const websocket: WebSocket = websocketStore.getWebsocket()!
    websocket.onopen = () => {
        if (userState.token) {
            websocket.send(userState.token)
            useWebsocketStore().setOnlineStatus(1)
        }
    }

    websocket.onmessage = async (event: any) => {
        let user = JSON.parse(event.data)
        let key = userState.loginName + ":" + (user.username === userState.loginName ? user.toUsername : user.username)
        // 设置即时消息的场景: 自己发送的消息、聊天窗当前选中的聊天
        if (user.toUsername === 'ONLINE' || user.toUsername === 'OFFLINE'
            || userState.loginName === user.username || key === useWebsocketStore().getChatKey()) {
            // 自己发送的消息
            useWebsocketStore().setInstantMsg(user)
        }
        if (user.toUsername === 'ONLINE' || user.toUsername === 'OFFLINE') {
            return
        }
        // 保存接收到的消息
        useWebsocketStore().setMessage(key, user)
        // 若发送人未被选中则设为未读
        useWebsocketStore().unreadMessage(key)
        // 若不为聊天窗则提醒+1
        if (routerState.to !== '/chatRoom') {
            useWebsocketStore().increaseCount()
        }
    }
}

export const chatOnline = () => {
    const userState = useUserInfo()
    const websocket = useWebsocketStore().getWebsocket()
    useWebsocketStore().setOnlineStatus(1)
    if (websocket == null) {
        connectWebSocket()
        return
    }
    if (websocket.readyState == WebSocket.OPEN) {
        websocket.send(userState.token)
    }
}

export const chatOffline = () => {
    const userState = useUserInfo()
    const messageToSend = {
        username: userState.loginName,
        toUsername: "OFFLINE",
        content: "下线",
        time: new Date().toLocaleString(),
    }
    const websocket = useWebsocketStore().getWebsocket()
    useWebsocketStore().setOnlineStatus(0)
    websocket?.send(JSON.stringify(messageToSend))
}