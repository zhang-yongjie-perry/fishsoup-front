import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { MessageEntity } from '@/interfaces/Entity'
import type { UserInfo, ChatUserInfo } from '@/interfaces/User'

interface WebSocketWrapper {
    websocket: WebSocket | null,
    messageMap: any,
    count: number,
    chatKey: string,
    instantMsg: ChatUserInfo | null,
     // 1 在线, 0 离线
    onlineStatus: number
}

export const useWebsocketStore = defineStore('websocket-wrapper', () => {
    const websocketStore = reactive<WebSocketWrapper>({
        websocket: null,
        messageMap: new Map<string, MessageEntity>(),
        count: 0,
        chatKey: '',
        instantMsg: null,
        onlineStatus: 0
    })
    const getWebsocket = () => websocketStore.websocket
    const setWebsocket = (value: WebSocket | null) => websocketStore.websocket = value
    const getMessage = () => websocketStore.messageMap
    const setMessage = (key: string, value: any) => {
        if (!websocketStore.messageMap[key]) {
            websocketStore.messageMap[key] = {
                status: 0,
                content: new Array<UserInfo>()
            }
        }
        if (value) {
            websocketStore.messageMap[key]!.content.push(value)
        }
    }
    const readMessage = (key: string) => {
        if (!websocketStore.messageMap[key]) {
            setMessage(key, null)
        }
        websocketStore.messageMap[key]!.status = 1
    }
    const unreadMessage = (key: string) => {
        if (!websocketStore.messageMap[key]) {
            setMessage(key, null)
        }
        
        websocketStore.messageMap[key]!.status = 0
    }
    const getCount = () => websocketStore.count
    const increaseCount = () => {
        websocketStore.count = websocketStore.count + 1
    }
    const resetCount = () => {
        websocketStore.count = 0
    }
    const getInstantMsg = (): ChatUserInfo | null => websocketStore.instantMsg
    const setInstantMsg = (value: ChatUserInfo | null) => {
        websocketStore.instantMsg = value
    }
    const resetInstantMsg = () => websocketStore.instantMsg = null
    const getChatKey = (): string => websocketStore.chatKey
    const setChatKey = (value: string) => websocketStore.chatKey = value
    const getOnlineStatus = () => websocketStore.onlineStatus
    const setOnlineStatus = (value: number) => websocketStore.onlineStatus = value
    return {
        ...toRefs(websocketStore),
        getWebsocket,
        setWebsocket,
        getMessage,
        setMessage,
        readMessage,
        unreadMessage,
        getCount,
        increaseCount,
        resetCount,
        setInstantMsg,
        getInstantMsg,
        resetInstantMsg,
        getChatKey,
        setChatKey,
        getOnlineStatus,
        setOnlineStatus
    }
}, {
    persist: {
        key: 'websocket-wrapper',
        storage: sessionStorage,
        // omit 用于设置不保存的属性, pick 用于设置需要保存的属性
        omit: ['websocket']
    }
})

export default useWebsocketStore