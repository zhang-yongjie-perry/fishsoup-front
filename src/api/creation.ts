import axios from '@/utils/HttpUtil'
import type { Creation } from '@/interfaces/Entity'

export function uploadImg(value: any) {
    let config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
    return axios.post('/image/upload', value, config);
}

export function saveCreation(value: Creation) {
    return axios.post('/creation', value);
}

export function downloadImg(imageName: string) {
    return axios.get('/image/download?imageName=' + imageName);
}

export function listCreations(value: any, pageNum: number, pageSize: number) {
    return axios.post(`/creation/list/${pageNum}/${pageSize}`, value);
}

export function getCreation(value: string) {
    return axios.get(`/creation/${value}`);
}

export function listHotNews(value: any, limit: number) {
    return axios.post(`/hotNews/list/${limit}`, value)
}