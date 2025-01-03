<template>
    <Container>
        <a-form :model="menuSettings" layout="inline">
            <a-row v-for="menuSetting in menuSettings" style="margin-top: 12px;">
                <a-col :xl="5">
                    <a-form-item label="菜单名称">
                        <a-input readonly v-model:value="menuSetting.name" />
                    </a-form-item>
                </a-col>
                <a-col :xl="5">
                    <a-form-item label="菜单路由">
                        <a-input readonly v-model:value="menuSetting.url" />
                    </a-form-item>
                </a-col>
                <a-col :xl="3">
                    <a-form-item label="排序">
                        <a-input type="number" v-model:value="menuSetting.sort" />
                    </a-form-item>
                </a-col>
                <a-col :xl="3">
                    <a-form-item label="是否显示">
                        <a-switch v-model:checked="menuSetting.display" />
                    </a-form-item>
                </a-col>
                <a-col :xl="8">
                    <a-form-item label="备注">
                        <a-input readonly v-model:value="menuSetting.remark" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-row style="margin-top: 12px;">
            <a-col :span="24">
                <a-button type="primary" @click="onSubmit">保存</a-button>
            </a-col>
        </a-row>
    </Container>
</template>

<script setup lang="ts">
import { onMounted, reactive, createVNode } from 'vue'
import { saveMenuSetting, listMenus } from '@/api/menu'
import type { MenuSetting } from '@/interfaces/Entity'
import { message } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouterState } from '@/store/router'

const routerState = useRouterState()
const menuSettings = reactive<MenuSetting[]>(routerState.getMenus())

onMounted(async () => {
    // const res = await listMenus()
    // if (res.data.code === '1') {
    //     message.warning('菜单获取失败:' + res.data.msg)
    //     return
    // }
    // menuSettings.splice(0)
    // menuSettings.push(...res.data)
})

function onSubmit() {
    Modal.confirm({
        title: '确认保存菜单设置?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '本设置只对当前用户生效',
        onOk() {
            saveMenuSetting(menuSettings).then(res => {
                if (res.data.code === '1') {
                    message.warning('保存失败:' + res.data.msg)
                    return
                }
                message.success('保存成功')
            })
        },
        onCancel() {},
      });
}

</script>

<style lang="scss"></style>