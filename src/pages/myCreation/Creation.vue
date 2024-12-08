<template>
    <Container>
        <a-row v-if="routerState.readOnly" style="margin: 12px 0px 16px 0px;">
            <a-col :span="24">
                <div style="display: flex;align-items: center;justify-content: center;height: 100%;">
                    <span>{{ creation.title }}</span>
                    <span style="margin-left: 20px;">作者：{{ creation.author }}</span>
                </div>
            </a-col>
        </a-row>
        <a-row v-else style="margin: 12px 0px 16px 0px;">
            <a-col :xl="12" :xs="24">
                <a-input v-model:value="creation.title" placeholder="请输入标题" style="border-radius: 5px;"/>
            </a-col>
            <a-col class="col-btn" :xl="{span: 2, offset: 1}" :xs="{span: 6}">
                <a-select
                    v-model:value="creation.classify"
                    :options="[{value: '1', label: '专业'}, {value: '2', label: '文学'}, {value: '3', label: '随笔'}]"
                ></a-select>
            </a-col>
            <a-col class="col-btn" :xl="2" :xs="6">
                <a-select
                    v-model:value="creation.visibleRange"
                    :options="[{value: '1', label: '私密'}, {value: '2', label: '公开'}]"
                ></a-select>
            </a-col>
            <a-col class="col-btn" :xl="2" :xs="6">
                <a-button @click="toSaveCreation(false)" type="primary" style="border-radius: 5px;">保存</a-button>
            </a-col>
        </a-row>
        <a-row style="margin-bottom: 16px;">
            <a-col :span="24">
                <div v-if="routerState.readOnly">
                    概述：{{ creation.summary }}
                </div>
                <a-textarea v-else
                    v-model:value="creation.summary"
                    placeholder="请输入概要内容..."
                    auto-size
                    />
            </a-col>
        </a-row>
        <MyEditor v-model="htmlContent" 
            @update:to-del-images="getDelImages" 
            @update:text="getText"
            :readOnly="routerState.readOnly"
            :my-style="{'height': '500px'}">
        </MyEditor>
    </Container>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue';
import MyEditor from '@/components/MyEditor.vue';
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Creation } from '@/interfaces/Entity'
import { useUserInfo } from '@/store/user'
import { saveCreation, getCreation } from '@/api/creation'
import { successAlert, warningAlert } from '@/utils/AlertUtil'
import useRouterState from '@/store/router'

const { id } = defineProps<{ id?: String }>();
const routerState = useRouterState();
const textContent = ref('');
const htmlContent = ref('');
const timerId = ref(0);
const alreadySaved = ref(true);

const useUser = useUserInfo();
const creation = reactive<Creation>({
    id: null,
    title: '',
    author: useUser.loginName,
    time: new Date(),
    summary: '',
    classify: '1',
    visibleRange: '1',
    content: '',
    toDelImages: []
})

onMounted(() => {
    // 在组件挂载时添加事件监听器
    if (!routerState.readOnly) {
        window.addEventListener('keydown', handleKeydown);
    }

    if (!id) {
        return;
    }
    getCreation(id.toString()).then(res => {
        if (res.data.code !== '0') {
            return;
        }
        let presentedCreation = res.data.data;
        creation.id = presentedCreation.id;
        creation.title = presentedCreation.title;
        creation.author = presentedCreation.author;
        creation.time = presentedCreation.time;
        creation.summary = presentedCreation.summary;
        creation.classify = presentedCreation.classify;
        creation.visibleRange = presentedCreation.visibleRange;
        htmlContent.value = presentedCreation.content;
    })
})

watch(
    () => htmlContent.value,
    function(value) {
        creation.content = value;
        if (value === htmlContent.value) return;
        if (routerState.readOnly) return;
        // 内容发生变化, 清空定时器
        clearTimer();
        // 保存状态设为否
        alreadySaved.value = false;
        // 重新创建定时器
        timerId.value = setTimeout(() => {
            toSaveCreation(true);
        }, 10000);
    }
)

function getDelImages(deletedImages: string[]) {
    creation.toDelImages.splice(0);
    creation.toDelImages.push(...deletedImages);
}

function getText(text: string) {
    textContent.value = text;
}

function toSaveCreation(autoSave: boolean) {
    // 若已保存并且是自动保存触发本方法, 则不再重复保存
    if (alreadySaved.value && autoSave) {
        return;
    }
    if (!creation.content || creation.content === '<p><br></p>') {
        // 若为自动保存则不对内容有无进行提示
        if (autoSave) {
            return;
        }
        warningAlert('请输入正文内容');
        return;
    }
    if (!creation.title) {
        creation.title = textContent.value.length <= 10 
            ? textContent.value : textContent.value.substring(0, 15);
    }
    if (!creation.summary) {
        creation.summary = textContent.value.length <= 15 
            ? textContent.value : textContent.value.substring(0, 50) + "...";
    }
    saveCreation(creation).then(res => {
        if (res.data.code !== '0') {
            warningAlert(`保存失败:${res.data.msg}`)
            return;
        }
        // 保存状态设为是
        alreadySaved.value = true;
        // 清空定时器
        clearTimer();
        creation.id = res.data.data
        successAlert("保存成功");
    })
}

function clearTimer() {
    if (timerId.value) {
        clearTimeout(timerId.value);
        timerId.value = 0;
    }
}

onBeforeUnmount(() => {
    // 卸载页面前销毁定时器
    clearTimer();
    // 在组件挂载时添加事件监听器
    window.removeEventListener('keydown', handleKeydown);
})

function handleKeydown(event: any) {
    // 检查是否按下了 Ctrl 键和 S 键
    if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
        // 阻止默认行为（如果有的话，比如浏览器的保存页面功能）
        event.preventDefault();
        // 执行保存操作
        toSaveCreation(false);
    }
}
</script>

<style lang="scss">
.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
}

@media (max-width: 576px) {
    .col-btn {
        margin-top: 12px
    }
}
</style>