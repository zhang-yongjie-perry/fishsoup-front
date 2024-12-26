import axios from '@/utils/HttpUtil'

export function listPics8k() {
    return axios.get('/web/picture/8k')
}

export function pagePics4k(value: any, pageNum: number, pageSize: number) {
    return axios.post(`/web/picture/4k/${pageNum}/${pageSize}`, value)
}

export function searchPics() {
    return axios.get('/web/picture/search')
}
