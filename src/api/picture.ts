import axios from '@/utils/HttpUtil'

export function listPics8k() {
    return axios.get('/picture/8k')
}

export function pagePics4k(value: any, pageNum: number, pageSize: number) {
    return axios.post(`/picture/4k/${pageNum}/${pageSize}`, value)
}

export function searchPics() {
    return axios.get('/picture/search')
}
