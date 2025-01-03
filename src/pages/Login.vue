<template>
    <div style="text-align: center;width: 100%;">
        <div v-if="loading" style="position: absolute;width: 100%;height: 100%;z-index: 10;background: rgba(0, 0, 0, 0.05);">
            <a-spin tip="登陆中..." style="margin-top: 145px;"></a-spin>
        </div>
        <h1 style="width: 100%;height: 200px;justify-content: center;display: flex;align-items: center;text-align: center;">欢迎来到鱼汤网</h1>
        <a-form
            name="custom-validation"
            ref="formRef"
            :rules="rules"
            :model="userInfo"
            v-bind="layout"
            @finish="submit">
            <a-form-item class="form-item" label="用户名" name="username">
                <a-input v-model:value="userInfo.username" autocomplete="off" />
            </a-form-item>
            <a-form-item class="form-item" label="密码" name="password" style="margin-top: 30px;">
                <a-input v-model:value="userInfo.password" type="password" autocomplete="off" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 24 }" style="margin-top: 30px;">
                <a-button type="primary" html-type="submit">登录</a-button>
                <!-- <a-button style="margin-left: 30px" @click="toRegister()">注册</a-button> -->
                <a-button v-antishake style="margin-left: 30px" @click="resetForm()">重置</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup lang="ts">
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { reactive, ref, onMounted } from 'vue'
import type { UnwrapRef } from 'vue'
import type { UserInfo } from '@/interfaces/User'
import { login, register, getPublicKey } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/store/user'
import useRouterState from '@/store/router'
import { message } from 'ant-design-vue'
import { chatOnline } from '@/utils/websocketUtil'
import { JSEncrypt } from 'jsencrypt'

let loading = ref(false)
const formRef = ref()
const router = useRouter()
const userStore = useUserInfo()
const routerState = useRouterState()
message.config({top: '124px'})
const userInfo: UnwrapRef<UserInfo> = reactive({
    username: '',
    password: '',
    sex: null,
    mobilePhone: '',
    email: '',
    onlineStatus: null
})
const crypt = new JSEncrypt();
const publicKey = ref('')

onMounted(() => {
    getPublicKey().then(res => {
        if (res.data.code === '1') {
            message.warning('检测到网络异常, 请刷新页面后再进行登录')
            return
        }
        publicKey.value = res.data.data.publicKey
        crypt.setPublicKey(publicKey.value)
    })
})

const rules = {
    username: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 10, message: '长度必须在1到10之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度必须在6到15之间', trigger: 'blur' },
    ]
}

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 5 },
}

function submit() {
    loading.value = true
    formRef.value
    .validate()
    .then(() => {
        const loginUserInfo = JSON.parse(JSON.stringify(userInfo))
        loginUserInfo.password = crypt.encrypt(userInfo.password)
        login(loginUserInfo, encodeURIComponent(publicKey.value)).then((result) => {
            if (result.data.code !== '0') {
                message.warning(result.data.msg ? result.data.msg : '登录失败, 请联系管理员', 1)    
                loading.value = false
                return
            }
            userStore.setUserState(userInfo.username, "Bearer " + result.data.data.token, result.data.data.user.mobilePhone, result.data.data.user.email, result.data.data.user.sex)
            chatOnline()
            router.push(routerState.getHomeMenu().url)
        }).catch(error => {
            loading.value = false
            message.warning(error)
        })
    })
    .catch((error: ValidateErrorEntity<UserInfo>) => {
        loading.value = false
        message.warning(error)
    })
}
    
function toRegister() {
    loading.value = true
    formRef.value
        .validate()
        .then(() => {
            register(userInfo).then(result => {
                if (result.data.code !== '0') {
                    message.warning(result.data.msg ? result.data.msg : '登录失败, 请联系管理员', 1)    
                    loading.value = false
                    return
                }
                
                login(userInfo, '').then(res => {
                    if (res.data.code !== '0') {
                        message.warning(res.data.msg ? res.data.msg : '登录失败, 请联系管理员', 1)    
                        loading.value = false
                        return
                    }
                    userStore.setUserState(userInfo.username, "Bearer " + res.data.data.token, res.data.data.user.mobilePhone, res.data.data.user.email, res.data.data.user.sex)
                    router.push('/home')
                }).catch(error => {
                    loading.value = false
                    message.warning(error)
                })
            }).catch(error => {
                loading.value = false
                message.warning(error)
            })
        })
        .catch((error: ValidateErrorEntity<UserInfo>) => {
            loading.value = false
            message.warning(error)
        })
}

function resetForm() {
    formRef.value.resetFields()
}
</script>
<style scoped>
.form-item {
    width: 70%;
    margin: auto
}
</style>