<template>
  <div class="admin-dashboard">
    <el-row :gutter="20">
      <!-- 页面标题 -->
      <el-col :span="24">
        <div class="page-header">
          <h1>系统管理控制台</h1>
          <p>欢迎回来，{{ userStore.getUserInfo?.nickname || userStore.getUserInfo?.username }}</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="stat in userStore.userStatistics" :key="stat.key">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 快速操作 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button 
              v-for="feature in userStore.userFeatures" 
              :key="feature.key"
              :type="feature.type"
              @click="navigateTo(feature.path)"
            >
              <el-icon><component :is="feature.icon" /></el-icon>
              {{ feature.name }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 系统状态 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
            </div>
          </template>
          <div class="system-status">
            <div class="status-item">
              <span class="status-label">服务器状态</span>
              <el-tag type="success">正常</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">数据库状态</span>
              <el-tag type="success">正常</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">AI服务状态</span>
              <el-tag type="success">正常</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">存储空间</span>
              <el-tag type="warning">75%</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 最近活动 -->
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          <el-table :data="recentActivities" style="width: 100%">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
// 图标通过动态组件使用，无需单独导入

const router = useRouter()
const userStore = useUserStore()

// 最近活动数据
const recentActivities = ref([
  {
    time: '2025-01-28 10:30:00',
    action: '新增企业用户：腾讯科技',
    user: 'admin',
    status: '成功'
  },
  {
    time: '2025-01-28 09:15:00',
    action: '系统配置更新',
    user: 'admin',
    status: '成功'
  },
  {
    time: '2025-01-28 08:45:00',
    action: '用户权限调整',
    user: 'admin',
    status: '成功'
  }
])

// 页面导航
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #303133;
  margin-bottom: 10px;
}

.page-header p {
  color: #909399;
  font-size: 16px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #606266;
  font-size: 14px;
}
</style> 