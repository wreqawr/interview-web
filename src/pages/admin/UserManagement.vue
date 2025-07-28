<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>
      
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

const userList = ref([
  {
    id: 1,
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@example.com',
    role: 'ROLE_ADMIN',
    status: 'active',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'hr001',
    nickname: 'HR小王',
    email: 'hr001@example.com',
    role: 'ROLE_HR',
    status: 'active',
    createTime: '2025-01-02 14:30:00'
  },
  {
    id: 3,
    username: 'user001',
    nickname: '求职者张三',
    email: 'user001@example.com',
    role: 'ROLE_JOB_SEEKER',
    status: 'active',
    createTime: '2025-01-03 09:15:00'
  }
])

const getRoleType = (role) => {
  const roleMap = {
    'ROLE_ADMIN': 'danger',
    'ROLE_HR': 'warning',
    'ROLE_JOB_SEEKER': 'info'
  }
  return roleMap[role] || 'info'
}

const handleAdd = () => {
  ElMessage.info('新增用户功能开发中...')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑用户 ${row.username} 功能开发中...`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗？`, '确认删除', {
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
.user-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 