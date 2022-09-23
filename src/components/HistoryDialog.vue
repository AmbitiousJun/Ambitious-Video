<template>
<div class="history-dialog-wrap">
  <el-dialog 
    v-model="visible" 
    :show-close="false"
    width="70%"
    lock-scroll
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">历史解析记录</h4>
        <el-button-group>
          <el-button 
            plain 
            round
            type="primary" 
            @click="handleClearAllHistory"
          >
            <el-icon class="el-icon--left"><Delete /></el-icon>
            清空所有记录
          </el-button>
          <el-button 
            plain 
            round
            type="danger" 
            @click="close"
          >
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </el-button-group>
      </div>
    </template>
    <div class="container">
      <el-table @cell-click="handleCellClick" :data="data" style="width: 100%">
        <el-table-column label="时间" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="线路" prop="apiName" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip label="视频地址" prop="url"></el-table-column>
        <el-table-column label="标签" width="200">
          <template #default="scope">
            <el-popover
              placement="left"
              :width="250"
              :hide-after="0"
              v-model:visible="popoverVisibles[scope.$index]"
              @hide="() => tagInputText = ''"
              trigger="click"
            >
              <template #reference>
                <div v-if="scope.row.tag" class="has-tag">
                  <el-check-tag checked>{{ scope.row.tag }}</el-check-tag>
                </div>
                <div v-else class="no-tag">
                  <el-check-tag>设置标签</el-check-tag>
                </div>
              </template>
              <el-input
                v-model="tagInputText"
                maxlength="15"
                placeholder="标签名"
              >
                <template #append>
                  <el-button 
                    @click="handleSetTagName(scope.$index)"
                    :disabled="!!!tagInputText"
                    icon="Check"/>
                </template>
              </el-input>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              size="small"
              type="primary"
              @click="handleContinuePlay(scope.row)"
            >
              续播
            </el-button>
            <el-popconfirm 
              title="确认删除该记录吗？"
              width="200px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.$index)"
            >
              <template #reference>
                <el-button
                  size="small"
                  type="danger"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const emits = defineEmits(['continue-play'])

const visible = ref(false)

// 解析记录数据
const data = ref([])

// 弹出框是否显示
const popoverVisibles = ref([])

// 设置标签时的文本
const tagInputText = ref('')

// 初始化解析记录
const initJxHistory = () => {
  const jxHistory = JSON.parse(localStorage.getItem('jx-history'))
  data.value = jxHistory
  popoverVisibles.value = new Array(data.value.length)
  popoverVisibles.value.fill(false)
}

// 清空所有历史记录
const handleClearAllHistory = () => {
  ElMessageBox.confirm(
    '确定清空所有记录吗？（不可恢复）',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    localStorage.setItem('jx-history', '[]')
    data.value = []
  }).catch(() => {})
}

// 续播视频
const handleContinuePlay = row => {
  emits('continue-play', row)
  close()
}

// 删除
const handleDelete = index => {
  data.value.splice(index, 1)
  updateHistory()
}

// 设置标签名
const handleSetTagName = index => {
  const tagName = tagInputText.value.trim()
  if (!tagName) {
    return
  }
  data.value[index].tag = tagName
  updateHistory()
  // 关闭弹出层
  popoverVisibles.value[index] = false
}

// 同步当前修改的记录到缓存中
const updateHistory = () => {
  localStorage.setItem('jx-history', JSON.stringify(data.value))
}

// 点击单元格
const handleCellClick = (row, column, cell, event) => {
  if (column && column.property === 'url') {
    navigator.clipboard.writeText(cell.innerText)
    ElMessage.success('链接已复制到剪贴板')
  }
}

const close = () => {
  visible.value = false
}

const show = () => {
  visible.value = true
  initJxHistory()
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.history-dialog-wrap {
  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .container {
    max-height: 400px;
    overflow-y: auto;
    .no-tag {
      .input-trigger {
        cursor: pointer;
        padding: 10px 0;
        border-radius: 10px;
        transition: .3s;
        &:hover {
          background-color: #eee;
          font-size: 15px;
        }
      }
    }
  }
}
</style>