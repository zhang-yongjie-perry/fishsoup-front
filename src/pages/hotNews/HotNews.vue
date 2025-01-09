<template>
    <Container>
        <a-card v-for="(news, index) in hotNewsList" :loading="news.loading" :style="{'margin-top': index === 0 ? '0' : '12px'}">
            <template #title>
                <span>{{ news.title }}</span>
			</template>
            <a-list :grid="{ xs: 1, sm: 2, md: 2 , lg: 2, xl: 2, xxl: 2, xxxl: 2 }" :data-source="news.dataSource" :locale="{ emptyText: '暂无数据' }">
                <template #loadMore>
                    <div v-if="news.hasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                        <a-spin v-if="news.LoadingMore" />
                        <a-button v-else @click="news.listMore">加载更多</a-button>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-row class="news_row">
                                    <a-col :sm="16" :xs="17">
                                        <a v-antishake class="title-desc" :href="item.href" target="_blank">{{ item.title }}</a>
                                    </a-col>
                                    <a-col :sm="8" :xs="7">
                                        <div style="width: 100%;text-align: right">{{ item.time }}</div>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
    </Container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { DataItem } from '@/interfaces/Entity'
import { listHotNews } from '@/api/creation'
import useSearchTextState from '@/store/seach'
import { warningAlert } from '@/utils/AlertUtil'

const searchTextState = useSearchTextState()

const loading0 = ref(true)
const loading1 = ref(true)
const loading2 = ref(true)
const loading3 = ref(true)
const loading4 = ref(true)

const weiboNews = reactive<DataItem[]>([])
const weiboNewsHasMore = ref(false)
const weiboNewsLoadingMore = ref(false)
const weiboNewsPage = ref(1)

const featuredNews = reactive<DataItem[]>([])
const featuredNewsHasMore = ref(false)
const featuredNewsLoadingMore = ref(false)
const featuredNewsPage = ref(1)

const hotList = reactive<DataItem[]>([])
const hotListHasMore = ref(false)
const hotListLoadingMore = ref(false)
const hotListPage = ref(1)

const frontTech = reactive<DataItem[]>([])
const frontTechHasMore = ref(false)
const frontTechLoadingMore = ref(false)
const frontTechPage = ref(1)

const focusHotEntertainment = reactive<DataItem[]>([])
const focusHotEntertainmentHasMore = ref(false)
const focusHotEntertainmentLoadingMore = ref(false)
const focusHotEntertainmentPage = ref(1)

const hotNewsList = reactive([
    {title: '微博热搜', loading: loading0, dataSource: weiboNews, hasMore: weiboNewsHasMore, LoadingMore: weiboNewsLoadingMore, listMore: toGetWeiboNewsList},
    {title: '要点新闻', loading: loading1, dataSource: featuredNews, hasMore: featuredNewsHasMore, LoadingMore: featuredNewsLoadingMore, listMore: toGetFeaturedNewsList},
    {title: '中外热榜', loading: loading2, dataSource: hotList, hasMore: hotListHasMore, LoadingMore: hotListLoadingMore, listMore: toGetHotList},
    {title: '前沿科技', loading: loading3, dataSource: frontTech, hasMore: frontTechHasMore, LoadingMore: frontTechLoadingMore, listMore: toGetFrontTechList},
    {title: '焦点热娱', loading: loading4, dataSource: focusHotEntertainment, hasMore: focusHotEntertainmentHasMore, LoadingMore: focusHotEntertainmentLoadingMore, listMore: toGetFocusHotEntertainmentList},
])

const today = new Date()
const today_format = today.getFullYear() + '-' + (today.getMonth().toString().length == 1 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1)
    + '-' + (today.getDate().toString().length == 1 ? '0' + today.getDate() : today.getDate())

onMounted(() => {
    // 微博热搜
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "weibo", newsType: "1"}, weiboNewsPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            loading0.value = false
            return
        }
        weiboNewsPage.value = featuredNewsPage.value + 1
        weiboNews.splice(0)
        weiboNews.push(...res.data)
        weiboNewsHasMore.value = res.data.length === 10 ? true : false
        loading0.value = false
    })

    // 要点新闻
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "1"}, featuredNewsPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            loading1.value = false
            return
        }
        featuredNewsPage.value = featuredNewsPage.value + 1
        featuredNews.splice(0)
        featuredNews.push(...res.data)
        featuredNewsHasMore.value = res.data.length === 10 ? true : false
        loading1.value = false
    })

    // 中外热榜
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "2"}, hotListPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            loading2.value = false
            return
        }
        hotListPage.value = hotListPage.value + 1
        hotList.splice(0)
        hotList.push(...res.data)
        hotListHasMore.value = res.data.length === 10 ? true : false
        loading2.value = false
    })

    // 前沿科技
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "2"}, frontTechPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            loading3.value = false
            return
        }
        frontTechPage.value = frontTechPage.value + 1
        frontTech.splice(0)
        frontTech.push(...res.data)
        frontTechHasMore.value = res.data.length === 10 ? true : false
        loading3.value = false
    })

    // 焦点热娱
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "1"}, focusHotEntertainmentPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            loading4.value = false
            return
        }
        focusHotEntertainmentPage.value = focusHotEntertainmentPage.value + 1
        focusHotEntertainment.splice(0)
        focusHotEntertainment.push(...res.data)
        focusHotEntertainmentHasMore.value = res.data.length === 10 ? true : false
        loading4.value = false
    })
})

function toGetWeiboNewsList() {
    weiboNewsLoadingMore.value = true
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "weibo", newsType: "1"}, weiboNewsPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            weiboNewsLoadingMore.value = false
            return
        }
        weiboNewsPage.value = weiboNewsPage.value + 1
        weiboNews.push(...res.data)
        weiboNewsHasMore.value = res.data.length === 10 ? true : false
        weiboNewsLoadingMore.value = false
    })
}

function toGetFeaturedNewsList() {
    featuredNewsLoadingMore.value = true
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "1"}, featuredNewsPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            featuredNewsLoadingMore.value = false
            return
        }
        featuredNewsPage.value = featuredNewsPage.value + 1
        featuredNews.push(...res.data)
        featuredNewsHasMore.value = res.data.length === 10 ? true : false
        featuredNewsLoadingMore.value = false
    })
}

function toGetHotList() {
    hotListLoadingMore.value = true
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "2"}, hotListPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            hotListLoadingMore.value = false
            return
        }
        hotListPage.value = hotListPage.value + 1
        hotList.push(...res.data)
        hotListHasMore.value = res.data.length === 10 ? true : false
        hotListLoadingMore.value = false
    })
}

function toGetFrontTechList() {
    frontTechLoadingMore.value = true
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "2"}, frontTechPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            frontTechLoadingMore.value = false
            return
        }
        frontTechPage.value = frontTechPage.value + 1
        frontTech.push(...res.data)
        frontTechHasMore.value = res.data.length === 10 ? true : false
        frontTechLoadingMore.value = false
    })
}

function toGetFocusHotEntertainmentList() {
    focusHotEntertainmentLoadingMore.value = true
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "1"}, focusHotEntertainmentPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            focusHotEntertainmentLoadingMore.value = false
            return
        }
        focusHotEntertainmentPage.value = focusHotEntertainmentPage.value + 1
        focusHotEntertainment.push(...res.data)
        focusHotEntertainmentHasMore.value = res.data.length === 10 ? true : false
        focusHotEntertainmentLoadingMore.value = false
    })
}
</script>

<style lang="scss">
@media (min-width: 576px) {
    .news_row {
        width: 90%
    }
}
</style>