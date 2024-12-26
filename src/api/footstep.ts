import axios from '@/utils/HttpUtil'

export function recordPlayInfo(value: any) {
    return axios.post('/web/footstep', value)
}

export function pageFootsteps(value: string, pageNum: number, pageSize: number) {
    return axios.get(`/web/footstep/page/${value}/${pageNum}/${pageSize}`)
}