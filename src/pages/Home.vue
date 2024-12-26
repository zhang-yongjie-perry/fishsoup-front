<template>
	<Container @update:to-search="toSearch">
		<a-card>
			<template #title>免费阅读</template>
			<template #extra>
				<a v-antishake href="http://www.guoxue.com/" target="_blank">国学网</a>
			</template>
			<a-row :gutter="16">
				<a-col :xl="4" :xs="8" v-for="(site, i) in novelSites">
					<a-card :bordered="false" @click="toLinkNovelSite(site.url)"
					:style="{'margin-top': i > 5 ? '25px' : '0px' }">
						<template #cover>
							<img class="novel-poster" :alt="site.title" :src="site.poster" @error="() => site.poster = '/imgFailure.jpg'" />
						</template>
						<a-card-meta :title="site.title" style="text-align: center;">
						</a-card-meta>
					</a-card>							
				</a-col>
			</a-row>
		</a-card>
		<a-card :loading="loadingPic" style="margin-top: 24px">
			<template #title>
				<a-row :gutter="16">
					<a-col :xl="4" :xs="24">
						<span>高清壁纸</span>
					</a-col>
					<a-col id="col-pic-search" :xl="10" :xs="20">
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
				<a v-antishake href="https://www.bizhihui.com/page/2/?order=views" target="_blank">更多</a>
			</template>
			<a-row :gutter="32">
				<a-col :xl="12" :xs="24">
					<a-carousel autoplay arrows>
						<template #prevArrow>
							<div class="custom-slick-arrow" style="left: 10px; z-index: 16">
								<double-left-outlined />
							</div>
						</template>
						<template #nextArrow>
							<div class="custom-slick-arrow" style="right: 10px">
								<double-right-outlined />
							</div>
						</template>
						<div v-for="item in pics8k">
							<a-image class="car-image" :alt="item.title" 
								:src="`${imgPrefix}/image/download/${item.thumbId}`" 
								:preview="{
									src: `${imgPrefix}/image/download/${item.fileId}`,
								}"
							/>
							<span class="desc">{{ item.title }}</span>
							<a v-antishake style="margin-left: 10px;" :href="`${imgPrefix}/image/download/${item.fileId}`" :download="`${item.title}.jpg`">下载</a>
						</div>
					</a-carousel>
				</a-col>
				<a-col class="col-pic-4k" :xl="12" :xs="24">
					<a-row :gutter="16">
						<a-col v-for="(pic, i) in pictures" :span="8">
							<a-card :bordered="false">
								<template #cover>
									<a-image :alt="pic.title" 
										:src="`${imgPrefix}/image/download/${pic.thumbId}`" 
										:preview="{
											src: `${imgPrefix}/image/download/${pic.fileId}`,
										}"
									/>
									<span class="desc">
										{{ pic.title.length > 30 ? pic.title.substring(0, 30) : pic.title }}
										<a v-antishake :href="`${imgPrefix}/image/download/${pic.fileId}`" :download="`${pic.title}.jpg`">下载</a>
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
					<a-col :xl="4" :xs="24">
						<span>精彩影视</span>
					</a-col>
					<a-col id="col-mv-search" :xl="10" :xs="20">
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
				<a v-antishake href="https://www.fangsendq.com/vodshow/13-----------.html" target="_blank">更多</a>
			</template>
			<a-row :gutter="32">
				<a-col :xl="4" :xs="8" v-for="(tv, i) in tvs">
					<a-card :bordered="false" @click="router.push('/movie/' + tv.id)"
					:style="{'margin-top': i > 5 ? '25px' : '0px' }">
						<template #cover>
							<a-image class="img-mv-preview"
								:alt="tv.synopsis" 
								:src="tv.imgUrl" 
								:preview="false"
								fallback="data:image/png;base64,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"
							/>
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
import { SyncOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'

const novelSites = ref([
	{url: 'https://5000yan.com/', poster: '/novelPoster/guoxue.jpg', title: '国学5000言'},
	{url: 'https://www.zhenhunxiaoshuo.com/', poster: '/novelPoster/zhenhun.jpg', title: '镇魂小说网'},
	{url: 'https://www.70zw.net/', poster: '/novelPoster/qilin.jpg', title: '麒麟中文网'},
	{url: 'http://www.szlajc.com/', poster: '/novelPoster/xiaoshuowang.jpeg', title: '小说网'},
	{url: 'https://www.sc4418.com/', poster: '/novelPoster/mianfeixiaoshuo.jpeg', title: '免费全本小说阅读网'},
	// {url: 'https://www.jucewu.com/', poster: '/novelPoster/mianfei.jpg', title: '免费小说'},
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
const imgPrefix = ref(import.meta.env.VITE_WEB_URL)
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
		pics8k.value = res.data.map((pic: any) => {
			pic.originUrl = imgPrefix.value + '/image/download/' + pic.fileId
			pic.thumbUrl = imgPrefix.value + '/image/download/' + pic.thumbId
			return pic
		})
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

@media (max-width: 576px) {
	.novel-poster {
		width: 100%;
		height: 150px;
	}

	#col-pic-search {
		margin-top: 12px;
	}

	#col-mv-search {
		margin-top: 12px;
	}

	.col-pic-4k {
		margin-top: 12px;
		.ant-row>div:nth-child(n+4) {
			margin-top: 12px;
		}
	}

	.car-image {
		width: 100%;
		height: 100%;
	}

	.ant-carousel .slick-dots-bottom {
		bottom: 70px;
	}

	.img-mv-preview {
		width: 100%;
		height: 128px;
	}

	.ant-carousel {
		.slick-arrow.custom-slick-arrow {
			width: 55px;
			height: 55px;
			margin-top: -50px;
			font-size: 55px;
			color: #fff;
			background-color: rgba(31, 45, 61, 0.11);
			opacity: 0.3;
		}
	}

	.ant-carousel {
		.custom-slick-arrow:before {
			display: none;
		}
	}

	.ant-carousel {
		.custom-slick-arrow:hover {
			opacity: 0.5;
		}
	}
}

@media (min-width: 1200px) {
	.novel-poster {
		width: 100%;
		height: 320px;
	}

	.car-image {
		width: 720px;
		height: 100%;
	}

	.ant-carousel .slick-dots-bottom {
		bottom: 50px;
	}

	.col-pic-4k {
		.ant-row>div:nth-child(-n+3) {
			margin-top: 2px;
		}
	
		.ant-row>div:nth-child(n+4) {
			margin-top: 32px;
		}
	}

	.img-mv-preview {
		width: 100%;
		height: 282px;
	}

	.ant-carousel {
		.slick-arrow.custom-slick-arrow {
			width: 55px;
			height: 55px;
			margin-top: -45px;
			font-size: 55px;
			color: #fff;
			background-color: rgba(31, 45, 61, 0.11);
			opacity: 0.3;
		}
	}

	.ant-carousel {
		.custom-slick-arrow:before {
			display: none;
		}
	}

	.ant-carousel {
		.custom-slick-arrow:hover {
			opacity: 0.5;
		}
	}
}
</style>