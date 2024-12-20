import { defineStore } from 'pinia'
import { reactive, toRefs } from "vue"

interface IUserState {
    loginName: string,
    token: string,
    sex: string,
    mobilePhone: string,
    email: string
}

export const useUserInfo = defineStore('fish-user', () => {
    const state = reactive<IUserState>({
        loginName: '',
        token: '',
        sex: '未知',
        mobilePhone: '',
        email: ''
    })

    const getState = (): IUserState => state;

    const setUserState = (loginName: string, token: string, mobilePhone: string, email: string, sex: string) => {
        state.loginName = loginName
        state.token = token
        state.sex = sex
        state.mobilePhone = mobilePhone
        state.email = email
    }

    return {
        ...toRefs(state),
        getState,
        setUserState
    }
}, {
    persist: {
        key: 'fish-user',
        storage: localStorage
    }
})

// 此处不可用useUserInfo调用时pinia还未完成初始化
// 如果在组件的setup中进行订阅, 组件销毁时希望订阅仍然有效, 本方法需要传递第二个参数：{ detached: true }
// useUserInfo().$subscribe((mutation, state) => {
//     console.log('mutation', mutation);
    
//     // 每当状态发生变化时，将整个 state 持久化到本地存储。
//     localStorage.setItem('fish-user', JSON.stringify(state))
// })
export default useUserInfo