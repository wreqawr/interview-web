<template>
  <div class="position-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>岗位管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增岗位
          </el-button>
        </div>
      </template>
      
      <el-table :data="positionList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="岗位名称" width="150" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="salary" label="薪资范围" width="120" />
        <el-table-column prop="location" label="工作地点" width="100" />
        <el-table-column prop="type" label="工作类型" width="100">
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
        <el-table-column prop="applicantCount" label="申请人数" width="100" />
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

const positionList = ref([
  {
    id: 1,
    title: '前端开发工程师',
    department: '技术部',
    salary: '15k-25k',
    location: '深圳',
    type: '全职',
    status: 'active',
    applicantCount: 25
  },
  {
    id: 2,
    title: '后端开发工程师',
    department: '技术部',
    salary: '18k-30k',
    location: '深圳',
    type: '全职',
    status: 'active',
    applicantCount: 18
  },
  {
    id: 3,
    title: '产品经理',
    department: '产品部',
    salary: '20k-35k',
    location: '深圳',
    type: '全职',
    status: 'paused',
    applicantCount: 12
  }
])

const getTypeType = (type) => {
  const typeMap = {
    '全职': 'success',
    '兼职': 'warning',
    '实习': 'info'
  }
  return typeMap[type] || 'info'
}

const getStatusType = (status) => {
  const statusMap = {
    'active': 'success',
    'paused': 'warning',
    'closed': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'active': '招聘中',
    'paused': '暂停',
    'closed': '已关闭'
  }
  return statusMap[status] || '未知'
}

const handleAdd = () => {
  ElMessage.info('新增岗位功能开发中...')
}

const handleView = (row) => {
  ElMessage.info(`查看岗位 ${row.title} 功能开发中...`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑岗位 ${row.title} 功能开发中...`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除岗位 ${row.title} 吗？`, '确认删除', {
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
.position-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 