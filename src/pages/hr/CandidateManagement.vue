<template>
  <div class="candidate-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>候选人管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增候选人
          </el-button>
        </div>
      </template>
      
      <el-table :data="candidateList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="position" label="应聘岗位" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="100">
          <template #default="scope">
            <el-rate v-model="scope.row.score" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

const candidateList = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    position: '前端开发工程师',
    status: 'pending',
    score: 4.5,
    createTime: '2025-01-28 10:00:00'
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    position: '后端开发工程师',
    status: 'interviewing',
    score: 4.2,
    createTime: '2025-01-27 14:30:00'
  },
  {
    id: 3,
    name: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    position: '产品经理',
    status: 'passed',
    score: 4.8,
    createTime: '2025-01-26 09:15:00'
  }
])

const getStatusType = (status) => {
  const statusMap = {
    'pending': 'info',
    'interviewing': 'warning',
    'passed': 'success',
    'rejected': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'interviewing': '面试中',
    'passed': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || '未知'
}

const handleAdd = () => {
  ElMessage.info('新增候选人功能开发中...')
}

const handleView = (row) => {
  ElMessage.info(`查看候选人 ${row.name} 功能开发中...`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑候选人 ${row.name} 功能开发中...`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除候选人 ${row.name} 吗？`, '确认删除', {
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
.candidate-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 