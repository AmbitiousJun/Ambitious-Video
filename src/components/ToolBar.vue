<template>
<div class="tool-bar-wrap">
  <div class="title">操作栏</div>
  <div class="player-url-wrap">
    <div class="btn-row">
      <el-select v-model="playWay" placeholder="-选择线路-" style="width: 150px">
        <el-option 
          v-for="item in apis"
          :label="item.label" 
          :value="item.url" />
      </el-select>
      <el-button 
        @click="handlePlay"
        type="primary"
        size="small"
        round
        style="margin-left:10px;"
        icon="Aim">解 析</el-button>
    </div>
    <el-input
      v-model="playerUrl"
      placeholder="在此粘贴视频 url 再点击解析即可"
    />
  </div>
  <div class="btn-wrap">
    <el-button 
      icon="Search"
      @click="openQuickSearchDialog"
      type="success">快 搜</el-button>
    <el-button 
      icon="Memo"
      @click="openHistoryDialog"
      type="warning">解析记录</el-button>
    <el-button 
      icon="Close"
      :disabled="!canExit"
      @click="resetPlayer"
      type="danger">退出播放</el-button>
  </div>
  <quick-search-dialog ref="quickSearchDialogRef" />
  <history-dialog 
    ref="historyDialogRef" 
    @continue-play="handleContinuePlay"
  />
</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import QuickSearchDialog from './QuickSearchDialog.vue'
import HistoryDialog from './HistoryDialog.vue'

const emits = defineEmits(['play', 'reset-player'])

const store = useStore()

// 快搜对话框
const quickSearchDialogRef = ref()

// 历史记录对话框
const historyDialogRef = ref()

// 视频地址
const playerUrl = ref('')

// 视频播放线路
const playWay = ref('')

const canExit = computed(() => !!store.state.curFrameUrl)

const apis = ref([
  { label: 'Mao', url: 'https://www.mtosz.com/m3u8.php?url=' },
  { label: 'LLQ', url: 'https://player.maqq.cn/?url=' },
  { label: '爱豆', url: 'https://jx.aidouer.net/?url=' },
  { label: '七哥', url: 'https://jx.mmkv.cn/tv.php?url=' },
  { label: '虾米', url: 'https://jx.xmflv.com/?url=' },
  { label: '0523', url: 'https://go.yh0523.cn/y.cy?url=' },
  { label: '自用小猫咪', url: 'http://ambitiousjun.xyz/player?url=' },
  { label: '备用', url: 'https://z1.m1907.top/?jx=' }
])

// 格式化日期
const format = (dat) => {
  //获取年月日，时间
  var year = dat.getFullYear();
  var mon = (dat.getMonth()+1) < 10 ? "0"+(dat.getMonth()+1) : dat.getMonth()+1;
  var data = dat.getDate() < 10 ? "0"+(dat.getDate()) : dat.getDate();
  var hour = dat.getHours() < 10 ? "0"+(dat.getHours()) : dat.getHours();
  var min = dat.getMinutes() < 10 ? "0"+(dat.getMinutes()) : dat.getMinutes();
  var seon = dat.getSeconds() < 10 ? "0"+(dat.getSeconds()) : dat.getSeconds();
  var newDate = year +"-"+ mon +"-"+ data +" "+ hour +":"+ min +":"+ seon;
  return newDate;
}

// 续播视频
const handleContinuePlay = row => {
  const { apiName, url } = row
  // 1 获取线路地址
  const idx = apis.value.findIndex(v => v.label === apiName)
  if (idx === -1) {
    console.log('续播失败: 线路匹配失败')
    return
  }
  const way = apis.value[idx].url
  // 2 设置值
  playerUrl.value = url
  playWay.value = way
  // 3 解析播放
  handlePlay()
}

// 创建一条解析记录
const createNewHistory = () => {
  // 1 获取线路名
  const idx = apis.value.findIndex(v => v.url === playWay.value)
  if (idx === -1) {
    console.log('创建解析记录失败: 线路匹配失败');
    return
  }
  const apiName = apis.value[idx].label
  // 2 获取视频地址
  const url = playerUrl.value
  // 3 获取当前时间
  const date = format(new Date())
  // 4 添加到本地记录中
  const jxHistory = JSON.parse(localStorage.getItem('jx-history'))
  const obj = {apiName, url, date}
  // 如果之前有一样的记录就删除掉
  jxHistory.some((v, i) => {
    if (v.url === url) {
      v.tag && (obj.tag = v.tag)
      jxHistory.splice(i, 1)
      return true
    }
    return false
  })
  // 新记录插在头部
  jxHistory.unshift(obj)
  localStorage.setItem('jx-history', JSON.stringify(jxHistory))
}

// 解析视频
const handlePlay = () => {
  const url = playerUrl.value
  const way = playWay.value
  if (!url || !way) {
    return
  }
  emits('play', { url, way })
  createNewHistory()
}

// 重置播放器
const resetPlayer = () => {
  emits('reset-player')
}

// 打开快搜对话框
const openQuickSearchDialog = () => {
  quickSearchDialogRef.value.show()
}

// 打开历史记录对话框
const openHistoryDialog = () => {
  historyDialogRef.value.show()
}
</script>

<style lang="scss" scoped>
.tool-bar-wrap {
  border: 1px dotted #ccc;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .1);
  .title {
    color: #606266;
    font-weight: 600;
    font-size: 18px;
  }
  .player-url-wrap {
    margin-top: 20px;
    background-color: #f6f6f6;
    padding: 20px;
    border-radius: 10px;
  }
  .player-url-wrap * {
    margin: 5px 0;
  }
  .btn-wrap {
    margin-top: 20px;
    background-color: #f6f6f6;
    padding: 20px;
    border-radius: 10px;
  }
}
</style>

<style lang="scss">
.tool-bar-wrap {
  .btn-wrap {
    button {
      margin: 5px;
    }
  }
}
</style>