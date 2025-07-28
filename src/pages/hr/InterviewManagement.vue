<template>
  <div class="interview-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>面试管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            安排面试
          </el-button>
        </div>
      </template>
      
      <el-table :data="interviewList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="candidateName" label="候选人" width="100" />
        <el-table-column prop="position" label="岗位" width="150" />
        <el-table-column prop="interviewTime" label="面试时间" width="180" />
        <el-table-column prop="interviewer" label="面试官" width="100" />
        <el-table-column prop="type" label="面试类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const interviewList = ref([
  {
    id: 1,
    candidateName: '张三',
    position: '前端开发工程师',
    interviewTime: '2025-01-29 14:00:00',
    interviewer: '李经理',
    type: '技术面试',
    status: 'scheduled'
  },
  {
    id: 2,
    candidateName: '李四',
    position: '后端开发工程师',
    interviewTime: '2025-01-28 16:00:00',
    interviewer: '王总监',
    type: '综合面试',
    status: 'completed'
  },
  {
    id: 3,
    candidateName: '王五',
    position: '产品经理',
    interviewTime: '2025-01-30 10:00:00',
    interviewer: '张总',
    type: 'hr_interview',
    status: 'pending'
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
    'pending': 'info',
    'scheduled': 'warning',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待安排',
    'scheduled': '已安排',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

const handleAdd = () => {
  ElMessage.info('安排面试功能开发中...')
}

const handleView = (row) => {
  ElMessage.info(`查看面试 ${row.candidateName} 功能开发中...`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑面试 ${row.candidateName} 功能开发中...`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要取消面试 ${row.candidateName} 吗？`, '确认取消', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('面试已取消')
  } catch {
    ElMessage.info('已取消操作')
  }
}
</script>

<style scoped>
.interview-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 