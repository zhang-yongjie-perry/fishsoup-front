<template>
    <Container @update:to-search="toSearch">
        <a-row class="row-tag">
            <a-col :span="24">
                <a-tag class="tag" v-for="tag in tags" :color="tag.color">{{ tag.content }}</a-tag>
            </a-col>
        </a-row>
        <a-row class="content" style="margin-top: 24px">
            <a-col :xl="8" :xs="24">
                <a-row>
                    <a-col :xl="19" :xs="20">
                        <h1 style="color: #009fe9">热点新闻</h1>
                    </a-col>
                    <a-col class="more-content" :xl="5" :xs="4">
                        <router-link to="/hotNews">更多>></router-link>
                    </a-col>
                </a-row>
                <a-row class="row-width">
                    <a-col :span="24">
                        <hr>
                        <a-list item-layout="horizontal" :data-source="hotsDataList" :locale="{ emptyText: '暂无数据' }">
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-list-item-meta :description="item.desc">
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
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xl="8" :xs="24" v-for="sector in sectorList">
                <a-row>
                    <a-col :xl="19" :xs="20">
                        <h1 style="color: #009fe9">{{ sector.name }}</h1>
                    </a-col>
                    <a-col class="more-content" :xl="5" :xs="4">
                        <router-link :to="`/creationList/${sector.page}/${sector.name}`">更多>></router-link>
                    </a-col>
                </a-row>
                <a-row class="row-width">
                    <a-col :span="24">
                        <hr>
                        <a-list item-layout="horizontal" :data-source="sector.dataSource" :locale="{ emptyText: '暂无数据' }">
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-list-item-meta :description="item.summary">
                                        <template #title>
                                            <a-row>
                                                <a-col :xl="19" :xs="18">
                                                    <router-link class="title-desc"
                                                        :to="{ path: `/creation/${item.id}` }">
                                                        <span>{{ item.title }}</span>
                                                    </router-link>
                                                    &nbsp
                                                    <span>[作者：{{ item.author }}]</span>
                                                </a-col>
                                                <a-col :xl="5" :xs="6">
                                                    <div style="width: 100%;text-align: right">{{ item.time }}</div>
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
        </a-row>
    </Container>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
import { reactive, onMounted } from 'vue'
import type { Tag, DataItem } from '@/interfaces/Entity'
import { listCreations, listHotNews } from '@/api/creation'
import { warningAlert } from '@/utils/AlertUtil'
import useRouterState from '@/store/router'
import useSearchTextState from '@/store/seach'

const routerState = useRouterState()
const tags: Tag[] = reactive([
    { content: '科技', color: '#DDDDDD' },
    { content: '财经', color: '#DDDDDD' },
    { content: '建筑', color: '#DDDDDD' },
    { content: '医学', color: '#DDDDDD' },
    { content: '法律', color: '#DDDDDD' },
    { content: '编程', color: '#DDDDDD' },
])

const searchTextState = useSearchTextState()

let hotsDataList: DataItem[] = reactive([])

let majorDataList: DataItem[] = reactive([])

let literatureDataList: DataItem[] = reactive([])

const sectorList: any = reactive([
    {
        name: '专业知识',
        page: 'major',
        dataSource: majorDataList
    },
    {
        name: '文学作品',
        page: 'literature',
        dataSource: literatureDataList
    },
])

onMounted(() => {
    routerState.readOnly = true
    routerState.personal = false
    // 查询热点新闻
    toListHotNews()
    // 查询专业知识
    toListCreations('1')
    // 查询文学作品
    toListCreations('2')
})

let today = new Date()
let today_format = today.getFullYear() + '-' + (today.getMonth().toString().length == 1 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1)
    + '-' + (today.getDate().toString().length == 1 ? '0' + today.getDate() : today.getDate()) 
function toListHotNews() {
    listHotNews({time: today_format, title: searchTextState.getSearchText()}, 10).then(res => {
    if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        hotsDataList.splice(0)
        hotsDataList.push(...res.data)
    })
}

function toListCreations(classifyVal: string) {
    listCreations({classify: classifyVal, visibleRange: '2', content: searchTextState.getSearchText()}, 1, 10).then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        switch (classifyVal) {
            case '1':
                majorDataList.splice(0)
                majorDataList.push(...res.data)
                break
            case '2':
                literatureDataList.splice(0)
                literatureDataList.push(...res.data)
                break
            default:
                break
        }
    })
}

function toSearch() {
    // 查询专业知识
    toListCreations('1')
    // 查询文学作品
    toListCreations('2')
}
</script>

<style lang="scss">
@media (max-width: 576px) {
    .row-tag {
        margin-top: -10px;
        min-height: 32px;
    }

    .row-width {
        width: 100%;
    }

    .tag {
        color: #505050;
        font-size: small;
        padding: 3px 24px 3px 24px;
        margin-left: 12px;
        margin-top: 10px;
        border-radius: 8px;
    }

    .content {
        .more-content {
            font-size: 10px;
            display: flex;
            align-items: center;
            color: #666;
            cursor: pointer;
        }

        .title-desc {
            padding: 0px;
            color: black;
        }
    }
}

@media (min-width: 1200px) {
    .row-tag {
        margin-top: -12px;
        min-height: 32px;
    }

    .row-width {
        width: 90%;
    }

    .tag {
        color: #505050;
        font-size: 14px;
        padding: 3px 24px 3px 24px;
        margin-left: 12px;
        border-radius: 8px;
    }
    .content {
        .more-content {
            font-size: 12px;
            display: flex;
            align-items: center;
            color: #666;
            cursor: pointer;
        }

        .title-desc {
            padding: 0px;
            color: black;
        }
    }
}

</style>