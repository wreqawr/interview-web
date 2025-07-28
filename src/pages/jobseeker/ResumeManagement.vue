<template>
  <div class="resume-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>简历管理</span>
          <el-button type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon>
            上传简历
          </el-button>
        </div>
      </template>
      
      <el-table :data="resumeList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="简历名称" width="150" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="fileSize" label="文件大小" width="100" />
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="AI评分" width="100">
          <template #default="scope">
            <el-rate v-model="scope.row.score" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="handleDownload(scope.row)">下载</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const resumeList = ref([
  {
    id: 1,
    name: '前端开发工程师简历',
    version: 'v1.0',
    fileSize: '2.5MB',
    uploadTime: '2025-01-28 10:00:00',
    status: 'parsed',
    score: 4.5
  },
  {
    id: 2,
    name: '全栈开发工程师简历',
    version: 'v2.0',
    fileSize: '3.1MB',
    uploadTime: '2025-01-27 14:30:00',
    status: 'parsing',
    score: 0
  },
  {
    id: 3,
    name: '产品经理简历',
    version: 'v1.5',
    fileSize: '1.8MB',
    uploadTime: '2025-01-26 09:15:00',
    status: 'parsed',
    score: 4.2
  }
])

const getStatusType = (status) => {
  const statusMap = {
    'parsing': 'warning',
    'parsed': 'success',
    'failed': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'parsing': '解析中',
    'parsed': '已解析',
    'failed': '解析失败'
  }
  return statusMap[status] || '未知'
}

const handleUpload = () => {
  ElMessage.info('上传简历功能开发中...')
}

const handleView = (row) => {
  ElMessage.info(`查看简历 ${row.name} 功能开发中...`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑简历 ${row.name} 功能开发中...`)
}

const handleDownload = (row) => {
  ElMessage.success(`开始下载简历 ${row.name}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除简历 ${row.name} 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}
</script>

<style scoped>
.resume-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 