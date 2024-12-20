<template>
    <Container>
        <div v-if="loading" class="mask-update-user">
            <a-spin tip="保存中..."></a-spin>
        </div>
        <a-form
            name="custom-validation"
            ref="formRef"
            :model="userInfo"
            v-bind="layout">
            <a-form-item class="form-item" label="用户名" name="username">
                <a-input disabled v-model:value="userInfo.username" autocomplete="off" :bordered="false"/>
            </a-form-item>
            <a-form-item class="form-item" label="性别" name="password" style="margin-top: 30px;">
                <a-radio-group v-model:value="userInfo.sex" name="radioGroup">
                    <a-radio value="男">男</a-radio>
                    <a-radio value="女">女</a-radio>
                    <a-radio value="保密">保密</a-radio>
                    <a-radio value="未知">未知</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item class="form-item" label="手机号" name="mobilePhone" style="margin-top: 30px;">
                <a-input v-model:value="userInfo.mobilePhone" autocomplete="off" />
            </a-form-item>
            <a-form-item class="form-item" label="邮箱" name="email" style="margin-top: 30px;">
                <a-input v-model:value="userInfo.email" autocomplete="off" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 24 }" style="margin-top: 30px;">
                <div style="text-align: center;">
                    <a-button v-antishake type="primary" @click="submit">保存</a-button>
                    <a-button v-antishake style="margin-left: 30px" @click="pwdVisible = true">修改密码</a-button>
                </div>
            </a-form-item>
        </a-form>
        <a-modal v-model:visible="pwdVisible" title="请输入新密码" cancelText="取消" okText="确定" @ok="resetPassword()">
            <a-input type="password" v-model:value="password"></a-input>
        </a-modal>
    </Container>
</template>

<script setup lang="ts">
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import type { UserInfo } from '@/interfaces/User'
import { saveUser } from '@/api/user'
import { useUserInfo } from '@/store/user'
import { successAlert, warningAlert } from '@/utils/AlertUtil'

const loading = ref(false)
const formRef = ref()
const userStore = useUserInfo()
const password = ref('')
const userInfo: UnwrapRef<UserInfo> = reactive({
    username: userStore.loginName,
    password: '',
    sex: userStore.sex,
    mobilePhone: userStore.mobilePhone,
    email: userStore.email,
    onlineStatus: '在线'
})
const pwdVisible = ref(false)

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 5 },
}

function submit() {
    loading.value = true
    formRef.value
    .validate()
    .then(() => {
        saveUser(userInfo).then((result: any) => {
            if (result.data.code === '1') {
                warningAlert(result.data.msg ? result.data.msg : '操作失败, 请联系管理员')
                loading.value = false
                return
            }
            userStore.setUserState(userStore.loginName, userStore.token, result.data.data.user.mobilePhone, result.data.data.user.email, result.data.data.user.sex)
            successAlert('操作成功, 请稍后重新登录')
            loading.value = false
        }).catch((error: any) => {
            loading.value = false
            warningAlert(error)
        })
    })
    .catch((error: ValidateErrorEntity<UserInfo>) => {
        loading.value = false
        warningAlert(String(error))
    })
}

function resetPassword() {
    if (!password.value) {
        warningAlert('新密码不可为空')
        return
    }
    loading.value = true
    saveUser({
        username: userStore.loginName,
        password: password.value,
        sex: null,
        mobilePhone: '',
        email: '',
        onlineStatus: null
    }).then((res: any) => {
        if (res.data.code === '1') {
            loading.value = false
            warningAlert(res.data.msg ? res.data.msg : '密码修改失败, 请联系管理员')
            return
        }
        pwdVisible.value = false
        loading.value = false
        successAlert('密码修改成功, 请稍后重新登录')
    })
}
</script>

<style lang="scss" scoped>
.form-item {
    width: 80%;
    margin: auto;
}

.mask-update-user {
    position: absolute;
    display: flex;
    width: 97%; 
    height: 69%; 
    z-index: 10;
    background: rgba(0, 0, 0, 0.05);
    justify-content: center;
    align-items: center;
}
</style>