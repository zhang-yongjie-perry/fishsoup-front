import axios from '@/utils/HttpUtil'

export function pageTvMovies(value: any, pageNum: number, pageSize: number) {
    return axios.post(`/web/movie/pageList/${pageNum}/${pageSize}`, value)
}

export function getTvMovieById(id: string) {
    return axios.get(`/web/movie/${id}`)
}

export function networkSearchMovies(title: string) {
    return axios.get(`/web/movie/search/${title}`)
}
