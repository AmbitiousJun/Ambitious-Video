<template>
<div class="player-wrap">
<iframe 
  ref="videoRef"
  allowfullscreen
  webkitallowfullscreen
  mozallowfullscreen
  src="https://blog.ambitiousjun.cn" 
  id="video-frame" />
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()

const videoRef = ref()

// 播放视频
const play = (playUrl = '', playWay = '') => {
  if (!playUrl || !playWay) {
    return
  }
  videoRef.value.src = playWay + playUrl
  ElNotification({
    title: '成功',
    message: '正在解析中, 请稍等...',
    type: 'success',
  })
  store.commit('setFrameUrl', videoRef.value.src)
}

// 重置播放器
const reset = () => {
  videoRef.value.src = 'https://blog.ambitiousjun.cn'
  store.commit('setFrameUrl', '')
}

defineExpose({
  play,
  reset
})
</script>

<style lang="scss" scoped>
.player-wrap {
  width: 100%;
  #video-frame {
    width: 100%;
    height: calc(85vw * 9 / 16);
    border: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 10px;
  }
}
</style>