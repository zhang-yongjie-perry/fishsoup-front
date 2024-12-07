<template>
	<Container @update:to-search="toSearch">
		<a-card>
			<template #title>免费阅读</template>
			<template #extra>
				<a href="https://5000yan.com/" target="_blank">国学5000言</a>
			</template>
			<a-row :gutter="16">
				<a-col :span="4" v-for="(site, i) in novelSites">
					<a-card :bordered="false" @click="toLinkNovelSite(site.url)"
					:style="{'margin-top': i > 5 ? '25px' : '0px' }">
						<template #cover>
							<img :alt="site.title" :src="site.poster" @error="() => site.poster = '/imgFailure.jpg'" />
						</template>
						<a-card-meta :title="site.title">
						</a-card-meta>
					</a-card>							
				</a-col>
			</a-row>
		</a-card>
		<a-card :loading="loadingPic" style="margin-top: 24px">
			<template #title>
				<a-row :gutter="16">
					<a-col :span="4">
						<span>高清壁纸</span>
					</a-col>
					<a-col :span="10">
						<MyInputSearch
							placeholder="请输入查询内容"
							action1="本地搜索"
							:allowClear="true"
							:value="picSearchVal.title"
							@update:searchValue="toSearchPics"
							@update:toLocalSearch="initPic4k(1, 6)"
						>
						</MyInputSearch>
					</a-col>
				</a-row>
			</template>
			<template #extra>
				<SyncOutlined style="margin-right: 10px;" :spin="spinPic" @click="refreshPics" />
				<a href="https://www.bizhihui.com/page/2/?order=views" target="_blank">更多</a>
			</template>
			<a-row :gutter="32">
				<a-col :span="12">
					<a-carousel autoplay>
						<div v-for="item in pics8k">
							<img class="car-image" :alt="item.title" :src="`${imgPrefix}/image/download/${item.thumbId}`" @click="enlargeImage(item.fileId)">
							<span class="desc">{{ item.title }}</span>
							<a style="margin-left: 10px;" :href="`${imgPrefix}/image/download/${item.fileId}`" :download="`${item.title}.jpg`">下载</a>
						</div>
					</a-carousel>
				</a-col>
				<a-col :span="12">
					<a-row :gutter="16">
						<a-col v-for="(pic, i) in pictures" :span="8">
							<a-card :bordered="false"
								:style="{'margin-top': i > 2 ? '25px' : '0px' }">
								<template #cover>
									<img :alt="pic.title" :src="`${imgPrefix}/image/download/${pic.thumbId}`" @click="enlargeImage(pic.fileId)" />
									<span class="desc">
										{{ pic.title.length > 30 ? pic.title.substring(0, 30) : pic.title }}
										<a :href="`${imgPrefix}/image/download/${pic.fileId}`" :download="`${pic.title}.jpg`">下载</a>
									</span>
								</template>
							</a-card>
						</a-col>
					</a-row>
					<a-row style="margin-top: 24px;">
						<a-col :span="24">
							<a-pagination v-model:current="currentPagePic" 
								simple
								:total="totalPic" 
								:defaultPageSize="6"
								:pageSize="pageSizePic"
								:pageSizeOptions="['6']"
								@change="initPic4k"
								:show-total="(totalPic: number) => `总计 ${totalPic} 条 `"
							/>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
		</a-card>
		<a-card :loading="loadingTv" style="margin-top: 24px">
			<template #title>
				<a-row>
					<a-col :span="4">
						<span>精彩影视</span>
					</a-col>
					<a-col :span="10">
						<MyInputSearch
							placeholder="请输入查询内容"
							action1="本地搜索"
							action2="网络搜索"
							:allowClear="true"
							:action2Spin="action2Spin"
							:value="tvSearchVal.title"
							@update:searchValue="toUpdateSearchVal"
							@update:toLocalSearch="toFindTvMovies(1, 12)"
							@update:toNetworkSearch="toNetworkSearchMovies"
						>
						</MyInputSearch>
					</a-col>
				</a-row>
			</template>
			<template #extra>
				<a href="https://www.fangsendq.com/vodshow/13-----------.html" target="_blank">更多</a>
			</template>
			<a-row :gutter="32">
				<a-col :span="4" v-for="(tv, i) in tvs">
					<a-card :bordered="false" @click="router.push('/movie/' + tv.id)"
					:style="{'margin-top': i > 5 ? '25px' : '0px' }">
						<template #cover>
							<img :alt="tv.synopsis" :src="tv.imgUrl" @error="() => tv.imgUrl = '/imgFailure.jpg'" />
						</template>
						<a-card-meta :title="tv.title" :description="tv.synopsis">
						</a-card-meta>
					</a-card>							
				</a-col>
			</a-row>
			<a-row style="margin: 12px;">
				<a-col :span="24">
					<a-pagination v-model:current="currentPageTv" 
						:total="totalTv" 
						:defaultPageSize="12"
						:pageSize="pageSizeTv"
						:pageSizeOptions="['12', '24', '48', '96']"
						showQuickJumper
						@change="toFindTvMovies"
						:show-total="(totalTv: number) => `总计 ${totalTv} 条 `"
					/>
				</a-col>
			</a-row>
		</a-card>
	</Container>
	<transition name="fade">
		<div v-if="enlargedImageUrl" class="overlay" @click="closeImage">
			<img :src="enlargedImageUrl" class="enlarged" />
		</div>
	</transition>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import type { TvMovie } from '@/interfaces/Entity'
import { useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import { pageTvMovies, networkSearchMovies } from '@/api/movie'
import { listPics8k, pagePics4k, searchPics } from '@/api/picture'
import { successAlert, warningAlert } from '@/utils/AlertUtil'
import useSearchTextState from '@/store/seach'
import { SyncOutlined } from '@ant-design/icons-vue'

const novelSites = ref([
	{url: 'https://www.zhenhunxiaoshuo.com/', poster: '/novelPoster/zhenhun.jpg', title: '镇魂小说'},
	{url: 'https://www.70zw.net/', poster: '/novelPoster/qilin.jpg', title: '麒麟中文网'},
	{url: 'http://www.szlajc.com/', poster: '/novelPoster/xiaoshuowang.jpeg', title: '小说网'},
	{url: 'https://www.sc4418.com/', poster: '/novelPoster/mianfeixiaoshuo.jpeg', title: '免费全本小说阅读网'},
	{url: 'https://www.jucewu.com/', poster: '/novelPoster/mianfei.jpg', title: '免费小说'},
	{url: 'https://www.mianfeixiaoshuoyueduwang.com/', poster: '/novelPoster/mianfeiyuedu.jpg', title: '免费小说阅读网'},
])
const spinPic = ref(false)
const action2Spin = ref(false)
const tvs = reactive<TvMovie[]>([])
const pics8k = ref<any[]>([])
const pictures = ref<any[]>([])
const router = useRouter()
const loadingTv = ref(true)
const currentPagePic = ref<number>(1)
const pageSizePic = ref<number>(6)
const totalPic = ref<number>(0)
const currentPageTv = ref<number>(1)
const pageSizeTv = ref<number>(12)
const totalTv = ref<number>(0)
const loadingPic8k = ref(true)
const loadingPic4k = ref(true)
const tvSearchVal = reactive({title: ''})
const picSearchVal = reactive({title: ''})
const searchTextState = useSearchTextState()
const enlargedImageUrl = ref<string | null>('')
const imgPrefix = ref(import.meta.env.VITE_FRONT_URL)
const loadingPic = computed(() => {
	return loadingPic8k.value || loadingPic4k.value
})

function toSearchPics(value: string) {
	picSearchVal.title = value
}

function toUpdateSearchVal(value: string) {
	tvSearchVal.title = value
}

onMounted(async () => {
	toFindTvMovies(1, 12)
	initPic8k()
	initPic4k(1, 6)
})

function initPic8k() {
	listPics8k().then(res => {
		if (res.data.code === '1') {
			warningAlert(res.data.msg)
			return
		}
		pics8k.value = res.data
		loadingPic8k.value = false
	})
}

function initPic4k(pageNumber: number, pageSize: number) {
	currentPagePic.value = pageNumber ? pageNumber : currentPagePic.value
	pageSizePic.value = pageSize ? pageSize : pageSizePic.value
	pagePics4k(picSearchVal.title ? picSearchVal : {title: searchTextState.searchText}, pageNumber, pageSize).then(res => {
		if (res.data.code === '1') {
			warningAlert(res.data.msg)
			return
		}
		pictures.value = res.data.records
		totalPic.value = res.data.total
		loadingPic4k.value = false
	})
}

function toNetworkSearchMovies() {
	if (!tvSearchVal.title) {
		warningAlert("请输入影片名称")
		return
	}
	action2Spin.value = true
	successAlert('影片搜索中, 请稍后')
	networkSearchMovies(tvSearchVal.title).then(res => {
		if (res.data.code === '1') {
			warningAlert(res.data.msg)
			action2Spin.value = false
			return
		}
		toFindTvMovies(1, 12)
		successAlert('搜索完成!')
		action2Spin.value = false
	})
}

function toFindTvMovies(pageNumber: number, pageSize: number) {
	currentPageTv.value = pageNumber ? pageNumber : currentPageTv.value
	pageSizeTv.value = pageSize ? pageSize : pageSizeTv.value
	loadingTv.value = true
	pageTvMovies(tvSearchVal.title ? tvSearchVal : {title: searchTextState.searchText}, pageNumber, pageSize).then(res => {
		if (res.data.code === '1') {
			warningAlert(res.data.msg)
			return
		}
		tvs.splice(0)
		tvs.push(...res.data.records)
		totalTv.value = res.data.total
		loadingTv.value = false
	})
}

function toSearch() {
	initPic4k(1, 6)
	toFindTvMovies(1, 12)
}

function enlargeImage(value: string) {
	enlargedImageUrl.value = imgPrefix.value + "/image/download/" + value
}

function closeImage() {
	enlargedImageUrl.value = null
}

function refreshPics() {
	spinPic.value = true
	searchPics().then(res => {
		if (res.data.code === '1') {
			warningAlert(res.data.msg)
			return
		}
		successAlert('图片刷新中, 请稍候')
		doRefreshPics(10)
	})
}

function doRefreshPics(times: number) {
	if (times <= 0) {
		spinPic.value = false
		successAlert('图片刷新完成')
		return
	}
	initPic8k()
	initPic4k(1, 6)
	setTimeout(() => {
		doRefreshPics(times - 1)
	}, 3000);
}

function toLinkNovelSite(url: string) {
	window.open(url, "_blank")
}
</script>
<style lang="scss">
.ant-card {
	border-radius: 12px;
	&:hover {
		cursor: pointer;
	}
}

.ant-card-body {
	padding: 10px
}

.ant-card-meta-detail>div:not(:last-child) {
	margin-bottom: 3px
}

.ant-card-meta-description {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.ant-pagination-prev, .ant-pagination-next, .ant-pagination-jump-prev, .ant-pagination-jump-next {
	line-height: 11px
}

.car-image {
	width: 100%;
	height: 100%;
}

.desc {
	color: #888
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	// transition: background-color 2s ease-in 1s; background-color属性发生变化时，过渡效果将在1秒后开始，并持续2秒，过渡速率从慢到快
}

.enlarged {
	max-width: 90%;
	max-height: 95%;
}

.fade-leave-active {
	// transition: opacity 0.5s;
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	opacity: 0;
}
</style>