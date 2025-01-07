<template>
    <Container :today="date?.format('YYYY-MM-DD')" @update:memoClose="memoClose" :openMemo="memoVisible" @update:memoSave="refresh">
        <a-calendar
            v-if="calendarShow"
            v-model:value="date"
            :locale="locale"
            @change="change"
            @dblclick.native.stop="toEdit"
            @panelChange="handlePanelChange">
            <template #dateCellRender="{ current }">
                <div style="width: 100%;min-height: 100%;border-radius: 5px;"
                :style="{'background-color': getTodoList(current).color}">
                    <ul class="events">
                        <li v-for="item in getTodoList(current).todo" :key="item.content">
                            <a-tooltip placement="rightTop" :autoAdjustOverflow="true">
                                <template #title>{{ item.content }}</template>
                                <a-badge :status="item.type" :text="item.content" :style="{'color': getTodoList(current).color === 'transparent' ? '#555': 'white'}" />
                            </a-tooltip>
                        </li>
                    </ul>
                </div>
            </template>
        </a-calendar>
        <a-affix :offset-bottom="20">
            <a-button type="primary" @click="toToday">返回今天</a-button>
        </a-affix>
    </Container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dayjs } from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN' // 仅用于日期组件的汉化
// import zhCN from 'ant-design-vue/es/locale/zh_CN' // 用于 a-config-provider 内部组件的汉化
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getToday } from '@/utils/DateUtiles'
import { getMemoList } from '@/api/memo'

// 需要设置 dayjs 语言模式 cn/en
dayjs.locale('cn')
const date = ref<Dayjs>()
let memoDataList: any = {}
const calendarShow = ref(false)
const memoVisible = ref(false)

onMounted(async () => {
    let res = await getMemoList(getToday())
    memoDataList = res.data
    calendarShow.value = true
})

const getTodoList = (value: Dayjs) => {
    return memoDataList[value.format('YYYY-MM-DD')] ? memoDataList[value.format('YYYY-MM-DD')] : {todo: [], color: 'transparent'}
}

const handlePanelChange = (value: Dayjs, mode: string) => {
    date.value = value
    refresh()
}

const toEdit = () => {
    if (!date.value) {
        return
    }
    memoVisible.value = true
}

const memoClose = () => {
    memoVisible.value = false
}

const refresh = async () => {
    calendarShow.value = false
    let res = await getMemoList(date.value ? date.value.format('YYYY-MM-DD') : getToday())
    memoDataList = res.data
    calendarShow.value = true
}

const change = (value: Dayjs) => {
    // date.value = value
    // refresh()
}

const toToday = () => {
    date.value = dayjs()
    refresh()
}
</script>

<style lang="scss">
.events {
    user-select: none;
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>