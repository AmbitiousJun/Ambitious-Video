<template>
<div class="my-app">
  <h2 style="color: #303133">Ambitious Video</h2>
  <tool-bar 
    @play="handlePlay"
    @reset-player="handleResetPlayer"
  />
  <player ref="playerRef"/>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Player from './components/Player.vue'
import ToolBar from './components/ToolBar.vue'

const playerRef = ref()

// 播放视屏
const handlePlay = ({url, way}) => {
  playerRef.value.play(url, way)
}

// 重置播放器
const handleResetPlayer = () => {
  playerRef.value.reset()
}

// 判断有没有过解析记录，没有就进行初始化
const initJxHistory = () => {
  const jxHistory = localStorage.getItem('jx-history')
  if (jxHistory) {
    return
  }
  localStorage.setItem('jx-history', '[]')
}

onMounted(() => {
  initJxHistory()
})
</script>

<style lang="scss" scoped>
.my-app {
  padding: 20px 0;
  width: 85%;
  margin: 0 auto;
}
</style>