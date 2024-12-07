<!-- <template>
    <div style="display: block; width: 100%; height: 100%">
		<!-- <vue-ueditor-wrap
			v-model="content"
			:config="config"
		></vue-ueditor-wrap> -->
        <vue-ueditor-wrap 
            v-model="content"
            editor-id="editor"
            :config="editorConfig"
            :editorDependencies="['ueditor.config.js','ueditor.all.js']"
            style="height:500px;"/>
	</div>
</template>

<script setup lang="ts">
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

let content = ref(props.modelValue);
let config = reactive({
	// 编辑器不自动被内容撑高
	autoHeightEnabled: false,
    // 禁用自动保存
    enableAutoSave: false,
	// 初始容器高度
	initialFrameHeight: 260,
	// 初始容器宽度
	initialFrameWidth: '100%',
	// 上传图片接口
	serverUrl: 'http://localhost:9099/fish/editor/resource',
	UEDITOR_HOME_URL: '/UEditorPlus/',
    serverHeaders: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
});

let editorConfig = reactive({
    serverUrl: 'http://localhost:9099/fish/editor/config',
    // loadConfigFromServer: false,
    config: 'config',
    UEDITOR_HOME_URL: '/static/UEditorPlus/',
    UEDITOR_CORS_URL: '/static/UEditorPlus/',
    // 编辑器不自动被内容撑高
	autoHeightEnabled: false,
    // 禁用自动保存
    autoSaveEnable: false,
	// 初始容器高度
	initialFrameHeight: 260,
	// 初始容器宽度
	initialFrameWidth: '100%',
    serverHeaders: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    serverResponsePrepare: function(res: any ){
        // 这里返回的结果需要是 UEditor 原始需要的数据结构
        return res
    },
    initialContent: '',
    uploadServiceEnable: true,
    // type 上传类型，image 图片，video 视频，audio 音频，attachment 附件
    // file 文件对象
    // callback 回调函数，需要在上传完成后调用 callback.success、callback.error、callback.progress
    uploadServiceUpload: function(type: string, file: File, callback: any, option: any) {
        console.log('uploadServiceUpload', type, file, callback, option);
        // var i = 0;
        // var call = function() {
        //     i++;
        //     if(i > 3){
        //         callback.success({
        //             "state": "SUCCESS",
        //             "url": "https://ms-assets.modstart.com/demo/modstart.jpg",
        //         })
        //         return;
        //     }
        //     setTimeout(function(){
        //         callback.progress(0.3 * i);
        //         call();
        //     },500);
        // }
        // call();
    },
    imageConfig: {
        // 禁止本地上传
        disableUpload: false,
        // 禁止在线管理
        disableOnline: false,
        // 自定义选择按钮
        selectCallback: function(editor: any, cb: any){
            console.log('selectCallback', cb);
            setTimeout(function(){
              cb({
                path:'',
                name:'图片'
              });
            }, 1000);
        }
    },
    videoConfig: {
        // 禁止本地上传,
        disableUpload: false,
        // 自定义选择按钮
        selectCallback: function(editor: any, cb: any){
            console.log('selectCallback',cb);
            // setTimeout(function(){
            //   cb({
            //     path:'https://www.bilibili.com/video/BV1y44y1g7NR?spm_id_from=333.1007.tianma.1-1-1.click',
            //     name:'测试视频'
            //   });
            // }, 1000);
        }
    },
    readonly: props.readOnly,
    elementPathEnabled: false,
    maximumWords: 50000,
    toolbars: [
        [
            "fullscreen",   // 全屏
            "source",       // 源代码
            "|",
            "undo",         // 撤销
            "redo",         // 重做
            "|",
            "bold",         // 加粗
            "italic",       // 斜体
            "underline",    // 下划线
            "fontborder",   // 字符边框
            "strikethrough",// 删除线
            "superscript",  // 上标
            "subscript",    // 下标
            "removeformat", // 清除格式
            "formatmatch",  // 格式刷
            "autotypeset",  // 自动排版
            "blockquote",   // 引用
            "pasteplain",   // 纯文本粘贴模式
            "|",
            "forecolor",    // 字体颜色
            "backcolor",    // 背景色
            "insertorderedlist",   // 有序列表
            "insertunorderedlist", // 无序列表
            "selectall",    // 全选
            "cleardoc",     // 清空文档
            "|",
            "rowspacingtop",// 段前距
            "rowspacingbottom",    // 段后距
            "lineheight",          // 行间距
            "|",
            "customstyle",         // 自定义标题
            "paragraph",           // 段落格式
            "fontfamily",          // 字体
            "fontsize",            // 字号
            "|",
            "directionalityltr",   // 从左向右输入
            "directionalityrtl",   // 从右向左输入
            "indent",              // 首行缩进
            "|",
            "justifyleft",         // 居左对齐
            "justifycenter",       // 居中对齐
            "justifyright",
            "justifyjustify",      // 两端对齐
            "|",
            "touppercase",         // 字母大写
            "tolowercase",         // 字母小写
            "|",
            "link",                // 超链接
            "unlink",              // 取消链接
            "anchor",              // 锚点
            "|",
            "imagenone",           // 图片默认
            "imageleft",           // 图片左浮动
            "imageright",          // 图片右浮动
            "imagecenter",         // 图片居中
            "|",
            "simpleupload",        // 单图上传
            "insertimage",         // 多图上传
            "emotion",             // 表情
            "scrawl",              // 涂鸦
            "insertvideo",         // 视频
            "attachment",          // 附件
            "insertframe",         // 插入Iframe
            "insertcode",          // 插入代码
            "pagebreak",           // 分页
            "template",            // 模板
            "background",          // 背景
            "formula",             // 公式
            "|",
            "horizontal",          // 分隔线
            "date",                // 日期
            "time",                // 时间
            "spechars",            // 特殊字符
            "wordimage",           // Word图片转存
            "|",
            "inserttable",         // 插入表格
            "deletetable",         // 删除表格
            "insertparagraphbeforetable",     // 表格前插入行
            "insertrow",           // 前插入行
            "deleterow",           // 删除行
            "insertcol",           // 前插入列
            "deletecol",           // 删除列
            "mergecells",          // 合并多个单元格
            "mergeright",          // 右合并单元格
            "mergedown",           // 下合并单元格
            "splittocells",        // 完全拆分单元格
            "splittorows",         // 拆分成行
            "splittocols",         // 拆分成列
            "contentimport",       // 内容导入（支持Word、Markdown）
            "|",
            "print",               // 打印
            "preview",             // 预览
            "searchreplace",       // 查询替换
            "help",                // 帮助
        ]
    ]
})

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