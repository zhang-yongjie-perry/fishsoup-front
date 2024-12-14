<template>
    <a-row>
        <a-col :xl="16" :xs="24">
            <a-input
                v-model:value="innerValue"
                :allowClear="allowClear"
                :placeholder="placeholder"
            >
            </a-input>
        </a-col>
        <a-col :xl="4" :xs="12">
            <a-button v-antishake id="action1" @click="toLocalSearch">{{ action1 }}</a-button>
        </a-col>
        <a-col :xl="4" :xs="12">
            <a-button v-antishake id="action2" v-if="action2" @click="toNetworkSearch">
                {{ action2 }}
                <SyncOutlined style="margin-right: 10px;" :spin="action2Spin" />
            </a-button>
        </a-col>
    </a-row>
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

<style lang="scss" scoped>
.ant-input-affix-wrapper {
    border-radius: 10px;
}

#action2 {
    padding: 4px 3px 4px 15px
}

.ant-btn {
    border-radius: 10px;
    margin-left: 12px;
}

@media (max-width: 576px) {
    #action1 {
        margin-left: 0px;
    }

    .ant-btn {
        margin-top: 12px;
    }
}
</style>