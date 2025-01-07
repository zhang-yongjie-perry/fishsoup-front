import { listMenus } from '@/api/menu'
import { warningAlert } from '@/utils/AlertUtil'
import router from '@/router'
import useRouterState from '@/store/router'

export const init = async () => {
    const routerState = useRouterState()
    let res = await listMenus()

    if (res.data.code === '1') {
        warningAlert('获取菜单失败: ' + res.data.msg)
        router.push("/login")
        return
    }
    let menus = res.data.map((menu: any) => {
        menu.display = menu.display === 'true' ? true : false
        return menu
    })
    routerState.setMenus(menus)
}