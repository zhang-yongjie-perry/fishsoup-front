<template>
    <Container :today="date" @update:memo="updateMemo" @update:to-search="toSearch">
        <a-row class="tags-search">
            <a-col :xs="24" :sm="8">
                <a-select
                    v-model:value="tagValue"
                    mode="tags"
                    style="width: 90%;"
                    :token-separators="[',']"
                    placeholder="请输入标签进行搜索"
                    allowClear
                ></a-select>
            </a-col>
            <a-col :xs="3" :sm="3">
                <a-button style="border-radius: 5px;" @click="toGetCreationList(1, false)">搜索</a-button>
            </a-col>
        </a-row>
        <a-row class="content" style="margin-top: 12px">
            <a-col :xs="24" :xl="18">
                <a-row>
                    <a-col :span="24">
                        <h1 style="color: #009fe9;">{{ name }}</h1>
                    </a-col>
                </a-row>
                <a-row style="width: 95%;">
                    <a-col :span="24">
                        <hr>
                        <a-list
                        item-layout="horizontal" 
                        :data-source="dataSource" 
                        :locale="{emptyText: '暂无数据'}"
                        :loading="loading">
                            <template #loadMore>
                                <div v-if="hasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                    <a-spin v-if="loadingMore" />
                                    <a-button v-else @click="toGetCreationList(null, true)">加载更多</a-button>
                                </div>
                            </template>
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-list-item-meta :description="item.summary">
                                        <template #title>
                                            <a-row>
                                                <a-col :xl="22" :xs="16">
                                                    <router-link class="title-desc" :to="{path: `/creation/${item.id}`}">
                                                        <span>{{ item.title }}</span>
                                                    </router-link>
                                                    <span v-if="routerState.personal">
                                                        <SvgIcon v-if="item.visibleRange === '1'" iconName="icon-suoding"/>
                                                        <SvgIcon v-else iconName="icon-jiesuo"/>
                                                    </span>
                                                    <span v-else>
                                                        &nbsp;
                                                        <span>[作者：{{ item.author }}]</span>
                                                    </span>
                                                    <span style="margin-left: 5px;">
                                                        <a-tag v-for="tag in item.tags" :color="getTagColor()">{{ tag }}</a-tag>
                                                    </span>
                                                </a-col>
                                                <a-col :xl="2" :xs="8">
                                                    <div style="width: 100%;text-align: right;">{{ item.time }}</div>
                                                </a-col>
                                            </a-row>
                                        </template>
                                    </a-list-item-meta>
                                </a-list-item>
                            </template>
                        </a-list>
                    </a-col>
                </a-row>
            </a-col>
            <a-col class="appendage" :xs="0" :xl="6">
                <div style="position: fixed; top: 22%;left: 75%; right: 2%;">
                    <div :style="{ width: '100%', border: '1px solid #d9d9d9', borderRadius: '4px' }">
                        <a-calendar 
                            :locale="locale"
                            :fullscreen="false"
                            v-model:value="day"
                            @select="onSelect"
                        />
                    </div>
                    <div style="width: 100%;height: 150px;display: flex;justify-content: center;align-items: start ;margin-top: 24px;">
                        <a-textarea style="color: #666;" readonly v-model:value="memoVal" :rows="6"/>
                    </div>
                </div>
            </a-col>
        </a-row>
    </Container>
</template>

<script setup lang="ts">
import { listCreations } from '@/api/creation'
import type { DataItem } from '@/interfaces/Entity'
import { warningAlert } from '@/utils/AlertUtil'
import { onMounted, reactive } from 'vue'
import { useUserInfo } from '@/store/user'
import useRouterState from '@/store/router'
import { ref } from 'vue'
import useSearchTextState from '@/store/seach'
import { Dayjs } from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN' // 仅用于日期组件的汉化
// import zhCN from 'ant-design-vue/es/locale/zh_CN' // 用于 a-config-provider 内部组件的汉化
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getToday } from '@/utils/DateUtiles'

// 需要设置 dayjs 语言模式 cn/en
dayjs.locale('cn')

const { page, name } = defineProps(['page', 'name'])
const userState = useUserInfo()
const routerState = useRouterState()
const dataSource = reactive<DataItem[]>([])
const pageNum = ref(1)
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(false)
const searchTextState = useSearchTextState()
const day = ref<Dayjs>()
const date = ref(getToday())
const memoVal = ref('今天什么事情也没有安排, 请享受这美好时光吧~')
const tagValue = ref<string[]>()
const tagColors = ref(['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'])

onMounted(() => {
    tagValue.value?.splice(0)
    toGetCreationList(1, false)
})

const onSelect = (value: Dayjs) => {
    date.value = value.format('YYYY-MM-DD')
}

function updateMemo(value: string) {
    memoVal.value = value ? value : '今天什么事情也没有安排, 请享受这美好时光吧~'
}

function toGetCreationList(pn: number | null, append: boolean) {
    let classifyVal = page === 'major' ? '1' : page === 'literature' ? '2' : '3'
    let authorVal = routerState.personal ? userState.loginName : ''
    let visibleRangeVal = routerState.personal ? null : '2'
    pageNum.value = pn === null ? pageNum.value + 1 : pn
    listCreations({
        classify: classifyVal, 
        author: authorVal,
        visibleRange: visibleRangeVal,
        content: searchTextState.getSearchText(),
        tags: tagValue.value
    }, pageNum.value, 10).then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg);
            return;
        }
        hasMore.value = res.data.length === 10
        if (append) {
            dataSource.push(...res.data)
            return
        }
        dataSource.splice(0)
        dataSource.push(...res.data)
    })
}

function toSearch(value: string) {
    toGetCreationList(1, false)
}

function getTagColor() {
    return tagColors.value[Math.floor(Math.random() * tagColors.value.length)]
}
</script>

<style lang="scss">
.content {
    // 1vh 等于 1% 可视高度
    min-height: 60vh;
    margin-top: 24px;
    .title-desc {
        padding: 0px;
        color: black
    }
}

.tags-search {
    margin-left: 24px;
}

@media (max-width: 1200px) {
    .appendage {
        display: none;
    }
}

@media (min-width: 1200px) {
    .appendage {
        display: inline-block;
    }
}
</style>