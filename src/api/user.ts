import axios from '@/utils/HttpUtil'
import type { UserInfo } from '@/interfaces/User'

export function login(value: UserInfo, publicKey: string) {
    return axios.post(`/user/auth/login?publicKey=${publicKey}`, value)
}

export function logout(value: {}) {
    return axios.post('/user/auth/logout', value)
}

export function register(value: UserInfo) {
    return axios.post('/user/auth/register', value)
}

export function saveUser(value: UserInfo) {
    return axios.post('/user/save', value)
}

export function listUsers() {
    return axios.get('/user/chat/list')
}

export function getPublicKey() {
    return axios.get('/user/auth/publicKey')
}