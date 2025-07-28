<template>
  <div class="jobseeker-dashboard">
    <el-row :gutter="20">
      <!-- 页面标题 -->
      <el-col :span="24">
        <div class="page-header">
          <h1>求职者个人中心</h1>
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

      <!-- 最近面试 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近面试</span>
            </div>
          </template>
          <div class="recent-interviews">
            <div v-for="interview in recentInterviews" :key="interview.id" class="interview-item">
              <div class="interview-date">{{ interview.date }}</div>
              <div class="interview-info">
                <div class="company-name">{{ interview.company }}</div>
                <div class="position-name">{{ interview.position }}</div>
              </div>
              <el-tag :type="getInterviewStatusType(interview.status)">
                {{ interview.status }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 技能评估 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>技能评估</span>
            </div>
          </template>
          <div class="skill-assessment">
            <div v-for="skill in skillAssessment" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-score">{{ skill.score }}分</span>
              </div>
              <el-progress 
                :percentage="skill.score" 
                :color="getSkillColor(skill.score)"
                :stroke-width="8"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 学习进度 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>学习进度</span>
            </div>
          </template>
          <div class="learning-progress">
            <div v-for="course in learningProgress" :key="course.name" class="course-item">
              <div class="course-header">
                <span class="course-name">{{ course.name }}</span>
                <span class="course-progress">{{ course.progress }}%</span>
              </div>
              <el-progress 
                :percentage="course.progress" 
                :color="getProgressColor(course.progress)"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 推荐岗位 -->
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>推荐岗位</span>
            </div>
          </template>
          <el-table :data="recommendedJobs" style="width: 100%">
            <el-table-column prop="company" label="公司" width="150" />
            <el-table-column prop="position" label="岗位" width="200" />
            <el-table-column prop="salary" label="薪资" width="120" />
            <el-table-column prop="location" label="地点" width="120" />
            <el-table-column prop="matchRate" label="匹配度" width="100">
              <template #default="scope">
                <el-tag :type="getMatchRateType(scope.row.matchRate)">
                  {{ scope.row.matchRate }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="primary" size="small" @click="applyJob(scope.row)">
                  立即申请
                </el-button>
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
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 最近面试数据
const recentInterviews = ref([
  {
    id: 1,
    date: '2025-01-28',
    company: '腾讯科技',
    position: '前端开发工程师',
    status: '已通过'
  },
  {
    id: 2,
    date: '2025-01-25',
    company: '阿里巴巴',
    position: '前端开发工程师',
    status: '面试中'
  },
  {
    id: 3,
    date: '2025-01-20',
    company: '字节跳动',
    position: '前端开发工程师',
    status: '未通过'
  }
])

// 技能评估数据
const skillAssessment = ref([
  {
    name: 'JavaScript',
    score: 90
  },
  {
    name: 'Vue.js',
    score: 85
  },
  {
    name: 'React',
    score: 75
  },
  {
    name: 'Node.js',
    score: 70
  }
])

// 学习进度数据
const learningProgress = ref([
  {
    name: '面试技巧提升',
    progress: 80
  },
  {
    name: '算法与数据结构',
    progress: 65
  },
  {
    name: '系统设计',
    progress: 45
  }
])

// 推荐岗位数据
const recommendedJobs = ref([
  {
    company: '腾讯科技',
    position: '前端开发工程师',
    salary: '15k-25k',
    location: '深圳',
    matchRate: 95
  },
  {
    company: '阿里巴巴',
    position: '前端开发工程师',
    salary: '18k-30k',
    location: '杭州',
    matchRate: 88
  },
  {
    company: '字节跳动',
    position: '前端开发工程师',
    salary: '20k-35k',
    location: '北京',
    matchRate: 82
  }
])

// 获取面试状态类型
const getInterviewStatusType = (status) => {
  const statusMap = {
    '已通过': 'success',
    '面试中': 'warning',
    '未通过': 'danger',
    '待面试': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取技能颜色
const getSkillColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#E6A23C'
  if (score >= 70) return '#F56C6C'
  return '#909399'
}

// 获取进度条颜色
const getProgressColor = (progress) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 获取匹配度类型
const getMatchRateType = (rate) => {
  if (rate >= 90) return 'success'
  if (rate >= 80) return 'warning'
  return 'info'
}

// 申请岗位
const applyJob = (job) => {
  ElMessage.success(`已申请 ${job.company} 的 ${job.position} 岗位`)
}

// 页面导航
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.jobseeker-dashboard {
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

.recent-interviews {
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

.interview-date {
  width: 100px;
  font-weight: bold;
  color: #409EFF;
}

.interview-info {
  flex: 1;
  margin: 0 15px;
}

.company-name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.position-name {
  color: #909399;
  font-size: 14px;
}

.skill-assessment {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.skill-item:last-child {
  border-bottom: none;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-name {
  color: #303133;
  font-weight: bold;
}

.skill-score {
  color: #909399;
  font-size: 14px;
}

.learning-progress {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.course-item:last-child {
  border-bottom: none;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.course-name {
  color: #303133;
  font-weight: bold;
}

.course-progress {
  color: #909399;
  font-size: 14px;
}
</style> 