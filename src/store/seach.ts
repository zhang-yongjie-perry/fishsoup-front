import { defineStore } from "pinia";
import { ref } from 'vue';

export const useSearchTextState = defineStore('fish-search-text', () => {
    const searchText = ref('');
    const getSearchText = () => searchText.value;
    const setSearchText = (value: string) => searchText.value = value;
    return {
        searchText,
        getSearchText,
        setSearchText 
    }
});

export default useSearchTextState;