export interface UserInfo {
    username: string,
    password: string,
    sex: string | null,
    mobilePhone: string,
    email: string,
    onlineStatus: string | null,
}

export interface ChatUserInfo {
    username: string,
    toUsername: string,
    content: string,
    time: string,
}