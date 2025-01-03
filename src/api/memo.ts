import axios from '@/utils/HttpUtil'

export function saveMemo(value: any) {
    return axios.post('/web/memo', value);
}

export function getMemo(value: string) {
    return axios.get(`/web/memo/${value}`);
}