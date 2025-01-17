<template>
    <Container>
        <div id="mask-layer" v-if="loading">
            <a-spin tip="拼命加载中..."></a-spin>
        </div>
        <a-row>
            <a-col :xl="16" :xs="24">
                <div id="player" ref="pl"></div>
            </a-col>
            <a-col :xl="8" :xs="24">
                <a-card
                    id="card-episode"
                    :title="mv.title + '[' + episode + ']'"
                    :tab-list="tabList"
                    :active-tab-key="key"
                    :bordered="false"
                    :headStyle="{'color': '#fff'}"
                    @tabChange="(key: string) => onTabChange(key)"
                >
                    <template #customRender="item">
                    <span>
                        {{ item.key }}
                    </span>
                    </template>
                    <template #extra>
                    </template>
                    <a-button v-antishake class="button-play" v-for="pmv in playList" @click="onEpisodeChange(pmv.episode, pmv.m3u8Url)">
                        <span v-if="pmv.m3u8Url == m3u8Sid">
                            <a-image :preview="false" style="width: 43px;height: 16px;" src="https://img.alicdn.com/imgextra/i3/O1CN01rwR3E51j4lFNN4VRd_!!6000000004495-1-tps-72-72.gif" />
                        </span>
                        <span v-else>{{ pmv.episode }}</span>
                    </a-button>
                </a-card>
            </a-col>
        </a-row>
    </Container>
</template>

<script setup lang="ts">
import Player from 'xgplayer'
import { Events } from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css'
import { ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue'
import { getTvMovieById, getM3u8Resource } from '@/api/movie'
import { recordPlayInfo } from '@/api/footstep'
import { warningAlert } from '@/utils/AlertUtil'
import type { TvMovie, PlayOrg, PlayMovie } from '@/interfaces/Entity'

const saved = ref(false)
const loading = ref(true)
const { mv_id } = defineProps(['mv_id'])
const playerRef = ref<Player | null>()
const pl = ref()
const mvUrl = ref('')
const m3u8Sid = ref('')
const startTime = ref(0)
const mv = reactive<TvMovie>({
    id: '',
    title: '',
    imgUrl: '',
    sortNum: 0,
    synopsis: '',
    status: 0,
    lastUpdateTime: new Date(),
    playOrgs: []
})
const episode = ref('')
const key = ref('')
const tabList = computed(() => {
    return mv.playOrgs.map((org: PlayOrg) => ({'key': org.orgName, 'tab': org.orgName}))
})

const playerHeight = computed(() => {
    return window.innerWidth <= 400 ? '40vh' : '70vh';
})

const playList = computed(() => {
    if (mv.playOrgs.length <= 0 || !mv.playOrgs[0].playList || mv.playOrgs[0].playList.length === 0) {
        return []
    }
    return key.value ? mv.playOrgs.find((org: PlayOrg) => org.orgName === key.value).playList : []
})

const nextList = ref<string[]>([])

onMounted(() => {
    saved.value = false
    window.addEventListener('beforeunload', e => beforeunloadHandler(e))
    getTvMovieById(mv_id).then(async res => {
        if (res.data.code == '1') {
			warningAlert(res.data.msg)
            loading.value = false
			return
        }
        if (!res.data.episodeText) {
            warningAlert('资源获取失败, 请重新获取')
            return
        }
        mv.id = res.data.id
        mv.title = res.data.title
        let jsStr = 'function decryptDict(e){var t={};function n(e){if(Array.isArray(e))return e.map(function(e){return n(e)});else if("object"==typeof e)return decryptDict(e);else{var c=e.split("").map(function(e){return String.fromCharCode(e.charCodeAt(0)-1)}).join("");try{return JSON.parse(c)}catch(e){return c}}}for(var c in e){var r=c.split("").map(function(e){return String.fromCharCode(e.charCodeAt(0)-1)}).join("");t[r]=n(e[c])}return t};'
        + res.data.episodeText
        let urlList = eval(jsStr)
        for (let i = 0; i < urlList.source.length; i++) {
            let playMovies: PlayMovie[] = urlList.url_list[i].map((epiosdeVal: any) => {
                return {
                    episode: epiosdeVal.title,
                    m3u8Url: epiosdeVal.sid,
                    nextM3u8Url: ''
                }
            })
            mv.playOrgs.push({
                orgName: urlList.source[i],
                lastEpisode: '',
                playList: playMovies
            })
        }
        key.value = res.data.hisPlayOrgName ? res.data.hisPlayOrgName : urlList.source[0]
        episode.value = res.data.hisEpisode ? res.data.hisEpisode : urlList.url_list[0][0].title
        startTime.value = res.data.startTime - 2 > 0 ? res.data.startTime - 2 : 0
        if (res.data.hisM3u8Url) {
            m3u8Sid.value = res.data.hisM3u8Url
            let m3u8Url = await getM3u8Resource(res.data.hisM3u8Url)
            mvUrl.value = m3u8Url.data
            nextList.value.splice(0)
            nextList.value.push(mvUrl.value)
            initPlayer()
            loading.value = false    
            return
        }
        m3u8Sid.value = urlList.url_list[0][0].sid
        let m3u8Url = await getM3u8Resource(urlList.url_list[0][0].sid)
        mvUrl.value = m3u8Url.data
        nextList.value.splice(0)
        nextList.value.push(mvUrl.value)
        initPlayer()
        loading.value = false
    })
})

function initPlayer() {
    playerRef.value = new Player({
        el: pl.value,
        height: playerHeight.value,
        width: '100%',
        isLive: false,
        url: mvUrl.value,
        autoplay: true,
        defaultMuted: true,
        plugins: [HlsPlugin],
        startTime: startTime.value,
        rotateFullscreen: true,
        autoplayMuted: true, // 静音起播
        poster: 'mvPoster.jpg',
        hls: {
            retryCount: 5, // 重试 3 次，默认值
            retryDelay: 60 * 1000, // 每次重试间隔 1 秒，默认值 s
            loadTimeout: 60 * 60 * 1000, // 请求超时时间为 600 秒，默认值 10 s
            fetchOptions: {
                // 该参数会透传给 fetch，默认值为 undefined
                mode: 'cors'
            }
        },
        playnext: {
            urlList: nextList.value
        }
    })

    playerRef.value.on(Events.ENDED, async () => {
        if (!playerRef.value) {
            return
        }

        let currentPvIndex = playList.value.findIndex((pv: any) => pv.episode === episode.value)
        if (currentPvIndex + 1 === playList.value.length) {
            return
        }
        episode.value = playList.value[currentPvIndex + 1].episode
        let pid = playList.value[currentPvIndex + 1].m3u8Url
        let m3u8Url = await getM3u8Resource(pid)
        m3u8Sid.value = pid
        mvUrl.value = m3u8Url.data
        playerRef.value.playNext({
            url: mvUrl.value,
            autoplayMuted: false,
        })
    })

    playerRef.value.on(Events.PLAYNEXT, async () => {
        if (!playerRef.value) {
            return
        }

        let currentPvIndex = playList.value.findIndex((pv: any) => pv.episode === episode.value)
        if (currentPvIndex + 1 === playList.value.length) {
            return
        }
        episode.value = playList.value[currentPvIndex + 1].episode
        let pid = playList.value[currentPvIndex + 1].m3u8Url
        let m3u8Url = await getM3u8Resource(pid)
        m3u8Sid.value = pid
        mvUrl.value = m3u8Url.data
        playerRef.value.seek(0)
        playerRef.value.switchURL(mvUrl.value)
    })
}

function onTabChange(value: string) {
    key.value = value
}

async function onEpisodeChange(episodeVal: string, m3u8Url: string) {
    if (!playerRef.value) {
        return
    }
    m3u8Sid.value = m3u8Url
    let m3u8UrlRes = await getM3u8Resource(m3u8Url)
    episode.value = episodeVal
    mvUrl.value = m3u8UrlRes.data
    playerRef.value.seek(0)
    playerRef.value.switchURL(mvUrl.value)
}

onBeforeUnmount(() => {
    let currentTime = playerRef.value ? playerRef.value.currentTime : 0
    recordPlayInfo({correlationId: mv_id, type: '1', playOrgName: key.value, episode: episode.value, m3u8Url: m3u8Sid.value, startTime: currentTime})
        .finally(() => {
            if (!playerRef.value) {
                return
            }
            playerRef.value.destroy()
            playerRef.value = null
            saved.value = true
        })
})

// 关闭浏览器之前触发
function beforeunloadHandler(e: any) {
    if (saved.value) {
        return
    }
    let currentTime = playerRef.value ? playerRef.value.currentTime : 0
    recordPlayInfo({correlationId: mv_id, type: '1', playOrgName: key.value, episode: episode.value, m3u8Url: m3u8Sid.value, startTime: currentTime})
        .finally(() => {
            if (!playerRef.value) {
                return
            }
            playerRef.value.destroy()
            playerRef.value = null
            saved.value = true
        })
}
</script>

<style lang="scss">
#mask-layer {
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
}

.parent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80vh;
    // background-color: #0f0f1e;
    // background-color: #0f0f1e;
}

.ant-tabs-tab-btn {
    color: #fff;
    &:hover {
        color: burlywood
    }
}

@media (max-width: 576px) {
    #card-episode {
        margin-top: 12px;
        width: 100%;
        background-color: #0f0f1e;
        height: 70vh;
        .ant-card-body {
            max-height: 50vh;
            overflow: auto;
        }
    }

    .button-play {
        margin-left: 10px;
        margin-top: 10px;
    }
}

@media (min-width: 1200px) {
    #card-episode {
        margin-left: 12px;
        width: 100%;
        background-color: #0f0f1e;
        height: 70vh;
        .ant-card-body {
            max-height: 55vh;
            overflow: auto;
        }
    }

    .button-play {
        margin-left: 16px;
        margin-top: 16px;
    }
}
</style>