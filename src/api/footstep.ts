import axios from '@/utils/HttpUtil'

export function recordPlayInfo(value: any) {
    return axios.post('/footstep', value)
}

export function pageFootsteps(value: string, pageNum: number, pageSize: number) {
    return axios.get(`/footstep/page/${value}/${pageNum}/${pageSize}`)
}