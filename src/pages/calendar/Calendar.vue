<template>
    <Container :today="date ? date.format('YYYY-MM-DD') : getToday()" @update:memoClose="memoClose" :openMemo="memoVisible" @update:memoSave="refresh">
        <a-calendar
            v-if="calendarShow"
            v-model:value="date"
            :locale="locale"
            @change="change"
            @dblclick.native.stop="toEdit"
            @panelChange="handlePanelChange">
            <template #dateFullCellRender="{ current }">
                <hr style="width: 98%;opacity: 0.3;margin: 1px 0;">
                <div class="calendar-cell" :class="getColorClass(current)">
                    <span class="date-num" :class="getFontClass(current)">
                        <span style="float: left;margin-left: 8px;">{{ getLunarCalendar(current) }}</span>
                        <span style="float: right;margin-right: 8px;">{{ current.format('DD') }}</span>
                    </span>
                    <ul class="events">
                        <li v-for="item in getTodoList(current).todo" :key="item.content">
                            <a-tooltip placement="rightTop" :autoAdjustOverflow="true">
                                <template #title>{{ item.content }}</template>
                                <a-badge :status="item.type" :text="item.content"
                                :style="{'color': getTodoList(current).color === 'transparent' ? '#555': 'white'}" />
                            </a-tooltip>
                        </li>
                    </ul>
                </div>
            </template>
        </a-calendar>
        <a-affix :offset-bottom="20">
            <a-button style="border-radius: 5px;" type="primary" @click="toToday">{{ getToday() }}</a-button>
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
import ChineseLunarCalendar from 'chinese-lunar-calendar'

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

const getLunarCalendar = (value: Dayjs) => {
    let clc = ChineseLunarCalendar.getLunar(value.year(), value.month() + 1, value.date())
    return clc.lunarYear + " " + clc.zodiac + " " + clc.dateStr + (clc.solarTerm ? " " + clc.solarTerm : '')
}

const getColorClass = (value: Dayjs) => {
    let memoData = memoDataList[value.format('YYYY-MM-DD')]
    if (!memoData || !memoData.color || memoData.color === 'transparent') {
        return ''
    }
    switch (memoData.color) {
        case '#f84141':
            return 'today-red'
        case 'orange':
            return 'today-orange'
        case '#d0d010':
            return 'today-yellow'
        case '#52c41a':
            return 'today-green'
        case '#29eeee':
            return 'today-cyan'
        case '#7272f6':
            return 'today-blue'
        case '#d801d8':
            return 'today-purple'
        case '#3a3a3a': 
            return 'today-black'
        default:
            return ''
    }
}

const getFontClass = (value: Dayjs) => {
    let memoData = memoDataList[value.format('YYYY-MM-DD')]
    return !memoData || !memoData.color || memoData.color === 'transparent' ? 'date-color-gray' : 'date-color-white' 
}

const handlePanelChange = (value: Dayjs, mode: string) => {
    if (mode === 'year') {
        return
    }
    date.value = value
    refresh()
}

const toEdit = () => {
    if (!date.value) {
        date.value = dayjs()
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
    padding: 0 0 0 8px;
    text-align: left;
}


.today-red {
    background-color: #f84141 !important;
}

.today-orange {
    background-color: orange !important;
}

.today-yellow {
    background-color: #d0d010 !important;
}

.today-green {
    background-color: #52c41a !important;
}

.today-cyan {
    background-color: #29eeee !important;
}

.today-blue {
    background-color: #7272f6 !important;
}

.today-purple {
    background-color: #d801d8 !important;
}

.today-black {
    background-color: #3a3a3a !important;
}

.calendar-cell {
    position: relative;
    width: 98%;
    height: 150px;
    border-radius: 5px;
    overflow: auto;
    user-select: none;
}

.ant-picker-cell:not(.ant-picker-cell-selected) {
    .calendar-cell:hover {
        background-color: #eee;
    }
}

.ant-picker-cell-selected {
    .calendar-cell {
        background-color: #B4D5FF;
    }
}

.date-color-white {
    color : white !important;
}

.date-color-gray {
    color: #555
}

.date-num {
    margin-right: 8px
}

.ant-picker-cell:not(.ant-picker-cell-in-view) {
    .date-num {
        color : #bbb;
    }
}
</style>