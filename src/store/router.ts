import { defineStore } from "pinia";
import { reactive, toRefs } from 'vue';

declare type RouterUrl = {
    from?: string,
    to?: string,
    readOnly?: boolean,
    personal?: boolean,
}

export const useRouterState = defineStore('fish-router', () => {
    const routerUrl = reactive<RouterUrl>({
        from: '',
        to: '',
        readOnly: true,
        personal: true,
    });
    const getRouterState = (): RouterUrl => routerUrl;
    const setRouterState = (fromVal: string, toVal: string, readOnly: boolean, personal: boolean) => {
        routerUrl.from = fromVal;
        routerUrl.to = toVal;
        routerUrl.readOnly = readOnly;
        routerUrl.personal = personal;
    }
    return {
        ...toRefs(routerUrl),
        getRouterState,
        setRouterState
    }
}, {
    persist: {
        key: 'fish-router',
        storage: localStorage
    }
});

export default useRouterState;