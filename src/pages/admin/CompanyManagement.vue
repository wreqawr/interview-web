<template>
  <div class="company-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>企业管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增企业
          </el-button>
        </div>
      </template>
      
      <el-table :data="companyList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="企业名称" width="200" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="size" label="规模" width="100" />
        <el-table-column prop="location" label="地址" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'verified' ? 'success' : 'warning'">
              {{ scope.row.status === 'verified' ? '已认证' : '待认证' }}
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

const companyList = ref([
  {
    id: 1,
    name: '腾讯科技有限公司',
    industry: '互联网',
    size: '10000+',
    location: '深圳',
    status: 'verified',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    name: '阿里巴巴集团',
    industry: '电商',
    size: '10000+',
    location: '杭州',
    status: 'verified',
    createTime: '2025-01-02 14:30:00'
  },
  {
    id: 3,
    name: '字节跳动',
    industry: '互联网',
    size: '10000+',
    location: '北京',
    status: 'verified',
    createTime: '2025-01-03 09:15:00'
  }
])

const handleAdd = () => {
  ElMessage.info('新增企业功能开发中...')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑企业 ${row.name} 功能开发中...`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除企业 ${row.name} 吗？`, '确认删除', {
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
.company-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 