<template>
  <div class="hr-dashboard">
    <el-row :gutter="20">
      <!-- 页面标题 -->
      <el-col :span="24">
        <div class="page-header">
          <h1>HR招聘管理平台</h1>
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

      <!-- 今日面试 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>今日面试安排</span>
            </div>
          </template>
          <div class="today-interviews">
            <div v-for="interview in todayInterviews" :key="interview.id" class="interview-item">
              <div class="interview-time">{{ interview.time }}</div>
              <div class="interview-info">
                <div class="candidate-name">{{ interview.candidate }}</div>
                <div class="position-name">{{ interview.position }}</div>
              </div>
              <el-tag :type="interview.status === '已完成' ? 'success' : 'warning'">
                {{ interview.status }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 最新候选人 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新候选人</span>
            </div>
          </template>
          <el-table :data="latestCandidates" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="position" label="应聘岗位" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 招聘进度 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>招聘进度</span>
            </div>
          </template>
          <div class="recruitment-progress">
            <div v-for="progress in recruitmentProgress" :key="progress.position" class="progress-item">
              <div class="progress-header">
                <span class="position-name">{{ progress.position }}</span>
                <span class="progress-count">{{ progress.count }}/{{ progress.target }}</span>
              </div>
              <el-progress 
                :percentage="(progress.count / progress.target) * 100" 
                :color="getProgressColor(progress.count / progress.target)"
              />
            </div>
          </div>
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

// 今日面试数据
const todayInterviews = ref([
  {
    id: 1,
    time: '09:00',
    candidate: '张三',
    position: '前端开发工程师',
    status: '已完成'
  },
  {
    id: 2,
    time: '14:00',
    candidate: '李四',
    position: '后端开发工程师',
    status: '进行中'
  },
  {
    id: 3,
    time: '16:00',
    candidate: '王五',
    position: '产品经理',
    status: '待开始'
  }
])

// 最新候选人数据
const latestCandidates = ref([
  {
    name: '张三',
    position: '前端开发工程师',
    status: '已通过'
  },
  {
    name: '李四',
    position: '后端开发工程师',
    status: '面试中'
  },
  {
    name: '王五',
    position: '产品经理',
    status: '待面试'
  }
])

// 招聘进度数据
const recruitmentProgress = ref([
  {
    position: '前端开发工程师',
    count: 3,
    target: 5
  },
  {
    position: '后端开发工程师',
    count: 2,
    target: 3
  },
  {
    position: '产品经理',
    count: 1,
    target: 2
  }
])

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    '已通过': 'success',
    '面试中': 'warning',
    '待面试': 'info',
    '未通过': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取进度条颜色
const getProgressColor = (ratio) => {
  if (ratio >= 0.8) return '#67C23A'
  if (ratio >= 0.6) return '#E6A23C'
  return '#F56C6C'
}

// 页面导航
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.hr-dashboard {
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

.today-interviews {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.interview-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.interview-time {
  width: 60px;
  font-weight: bold;
  color: #409EFF;
}

.interview-info {
  flex: 1;
  margin: 0 15px;
}

.candidate-name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.position-name {
  color: #909399;
  font-size: 14px;
}

.recruitment-progress {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-count {
  color: #909399;
  font-size: 14px;
}
</style> 