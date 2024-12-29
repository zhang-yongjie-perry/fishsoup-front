<template>
    <Container>
        <a-card :loading="loading1">
            <template #title>
                <span>要点新闻</span>
			</template>
            <a-list :grid="{ gutter: 120, column: 2 }" :data-source="featuredNews" :locale="{ emptyText: '暂无数据' }">
                <template #loadMore>
                    <div v-if="featuredNewsHasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                        <a-spin v-if="featuredNewsLoadingMore" />
                        <a-button v-else @click="toGetFeaturedNewsList()">加载更多</a-button>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-row>
                                    <a-col :xl="19" :xs="19">
                                        <a v-antishake class="title-desc" :href="item.href" target="_blank">{{ item.title }}</a>
                                    </a-col>
                                    <a-col :xl="5" :xs="5">
                                        <div style="width: 100%;text-align: right">{{ item.time }}</div>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
        <a-card :loading="loading2" style="margin-top: 12px;">
            <template #title>
                <span>中外热榜</span>
			</template>
            <a-list :grid="{ gutter: 120, column: 2 }" :data-source="hotList" :locale="{ emptyText: '暂无数据' }">
                <template #loadMore>
                    <div v-if="hotListHasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                        <a-spin v-if="hotListLoadingMore" />
                        <a-button v-else @click="toGetHotList()">加载更多</a-button>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-row>
                                    <a-col :xl="19" :xs="19">
                                        <a v-antishake class="title-desc" :href="item.href" target="_blank">{{ item.title }}</a>
                                    </a-col>
                                    <a-col :xl="5" :xs="5">
                                        <div style="width: 100%;text-align: right">{{ item.time }}</div>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
        <a-card :loading="loading3" style="margin-top: 12px;">
            <template #title>
                <span>前沿科技</span>
			</template>
            <a-list :grid="{ gutter: 120, column: 2 }" :data-source="frontTech" :locale="{ emptyText: '暂无数据' }">
                <template #loadMore>
                    <div v-if="frontTechHasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                        <a-spin v-if="frontTechLoadingMore" />
                        <a-button v-else @click="toGetFrontTechList()">加载更多</a-button>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-row>
                                    <a-col :xl="19" :xs="19">
                                        <a v-antishake class="title-desc" :href="item.href" target="_blank">{{ item.title }}</a>
                                    </a-col>
                                    <a-col :xl="5" :xs="5">
                                        <div style="width: 100%;text-align: right">{{ item.time }}</div>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
        <a-card :loading="loading4" style="margin-top: 12px;">
            <template #title>
                <span>焦点热娱</span>
			</template>
            <a-list :grid="{ gutter: 120, column: 2 }" :data-source="focusHotEntertainment" :locale="{ emptyText: '暂无数据' }">
                <template #loadMore>
                    <div v-if="focusHotEntertainmentHasMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                        <a-spin v-if="focusHotEntertainmentLoadingMore" />
                        <a-button v-else @click="toGetFocusHotEntertainmentList()">加载更多</a-button>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-row>
                                    <a-col :xl="19" :xs="19">
                                        <a v-antishake class="title-desc" :href="item.href" target="_blank">{{ item.title }}</a>
                                    </a-col>
                                    <a-col :xl="5" :xs="5">
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

const loading1 = ref(true)
const loading2 = ref(true)
const loading3 = ref(true)
const loading4 = ref(true)

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

const today = new Date()
const today_format = today.getFullYear() + '-' + (today.getMonth().toString().length == 1 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1)
    + '-' + (today.getDate().toString().length == 1 ? '0' + today.getDate() : today.getDate())

onMounted(() => {
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

function toGetFeaturedNewsList() {
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "1"}, featuredNewsPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        featuredNewsPage.value = featuredNewsPage.value + 1
        featuredNews.push(...res.data)
        featuredNewsHasMore.value = res.data.length === 10 ? true : false
    })
}

function toGetHotList() {
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "ChinaNews", newsType: "2"}, hotListPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        hotListPage.value = hotListPage.value + 1
        hotList.push(...res.data)
        hotListHasMore.value = res.data.length === 10 ? true : false
    })
}

function toGetFrontTechList() {
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "2"}, frontTechPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        frontTechPage.value = frontTechPage.value + 1
        frontTech.push(...res.data)
        frontTechHasMore.value = res.data.length === 10 ? true : false
    })
}

function toGetFocusHotEntertainmentList() {
    listHotNews({time: today_format, title: searchTextState.getSearchText(), site: "qq", newsType: "1"}, focusHotEntertainmentPage.value, 10)
    .then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        focusHotEntertainmentPage.value = focusHotEntertainmentPage.value + 1
        focusHotEntertainment.push(...res.data)
        focusHotEntertainmentHasMore.value = res.data.length === 10 ? true : false
    })
}

</script>

<style lang="scss">

</style>