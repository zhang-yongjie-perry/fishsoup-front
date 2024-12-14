<template>
    <Container @update:to-search="toSearch">
        <a-row class="row-tag">
            <a-col :xl="22" :xs="17">
                <a-tag class="tag" v-for="tag in tags" :color="tag.color">{{ tag.content }}</a-tag>
            </a-col>
            <a-col :xl="2" :xs="7">
                <a-button v-antishake id="begin-create" type="primary" @click="toCreateDoc()" style="border-radius: 8px;">开始创作</a-button>
            </a-col>
        </a-row>
        <a-row class="content">
            <a-col :xl="8" :xs="24" v-for="sector in sectorList">
                <a-row>
                    <a-col :xl="19" :xs="20">
                        <h1 style="color: #009fe9;">{{ sector.name }}</h1>
                    </a-col>
                    <a-col class="more-content" :xl="5" :xs="4">
                        <router-link :to="`/creationList/${sector.page}/${sector.name}`">更多>></router-link>
                    </a-col>
                </a-row>
                <a-row id="row-width">
                    <a-col :span="24">
                        <hr>
                        <a-list item-layout="horizontal" :data-source="sector.dataSource" :locale="{emptyText: '暂无数据'}">
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-list-item-meta :description="item.summary">
                                        <template #title>
                                            <a-row>
                                                <a-col :xl="19" :xs="18">
                                                    <router-link class="title-desc" :to="{path: `/creation/${item.id}`}">
                                                        <span>{{ item.title }}</span>
                                                    </router-link>
                                                    <SvgIcon v-if="item.visibleRange === '1'" iconName="icon-suoding"/>
                                                    <SvgIcon v-else iconName="icon-jiesuo"/>
                                                </a-col>
                                                <a-col :xl="5" :xs="6">
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
        </a-row>
    </Container>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
import { onMounted, reactive } from 'vue'
import type { Tag, DataItem } from '@/interfaces/Entity'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'
import { listCreations } from '@/api/creation'
import useUserInfo from '@/store/user'
import { warningAlert } from '@/utils/AlertUtil'
import useRouterState from '@/store/router'
import useSearchTextState from '@/store/seach'

const userState = useUserInfo();
const routerState = useRouterState();
const route = useRouter();
const tags: Tag[] = reactive([
    {content: '专业', color: '#DDDDDD'},
    {content: '文学', color: '#DDDDDD'},
    {content: '随笔', color: '#DDDDDD'},
]);

const searchTextState = useSearchTextState()

const majorDataList: DataItem[] = reactive([])

const literatureDataList: DataItem[] = reactive([])

const essayDataList: DataItem[] = reactive([])

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
    {
        name: '随笔日记',
        page: 'essay',
        dataSource: essayDataList
    },
]);

onMounted(() => {
    routerState.readOnly = true
    routerState.personal = true
    // 查询专业知识
    toListCreations('1')
    // 查询文学作品
    toListCreations('2')
    // 查询日志随笔
    toListCreations('3')
})

function toListCreations(classifyVal: string) {
    listCreations({classify: classifyVal, author: userState.loginName, content: searchTextState.getSearchText()}, 1, 10).then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return;
        }
        switch(classifyVal) {
            case '1':
                majorDataList.splice(0);
                majorDataList.push(...res.data);
                break;
            case '2':
                literatureDataList.splice(0);
                literatureDataList.push(...res.data);
                break;
            case '3':
                essayDataList.splice(0);
                essayDataList.push(...res.data);
                break;
            default:
                break;
        }
    })
}

function toCreateDoc() {
    routerState.readOnly = false
    routerState.personal = true
    route.push("/creation")
}

function toSearch() {
    // 查询专业知识
    toListCreations('1');
    // 查询文学作品
    toListCreations('2');
    // 查询日志随笔
    toListCreations('3');
}
</script>

<style lang="scss">
.tag {
    color: #505050;
    font-size: 14px;
    padding: 3px 24px 3px 24px;
    margin-left: 12px;
    border-radius: 8px;
}

.content {
    // 1vh 等于 1% 可视高度
    min-height: 55vh;
    margin-top: 24px;
    .more-content {
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #666;
        cursor: pointer;
    }
    .title-desc {
        padding: 0px;
        color: black
    }
}

@media (max-width: 576px) {
    .row-tag {
        margin-top: -10px;
        min-height: 32px;
        #begin-create {
            margin-top: 9px;
        }
    }

    #row-width {
        width: 100%;
    }
}

@media (min-width: 1200px) {
    .row-tag {
        margin-top: -12px;
        min-height: 32px;
    }

    #row-width {
        width: 90%;
    }
}
</style>