<!-- <template>
    <div class="tinymce-box">
        <Editor apiKey="my-api-key" v-model="myValue" :init="init" :disabled="enabled" :id="tinymceId" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, reactive, computed, watch } from 'vue'
import { uploadImg } from '@/api/creation'
//引入tinymce编辑器
import Editor from '@tinymce/tinymce-vue'

//引入node_modules里的tinymce相关文件文件
import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入则不显示编辑器
import 'tinymce/themes/silver'  //编辑器主题，不引入则报错
import 'tinymce/icons/default'  //引入编辑器图标icon，不引入则不显示对应图标

// 引入编辑器插件（基本免费插件都在这儿了）
import 'tinymce/plugins/advlist'  //高级列表
import 'tinymce/plugins/anchor'  //锚点
import 'tinymce/plugins/autolink'  //自动链接
import 'tinymce/plugins/autoresize'  //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave'  //自动存稿
import 'tinymce/plugins/charmap'  //特殊字符
import 'tinymce/plugins/code'  //编辑源码
import 'tinymce/plugins/codesample'  //代码示例
import 'tinymce/plugins/directionality'  //文字方向
import 'tinymce/plugins/emoticons'  //表情
import 'tinymce/plugins/fullscreen'  //全屏
import 'tinymce/plugins/help'  //帮助
import 'tinymce/plugins/image'  //插入编辑图片
import 'tinymce/plugins/importcss'  //引入css
import 'tinymce/plugins/insertdatetime'  //插入日期时间
import 'tinymce/plugins/link'  //超链接
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/media' //插入编辑媒体
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/pagebreak' //插入分页符
import 'tinymce/plugins/preview'//预览
import 'tinymce/plugins/quickbars'  //快速工具栏
import 'tinymce/plugins/save'  //保存
import 'tinymce/plugins/searchreplace'  //查找替换
import 'tinymce/plugins/table'  //表格
import 'tinymce/plugins/visualblocks'  //显示元素范围
import 'tinymce/plugins/visualchars'  //显示不可见字符
import 'tinymce/plugins/wordcount'  //字数统计

const emits = defineEmits(["update:modelValue", "setHtml"]);
const props = defineProps({
    value: {
        type: String,
        default: () => {
            return "";
        },
    },
    baseUrl: {
        type: String,
        default: "",
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    // 编辑器初始可编辑状态
    editable_root: {
        type: Boolean,
        default: true,
    },
    plugins: {
        type: [String, Array],
        default:
            "importcss autoresize searchreplace autolink directionality code visualblocks visualchars fullscreen image link codesample table charmap nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons accordion",
    },
    knwlgId: {
        type: String,
    },
    toolbar: {
        type: [String, Array, Boolean],
        default:
            "undo redo | accordion accordionremove | blocks fontfamily fontsize| bold italic underline strikethrough ltr rtl  | align numlist bullist | link image | table | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | anchor codesample",
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    minHeight: {
        type: Number,
        default: 630,
    },
    modelValue: {
        type: Object
    }
});


const loading = ref(false);
const tinymceId = ref("vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""));

const init = reactive({
    selector: "#" + tinymceId.value, // 富文本编辑器的id,
    language_url: "/tinymce/langs/zh_CN.js", // 语言包的路径，具体路径看自己的项目
    language: "zh_CN",
    skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
    editable_root: props.editable_root,
    height: 600,
    branding: false, // 是否禁用“Powered by TinyMCE”
    promotion: false, //去掉 upgrade
    // toolbar_sticky: true,
    // toolbar_sticky_offset: 100,
    menubar: "edit view insert format tools table",
    paste_data_images: true, //允许粘贴图像
    image_dimensions: false, //去除宽高属性
    plugins: props.plugins, //这里的数据是在props里面就定义好了的
    toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
    // 取消图片资源路径转换
    convert_urls: false,
    // table边框位0是否展示网格线
    // visual: false,
    // 超链接默认打开方式
    link_default_target: "_blank",
    link_context_toolbar: true,
    // 默认快捷菜单
    quickbars_insert_toolbar: "image codesample table",
    // 选中图片的快捷提示
    quickbars_image_toolbar:
        "alignleft aligncenter alignright | rotateleft rotateright | imageoptions",
    editimage_toolbar:
        "rotateleft rotateright | flipv fliph | editimage imageoptions",
    // 文字样式
    font_family_formats:
        "Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;", //字体
    font_size_formats: "11px 12px 14px 16px 18px 24px 36px 48px 64px 72px", //文字大小
    image_caption: true,
    editimage_cors_hosts: ["picsum.photos"],
    noneditable_class: "mceNonEditable",
    toolbar_mode: "wrap", // 工具栏模式 floating / sliding / scrolling / wrap
    // 默认样式
    content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }p {margin:3px; line-height:24px;}",
    image_advtab: true,
    importcss_append: true,
    paste_webkit_styles: "all",
    paste_merge_formats: true,
    nonbreaking_force_tab: false,
    paste_auto_cleanup_on_paste: false,
    file_picker_types: "file",
    // 选中文字的快捷提示
    quickbars_selection_toolbar:
        "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    // 编辑器高度自适应
    autoresize_bottom_margin: 20,
    // autoresize_overflow_padding: 16,
    min_height: props.minHeight,
    content_css: "/tinymce/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
    // setup: function (editor) {
    // },
    //图片上传
    images_upload_handler: (blobInfo, success, failure) => {
        if (blobInfo.blob().size / 1024 / 1024 > 2) {
            failure("上传失败，图片大小请控制在 2M 以内")
        } else {
            let params = new FormData()
            params.append('file', blobInfo.blob())
            
            uploadImg(params).then(res => {
                if (res.data.code === '1') {
                    success(res.data.msg)  //上传成功，在成功函数里填入图片路径
                } else {
                    failure("上传失败")
                }
            }).catch(() => {
                failure("上传出错，服务器开小差了呢")
            })
        }
    }
});

//初始化编辑器
onMounted(() => {
  tinymce.init({});
});


// 外部传递进来的数据变化
const myValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  },
});

//监听富文本中的数据变化
watch(
  () => myValue.value,
  () => {
   emits(
    "setHtml",
    tinymce.activeEditor ? tinymce.activeEditor.getContent({ format: "text" }) : null,
    myValue.value
  );
  }
);

// 设置值
const handleSetContent = (content) => {
    tinymce.activeEditor ? tinymce.activeEditor.setContent(content) : null;
};
 
// 获取值
const handleGetContent = () => {
  return tinymce.activeEditor ? tinymce.activeEditor.getContent() : null;
};
 
defineExpose({
  handleSetContent,
  handleGetContent,
});

</script>

<style lang="scss"></style> -->