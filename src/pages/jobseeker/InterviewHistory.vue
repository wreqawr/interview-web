<template>
  <div class="interview-history">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>面试记录</span>
          <el-button type="primary" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出记录
          </el-button>
        </div>
      </template>
      
      <el-table :data="interviewHistory" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="date" label="面试日期" width="120" />
        <el-table-column prop="company" label="公司" width="150" />
        <el-table-column prop="position" label="岗位" width="150" />
        <el-table-column prop="type" label="面试类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="结果" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="120">
          <template #default="scope">
            <el-rate v-model="scope.row.score" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="handleReplay(scope.row)">回放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const interviewHistory = ref([
  {
    id: 1,
    date: '2025-01-28',
    company: '腾讯科技',
    position: '前端开发工程师',
    type: '技术面试',
    status: 'passed',
    score: 4.5,
    duration: '45分钟'
  },
  {
    id: 2,
    date: '2025-01-25',
    company: '阿里巴巴',
    position: '前端开发工程师',
    type: '综合面试',
    status: 'failed',
    score: 3.2,
    duration: '60分钟'
  },
  {
    id: 3,
    date: '2025-01-20',
    company: '字节跳动',
    position: '前端开发工程师',
    type: 'hr_interview',
    status: 'pending',
    score: 4.0,
    duration: '30分钟'
  },
  {
    id: 4,
    date: '2025-01-15',
    company: '百度',
    position: '前端开发工程师',
    type: '技术面试',
    status: 'passed',
    score: 4.8,
    duration: '50分钟'
  }
])

const getTypeType = (type) => {
  const typeMap = {
    '技术面试': 'warning',
    '综合面试': 'success',
    'hr_interview': 'info'
  }
  return typeMap[type] || 'info'
}

const getStatusType = (status) => {
  const statusMap = {
    'passed': 'success',
    'failed': 'danger',
    'pending': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'passed': '通过',
    'failed': '未通过',
    'pending': '待定'
  }
  return statusMap[status] || '未知'
}

const handleExport = () => {
  ElMessage.success('面试记录导出成功')
}

const handleView = (row) => {
  ElMessage.info(`查看面试详情 ${row.company} - ${row.position} 功能开发中...`)
}

const handleReplay = (row) => {
  ElMessage.info(`回放面试 ${row.company} - ${row.position} 功能开发中...`)
}
</script>

<style scoped>
.interview-history {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 