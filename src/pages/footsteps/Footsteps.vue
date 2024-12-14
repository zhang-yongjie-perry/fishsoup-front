<template>
    <Container>
        <a-card title="最近浏览">
            <a-list item-layout="horizontal" :data-source="browsingCreations" :locale="{ emptyText: '暂无数据' }">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta :description="item.summary">
                            <template #title>
                                <a-row class="reading">
                                    <a-col :xl="5" :xs="12">
                                        <router-link
                                            :to="{ path: `/creation/${item.correlationId}` }">
                                            <span>{{ item.title }}</span>
                                        </router-link>
                                        &nbsp;
                                        <span>[作者：{{ item.author }}]</span>
                                    </a-col>
                                    <a-col :xl="5" :xs="12">
                                        <div style="width: 100%;text-align: right;">阅读时间: {{ item.updateTime }}</div>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
            <a-row style="margin: 12px;">
                <a-col :span="24">
                    <a-pagination v-model:current="pageCreation.pageNum" 
                        :total="pageCreation.total"
                        :defaultPageSize="12"
                        :pageSize="pageCreation.pageSize"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        showQuickJumper
                        @change="listCreations"
                        :show-total="(total: number) => `总计 ${total} 条 `"
                    />
                </a-col>
            </a-row>
        </a-card>
        <a-card title="最近观看" style="margin-top: 12px">
            <a-row :gutter="32" v-if="tvs.length > 0">
                <a-col :xl="4" :xs="16" v-for="(tv, i) in tvs">
                    <a-card :bordered="false" @click="router.push('/movie/' + tv.correlationId)"
                    :style="{'margin-top': i > 5 ? '25px' : '0px' }" class="watching">
                        <template #cover>
                            <img :alt="tv.episode" :src="tv.imageUrl" @error="() => tv.imageUrl = '/imgFailure.jpg'" />
                        </template>
                        <a-card-meta :title="tv.title">
                            <template #description>
                                {{ tv.episode.indexOf('集') === -1 ? '' : ' 观看至' + tv.episode }}<br v-if="tv.episode.indexOf('集') !== -1">{{ '上次观看 ' + tv.updateTime }}
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>
            <a-list v-else :data-source="[]" :locale="{ emptyText: '暂无数据' }"></a-list>
            <a-row style="margin: 12px;">
                <a-col :span="24">
                    <a-pagination v-model:current="pageTv.pageNum"
                        :total="pageTv.total"
                        :defaultPageSize="12"
                        :pageSize="pageTv.pageSize"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        showQuickJumper
                        @change="listTvMovies"
                        :show-total="(total: number) => `总计 ${total} 条 `"
                    />
                </a-col>
            </a-row>
        </a-card>
    </Container>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import type { DataItem } from '@/interfaces/Entity'
import { useRouter } from 'vue-router'
import { pageFootsteps } from '@/api/footstep'
import { warningAlert } from '@/utils/AlertUtil'
import useRouterState from '@/store/router'

const router = useRouter()
const routerState = useRouterState()
const browsingCreations = reactive<DataItem[]>([])
const tvs = reactive<any[]>([])
const pageCreation = reactive({
    pageNum: 1,
    pageSize: 12,
    total: 0
})
const pageTv = reactive<any>({
    pageNum: 1,
    pageSize: 12,
    total: 0
})

onMounted(() => {
    routerState.readOnly = true
    routerState.personal = false
    listCreations(1, 12)
    listTvMovies(1, 12)
})

function listCreations(pageNumber: number, pageSize: number) {
    pageFootsteps('CREATION', pageNumber, pageSize).then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        browsingCreations.splice(0)
        browsingCreations.push(...res.data.records)
        pageCreation.pageNum = res.data.current
        pageCreation.pageSize = res.data.size
        pageCreation.total = res.data.total
    })
}

function listTvMovies(pageNumber: number, pageSize: number) {
    pageFootsteps('MOVIE', pageNumber, pageSize).then(res => {
        if (res.data.code === '1') {
            warningAlert(res.data.msg)
            return
        }
        tvs.splice(0)
        tvs.push(...res.data.records)
        pageTv.pageNum = res.data.current
        pageTv.pageSize = res.data.size
        pageTv.total = res.data.total
    })
}

</script>

<style lang="scss">
@media (max-width: 576px) {
    .reading {
        font-size: small
    }
}
</style>