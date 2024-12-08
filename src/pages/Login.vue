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
                <a-button style="margin-left: 30px" @click="toRegister()">注册</a-button>
                <a-button style="margin-left: 30px" @click="resetForm()">重置</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup lang="ts">
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import type { UserInfo } from '@/interfaces/User';
import { login, register } from '@/api/user';
import { useRouter } from 'vue-router';
import { useUserInfo } from '@/store/user';
import { message } from 'ant-design-vue';

let loading = ref(false);
const formRef = ref();
const router = useRouter();
const userStore = useUserInfo();
message.config({top: '124px'})

const userInfo: UnwrapRef<UserInfo> = reactive({
    username: '',
    password: ''
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
};

function submit() {
    loading.value = true;
    formRef.value
    .validate()
    .then(() => {
        login(userInfo).then(result => {
            if (result.data.code !== '0') {
                message.warning(result.data.msg ? result.data.msg : '登录失败, 请联系管理员', 1)    
                loading.value = false;
                return;
            }
            userStore.setUserState(userInfo.username, "Bearer " + result.data.data.token, '');
            router.push('/home');
        }).catch(error => {
            loading.value = false;
            message.warning(error)
        })
    })
    .catch((error: ValidateErrorEntity<UserInfo>) => {
        loading.value = false;
        message.warning(error)
    });
}
    
function toRegister() {
    loading.value = true
    formRef.value
        .validate()
        .then(() => {
            register(userInfo).then(result => {
                if (result.data.code !== '0') {
                    message.warning(result.data.msg ? result.data.msg : '登录失败, 请联系管理员', 1)    
                    loading.value = false;
                    return;
                }
                
                login(userInfo).then(res => {
                    if (res.data.code !== '0') {
                        message.warning(res.data.msg ? res.data.msg : '登录失败, 请联系管理员', 1)    
                        loading.value = false;
                        return;
                    }
                    console.log('登录成功');
                    userStore.setUserState(userInfo.username, "Bearer " + res.data.data.token, '');
                    router.push('/home');
                }).catch(error => {
                    loading.value = false;
                    message.warning(error)
                })
            }).catch(error => {
                loading.value = false;
                message.warning(error)
            })
        })
        .catch((error: ValidateErrorEntity<UserInfo>) => {
            loading.value = false;
            message.warning(error)
        });
}

function resetForm() {
    formRef.value.resetFields();
}
</script>
<style>
.form-item {
    width: 70%;
    margin: auto
}
</style>