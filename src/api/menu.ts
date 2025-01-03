import axios from '@/utils/HttpUtil'
import type { MenuSetting } from '@/interfaces/Entity'

export function saveMenuSetting(value: MenuSetting[]) {
    return axios.post('/web/menu', value)
}

export function listMenus() {
    return axios.get('/web/menu/personal')
}