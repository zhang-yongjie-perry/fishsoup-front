<!-- <template>
    <div style="display: block; width: 100%; height: 100%">
		<QuillEditor
			v-model:content="content"
			:options="myOptions"
			contentType="html"
		/>
	</div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import { Delta } from '@vueup/vue-quill'
import 'quill/dist/quill.core.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref, reactive, watch } from 'vue'

const props = defineProps({
    readOnly: {
        required: false,
        type: Boolean,
        default: false
    },
    modelValue: {
        required: false,
        type: String,
        default: ''
    }
})

let content = ref<string | Delta | undefined | null>(props.modelValue);

const myOptions = reactive({
	modules: {
		toolbar: {
			container: [
				['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
				[{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题，不同级别的标题
				[{ align: [] }], // 对齐方式
				['blockquote', 'code-block'], // 引用，代码块
				[{ script: 'sub' }, { script: 'super' }], // 上标/下标
				[{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
				[{ indent: '-1' }, { indent: '+1' }], // 缩进
				['link', 'image', 'video'], // 超链接 图片 视频
				[{ direction: 'rtl' }], // 文本方向
				[{ color: [] }, { background: [] }], // 字体颜色和背景色
				[{ size: [] }], // 字体大小
				[{ font: [] }], // 字体
				['clean'], // 清除格式
			],
		},
	},
	placeholder: '请输入正文内容...',
    theme: 'snow',
    readOnly: props.readOnly,
});

const emit = defineEmits(['update:modelValue']);
watch(
    () => content.value,
    (newVal) => {
        emit('update:modelValue', newVal)
    },
    { immediate: true, deep: true }
)
</script>

<style lang="scss">
.ql-container {
    min-height: 400px;
}
</style> -->