<template>
<div class="quick-search-dialog-wrap">
  <el-dialog 
    v-model="visible" 
    :show-close="false"
    width="90%"
    lock-scroll
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">快速搜索各平台资源</h4>
        <el-button 
          plain 
          round
          size="small"
          type="danger" 
          @click="close"
        >
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          关闭
        </el-button>
      </div>
    </template>
    <div class="container">
      <div class="btn-group">
        <el-select v-model="searchSite" placeholder="-选择视频网站-" style="width: 160px">
          <el-option 
            v-for="item in sites"
            :label="item.label" 
            :value="item.url" />
        </el-select>
        <el-button
          :disabled="!!!searchKey"
          type="primary"
          round
          style="margin-left: 10px"
          @click="handleSearch"
          icon="Search">搜 索</el-button>
      </div>
      <el-input
        v-model="searchKey"
        placeholder="输入要搜索视频的关键词（按下回车键可快速搜索）"
        @keydown.enter="handleSearch"
      />
    </div>
  </el-dialog>
</div>
</template>

<script setup>
import { ref } from 'vue'

// 控制对话框显隐
const visible = ref(false)

// 搜索关键词
const searchKey = ref('')

// 要搜索的视频网站地址
const searchSite = ref('')

// 可选的网站
const sites = ref([
  { label: '腾讯视频', url: 'https://v.qq.com/x/search/?q=${searchKey}' },
  { label: '爱奇艺', url: 'https://so.iqiyi.com/so/q_${searchKey}' },
  { label: '优酷', url: 'https://so.youku.com/search_video/q_${searchKey}?searchfrom=1' },
  { label: '芒果TV', url: 'https://so.mgtv.com/so?k=${searchKey}' },
  { label: 'BiliBili', url: 'https://search.bilibili.com/all?keyword=${searchKey}' }
])

// 显示对话框
const show = () => {
  visible.value = true
}

// 搜索资源
const handleSearch = () => {
  const site = searchSite.value
  const key = searchKey.value
  if (!site || !key) {
    return
  }
  window.open(site.replace('${searchKey}', key), '_blank')
  setTimeout(() => {
    close()
  })
}

const close = () => {
  visible.value = false
  searchSite.value = ''
  searchKey.value = ''
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.quick-search-dialog-wrap {
  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .oper-wrap {
    display: flex;
    align-items: center;
  }
  .container * {
    margin: 5px 0;
  }
}
</style>