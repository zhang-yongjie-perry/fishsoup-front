<template>
    <div v-if="readOnly" v-html="content" 
        style="display: block; width: 100%; height: 100%">
    </div>
    <div v-else style="display: block; width: 100%; height: 100%">
		<Toolbar
			:editor="editorRef"
			:defaultConfig="toolbarConfig"
			:mode="mode"
			style="border-bottom: 1px solid #ccc"
		/>
		<Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            v-model="content"
            :style="myStyle"
            @onCreated="handleCreated"
            @onDestroyed="handleDestroyed"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount, shallowRef } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { InsertFnType } from '@wangeditor/editor-for-vue'
import type { ImageElement } from '@/interfaces/Entity'
import { useUserInfo } from '@/store/user'
import { uploadImg } from '@/api/creation'
import { warningAlert } from '@/utils/AlertUtil'
import useRouterState from '@/store/router'

const routerState = useRouterState()
const userState = useUserInfo()
const props = defineProps<{
    readOnly?: Boolean,
    modelValue?: String,
    myStyle?: Object
}>()

const content = ref(props.modelValue)

// 在 3.4 及以下版本，foo 是一个实际的常量，永远不会改变。
// 在 3.5 及以上版本，当在同一个 <script setup> 代码块中访问由 defineProps 解构的变量时，prop 可以被追踪变化。
watch(() => props.modelValue, 
    (value) => {
        content.value = value
    },
    { immediate: true, deep: true }
)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

// 插入过的图片
let insertedImages = reactive<string[]>([])

// 现有的图片
let currentImages = reactive<string[]>([])

const emit = defineEmits(['update:modelValue', 'update:toDelImages', 'update:text'])
watch(
    () => content.value,
    (newVal) => {
        const editor = editorRef.value
        // 判断编辑器是否初始化完成
        if (editor == null) return
        
        // 将文本内容同步至父组件
        emit('update:modelValue', newVal)
        emit('update:text', editor.getText())

        // 清空当前图片的容器
        currentImages.splice(0)
        // 获取当前存在的图片
        let cImages = editor.getElemsByType('image')
        if (!cImages || cImages.length <= 0) {
            return
        }
        // 将当前存在的图片放入当前图片的容器中
        cImages.forEach((image: any) => {
            currentImages.push(image.alt)
        });
        // 对插入图片和当前图片集合进行求差, 获取已删除的图片
        let deletedImages = insertedImages.filter(insertedImage => !currentImages.includes(insertedImage))
        // 将删除的图片同步至父组件
        emit('update:toDelImages', deletedImages)
    },
    { immediate: true, deep: true }
)

// 模式
let mode = "defualt"

// 编辑器配置, 排除录像上传功能
const toolbarConfig = {
    excludeKeys: ['group-video']
}
const editorConfig = {
    placeholder: '请输入正文内容...',
    readOnly: false,
    content: {},
    MENU_CONF: {
        uploadImage: {
            fieldName: 'file',
            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: 5 * 1024 * 1024 * 1024, // 50M
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 10,
            // server: `/api/image/upload`,
            headers: {
                Authorization: userState.getState().token
            },
            // 小于该值就插入 base64 格式（而不上传），默认为 0
            base64LimitSize: 5 * 1024, // 5kb
            // 自定义上传
            async customUpload(file: File, insertFn: InsertFnType) {
                uploadImg({'file': file}).then(response => {
                    if (response.data.errno !== 0) {
                        return;
                    }
                    insertFn(import.meta.env.VITE_FRONT_URL + "/image/download/" + response.data.data.url, 
                        response.data.data.alt, response.data.data.href);
                }).catch(error => {
                    warningAlert(`图片上传失败: ${error}`)
                })
            },
        },
        insertImage: {
            onInsertedImage(imageNode: ImageElement | null) {
                if (imageNode == null) return;
                const { alt } = imageNode;
                insertedImages.push(alt);
            }
        },
        lineHeight: {
            lineHeightList: ['0.5', '1', '1.15', '1.5', '2', '2.5', '3']
        }
    }
};
 
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleDestroyed = () => {
    editorRef.value = null
    insertedImages.splice(0)
}
</script>

<style lang="scss">
</style>