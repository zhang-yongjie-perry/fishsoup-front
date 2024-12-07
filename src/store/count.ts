import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCount = defineStore('count', () => {
    const count = ref(0);
    const getState = () => count.value * 2;
    const setState = (newValue: number) => count.value = newValue;
    return {
        getState,
        setState
    }
});

export default useCount;