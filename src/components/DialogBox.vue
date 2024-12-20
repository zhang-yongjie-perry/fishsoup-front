<template>
    <div>
        <div v-if="position === 'left'" style="position: relative;display: inline-block">
            <div style="margin-left: 24px;font-size: xx-small;opacity: 0.7;margin-bottom: 5px;">
                <slot></slot>
            </div>
            <div class="guide-left"></div>
            <div class="dialog-box-left">
                <span style="display:inline-block; padding: 8px;max-width: 400px;white-space: normal;word-break: break-word;" v-text="content"></span>
            </div>
        </div>
        <div v-else style="position: relative;display: inline-block">
            <div class="dialog-box-right">
                <span style="display:inline-block; padding: 8px;max-width: 400px;white-space: normal;word-break: break-word;" v-text="content"></span>
            </div>
            <div class="guide-right"></div>
        </div>
    </div>
</template>
<script setup>
const { position = 'left', content } = defineProps(['position', 'content'])
</script>
<style scoped>
.guide-left {
    position: relative;
    display: inline-block;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 10px solid white;
    width: 0;
    height: 0;
    top: 7px;
    margin-left: 24px;
}
.guide-right {
    position: relative;
    display: inline-block;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 10px solid #93f482;
    width: 0;
    height: 0;
    top: 7px;
    margin-right: 24px;
}
.dialog-box-left {
    display: inline-block;
    border-radius: 5px;
    background-color: white;
    vertical-align: top;
}
.dialog-box-right {
    display: inline-block;
    border-radius: 5px;
    background-color: #93f482;
    vertical-align: top;
}
</style>