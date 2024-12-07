<template>
    <a-input
        v-model:value="innerValue"
        :allowClear="allowClear"
        :placeholder="placeholder"
    >
    </a-input>
    <a-button id="action1" @click="toLocalSearch">{{ action1 }}</a-button>
    <a-button id="action2" v-if="action2" @click="toNetworkSearch">
        {{ action2 }}
        <SyncOutlined style="margin-right: 10px;" :spin="action2Spin" />
    </a-button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'

const { value, allowClear, placeholder, action1, action2, action2Spin = false } = defineProps(['value', 'allowClear', 'placeholder', 'action1', 'action2', 'action2Spin'])
const innerValue = ref(value)

const emit = defineEmits(['update:searchValue', 'update:toLocalSearch', 'update:toNetworkSearch'])

watch(() => innerValue.value, (newVal) => {
    emit('update:searchValue', newVal)
})

function toLocalSearch() {
    emit('update:toLocalSearch', innerValue.value)
}

function toNetworkSearch() {
    emit('update:toNetworkSearch', innerValue.value)
}

</script>

<style lang="scss">
.ant-input-affix-wrapper {
    border-radius: 10px;
}

.ant-btn {
    border-radius: 10px;
    margin-left: 12px;
}

#action2 {
    padding: 4px 3px 4px 15px
}
</style>