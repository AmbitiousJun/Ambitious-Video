<template>
<div ref="curNodeRef" class="quick-search-dialog-wrap">
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
      <el-autocomplete
        v-model="searchKey"
        style="width:100%"
        ref="searchInputRef"
        :teleported="false"
        highlight-first-item
        select-when-unmatched
        :fetch-suggestions="querySearch"
        placeholder="输入要搜索视频的关键词（按下回车键可快速搜索）"
        @select="handleSearch"
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

// 搜索框实例
const searchInputRef = ref()

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

// 获取搜索缓存
const getSearchHistory = () => {
  return JSON.parse(localStorage.getItem('search-history') || '[]') || []
}

// 加载自动补全搜索项
const querySearch = (str = '', cb = () => {}) => {
  // 1 拉取搜素缓存
  const searchHistory = getSearchHistory()
  if (searchHistory.length === 0) {
    return cb([])
  }
  // 2 匹配 5 个选项
  const res = new Array()
  searchHistory.some(v => {
    if (v.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
      res.push(v)
      if (res.length >= 5) {
        return true
      }
    }
    return false
  })
  return cb(res.map(v => ({value: v})))
}

// 搜索资源
const handleSearch = () => {
  const site = searchSite.value
  const key = searchKey.value
  if (!site || !key) {
    return
  }
  // 保存搜索关键词
  const searchHistory = getSearchHistory()
  searchHistory.unshift(key)
  // 过滤掉重复的关键词
  const distinctSet = new Set()
  for (let i = 0; i < searchHistory.length;) {
    if (distinctSet.has(searchHistory[i])) {
      searchHistory.splice(i, 1)
    } else {
      distinctSet.add(searchHistory[i])
      i++
    }
  }
  // 防止缓存数组过长
  while (searchHistory.length > 100) {
    searchHistory.pop()
  }
  localStorage.setItem('search-history', JSON.stringify(searchHistory))
  window.open(site.replace('${searchKey}', key), '_blank')
  setTimeout(() => {
    close()
  })
}

const close = () => {
  searchInputRef.value.close()
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