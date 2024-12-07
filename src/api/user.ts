import axios from '@/utils/HttpUtil'
import type { UserInfo } from '@/interfaces/User'

export function login(value: UserInfo) {
    return axios.post('/user/login', value);
}

export function logout(value: {}) {
    return axios.post('/user/logout', value);
}

export function register(value: UserInfo) {
    return axios.post('/user/register', value);
}