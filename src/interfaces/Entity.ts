import { SlateElement } from '@wangeditor/editor'
import type { UserInfo } from '@/interfaces/User'

export type ImageElement = SlateElement & {
    src: string
    alt: string
    url: string
    href: string
}

export interface Image {
    key: string,
    name: string,
    text: string,
    url: string,
    downloadUrl: string
}

export interface Tag {
    content: string,
    color: string
}

export interface DataItem {
    title: string,
    summary: string,
    time: string,
}

export interface Creation {
    id: string | null,
    title: string | null,
    author: string | null,
    time: Date | null,
    summary: string | null,
    classify: string | null,
    visibleRange: string | null,
    content: string | null,
    toDelImages: string[]
}

export interface PlayMovie {
    episode: string,
    m3u8Url: string,
    nextM3u8Url: string
}

export interface PlayOrg {
    orgName: string,
    lastEpisode: string,
    playList: PlayMovie[]
}

export interface TvMovie {
    id: string,
    title: string,
    imgUrl: string,
    sortNum: number,
    synopsis: string,
    status: number,
    lastUpdateTime: Date,
    playOrgs: any | PlayOrg[]
}

export interface MessageEntity {
    status: number,
    content: UserInfo[]
}