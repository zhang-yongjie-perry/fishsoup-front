import { defineStore } from "pinia"
import { reactive, toRefs } from 'vue'
import type { MenuSetting } from '@/interfaces/Entity'

declare type RouterUrl = {
    from?: string,
    to?: string,
    readOnly?: boolean,
    personal?: boolean,
    menus?: MenuSetting[]
}

export const useRouterState = defineStore('fish-router', () => {
    const routerUrl = reactive<RouterUrl>({
        from: '',
        to: '',
        readOnly: true,
        personal: true,
        menus: []
    })
    const getRouterState = (): RouterUrl => routerUrl
    const setRouterState = (fromVal: string, toVal: string, readOnly: boolean, personal: boolean) => {
        routerUrl.from = fromVal
        routerUrl.to = toVal
        routerUrl.readOnly = readOnly
        routerUrl.personal = personal
    }
    const getMenus = (): MenuSetting[] => routerUrl.menus ? routerUrl.menus : []
    const setMenus = (ms: MenuSetting[]) => {
        routerUrl.menus?.splice(0)
        routerUrl.menus?.push(...ms)
    }
    const getHomeMenu = (): MenuSetting => routerUrl.menus ? routerUrl.menus[0] : {
        id: '',
        menuId: '',
        name: '',
        url: '',
        sort: 0,
        display: true,
        remark: ''
    }
    return {
        ...toRefs(routerUrl),
        getRouterState,
        setRouterState,
        getMenus,
        setMenus,
        getHomeMenu
    }
}, {
    persist: {
        key: 'fish-router',
        serializer: {
            deserialize: JSON.parse,
            serialize: JSON.stringify
        },
        storage: sessionStorage
    }
})

export default useRouterState