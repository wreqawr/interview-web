<template>
  <div class="dashboard">
    <!-- 测试区域 - 仅用于开发测试 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>角色测试区域（仅开发测试用）</span>
          </template>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span>当前角色: {{ userRole || '未登录' }}</span>
            <el-button @click="switchRole('ROLE_ADMIN')" type="danger" size="small">切换为管理员</el-button>
            <el-button @click="switchRole('ROLE_HR')" type="warning" size="small">切换为HR</el-button>
            <el-button @click="switchRole('ROLE_JOB_SEEKER')" type="primary" size="small">切换为求职者</el-button>
            <el-button @click="clearRole" type="info" size="small">清除角色</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 统计卡片区域 -->
      <el-col :span="24">
        <div class="statistics-section">
          <el-row :gutter="20">
            <el-col :span="6" v-for="stat in userStatistics" :key="stat.key">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon" :style="stat.icon.includes('@/assets/') ? {} : { background: stat.color }">
                    <img 
                      v-if="stat.icon === '@/assets/resume/resume-version.svg'" 
                      :src="resumeVersionIcon" 
                      :alt="stat.name"
                      class="svg-icon"
                    />
                    <img 
                      v-else-if="stat.icon === '@/assets/interview/interview-count.svg'" 
                      :src="interviewCountIcon" 
                      :alt="stat.name"
                      class="svg-icon"
                    />
                    <img 
                      v-else-if="stat.icon === '@/assets/other/comprehensive-score.svg'" 
                      :src="comprehensiveScoreIcon" 
                      :alt="stat.name"
                      class="svg-icon"
                    />
                    <img 
                      v-else-if="stat.icon === '@/assets/other/get-offer.svg'" 
                      :src="getOfferIcon" 
                      :alt="stat.name"
                      class="svg-icon"
                    />
                    <component 
                      v-else 
                      :is="stat.icon" 
                    />
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-name">{{ stat.name }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <!-- 功能菜单区域 -->
      <el-col :span="24">
        <div class="features-section">
          <h2 class="section-title">功能菜单</h2>
          
          <!-- 一级菜单 -->
          <el-row :gutter="20">
            <el-col :span="8" v-for="category in featureCategories" :key="category.key">
              <el-card class="category-card" shadow="hover">
                <template #header>
                  <div class="category-header">
                    <component :is="category.icon" class="category-icon" />
                    <span class="category-title">{{ category.name }}</span>
                  </div>
                </template>
                
                <!-- 二级菜单 -->
                <div class="sub-features">
                  <div 
                    v-for="feature in category.features" 
                    :key="feature.key"
                    class="feature-item enabled"
                    @click="handleFeatureClick(feature)"
                  >
                    <div class="feature-icon">
                      <img 
                        v-if="feature.icon === '@/assets/resume/resume-management.svg'" 
                        :src="resumeManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/resume/resume-version.svg'" 
                        :src="resumeVersionIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/interview/interview-count.svg'" 
                        :src="interviewCountIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/user-management.svg'" 
                        :src="userManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/company-management.svg'" 
                        :src="companyManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/system-setting.svg'" 
                        :src="systemSettingIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/data-management.svg'" 
                        :src="dataManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/system-monitor.svg'" 
                        :src="systemMonitorIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/candidate-management.svg'" 
                        :src="candidateManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobs-management.svg'" 
                        :src="jobsManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/communication-management.svg'" 
                        :src="communicationManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/data-analyze.svg'" 
                        :src="dataAnalyzeIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/resume-select.svg'" 
                        :src="resumeSelectIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/interview-management.svg'" 
                        :src="interviewManagementIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/interview-assessment.svg'" 
                        :src="interviewAssessmentIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/company-info.svg'" 
                        :src="companyInfoIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/user-profile.svg'" 
                        :src="userProfileIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/interview-appointment.svg'" 
                        :src="interviewAppointmentIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/ai-interview.svg'" 
                        :src="aiInterviewIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/realtime-interview.svg'" 
                        :src="realtimeInterviewIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/interview-record.svg'" 
                        :src="interviewRecordIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/interview-report.svg'" 
                        :src="interviewReportIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <img 
                        v-else-if="feature.icon === '@/assets/function/jobseeker/study-center.svg'" 
                        :src="studyCenterIcon" 
                        :alt="feature.name"
                        class="svg-icon"
                      />
                      <component 
                        v-else 
                        :is="feature.icon" 
                      />
                    </div>
                    <div class="feature-info">
                      <div class="feature-name">{{ feature.name }}</div>
                      <div class="feature-desc">{{ feature.description }}</div>
                    </div>
                    <div class="feature-status">
                      <el-tag type="success" size="small">
                        可用
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { getRoleFeatures } from '@/constants/permissions'
import resumeManagementIcon from '@/assets/function/jobseeker/resume-management.svg'
import resumeVersionIcon from '@/assets/resume/resume-version.svg'
import interviewCountIcon from '@/assets/interview/interview-count.svg'
import comprehensiveScoreIcon from '@/assets/other/comprehensive-score.svg'
import getOfferIcon from '@/assets/other/get-offer.svg'
import userManagementIcon from '@/assets/function/admin/user-management.svg'
import companyManagementIcon from '@/assets/function/admin/company-management.svg'
import systemSettingIcon from '@/assets/function/admin/system-setting.svg'
import dataManagementIcon from '@/assets/function/admin/data-management.svg'
import systemMonitorIcon from '@/assets/function/admin/system-monitor.svg'
import candidateManagementIcon from '@/assets/function/hr/candidate-management.svg'
import jobsManagementIcon from '@/assets/function/hr/jobs-management.svg'
import communicationManagementIcon from '@/assets/function/hr/communication-management.svg'
import dataAnalyzeIcon from '@/assets/function/hr/data-analyze.svg'
import resumeSelectIcon from '@/assets/function/hr/resume-select.svg'
import interviewManagementIcon from '@/assets/function/hr/interview-management.svg'
import interviewAssessmentIcon from '@/assets/function/hr/interview-assessment.svg'
import companyInfoIcon from '@/assets/function/hr/company-info.svg'
import userProfileIcon from '@/assets/function/jobseeker/user-profile.svg'
import interviewAppointmentIcon from '@/assets/function/jobseeker/interview-appointment.svg'
import aiInterviewIcon from '@/assets/function/jobseeker/ai-interview.svg'
import realtimeInterviewIcon from '@/assets/function/jobseeker/realtime-interview.svg'
import interviewRecordIcon from '@/assets/function/jobseeker/interview-record.svg'
import interviewReportIcon from '@/assets/function/jobseeker/interview-report.svg'
import studyCenterIcon from '@/assets/function/jobseeker/study-center.svg'

const router = useRouter()
const userStore = useUserStore()

// 测试用的角色状态
const testRole = ref(null)

// 用户统计信息
const userStatistics = computed(() => {
  return userStore.userStatistics
})

// 用户角色
const userRole = computed(() => {
  // 优先使用测试角色，否则使用store中的角色
  return testRole.value || userStore.userRole
})

// 根据用户角色获取功能分类
const featureCategories = computed(() => {
  const role = userRole.value
  console.log('获取功能分类，用户角色:', role)
  if (!role) {
    console.log('没有用户角色，返回空数组')
    return []
  }
  
  // 从permissions.js中获取角色功能
  const roleFeatures = getRoleFeatures(role)
  console.log('从permissions.js获取的功能:', roleFeatures)
  
  // 将功能列表转换为分类格式
  const categories = []
  
  roleFeatures.forEach(feature => {
    // 根据功能类型分组
    let categoryKey = ''
    let categoryName
    let categoryIcon

    if (feature.key.includes('resume')) {
      categoryKey = 'resume_management'
      categoryName = '简历管理'
      categoryIcon = 'Document'
    } else if (feature.key.includes('interview') || feature.key.includes('appointment') || feature.key.includes('mock')) {
      categoryKey = 'interview_management'
      categoryName = '面试管理'
      categoryIcon = 'VideoPlay'
    } else if (feature.key.includes('history') || feature.key.includes('learning')) {
      categoryKey = 'history_learning'
      categoryName = '历史学习'
      categoryIcon = 'Clock'
    } else if (feature.key.includes('report') || feature.key.includes('analytics')) {
      categoryKey = 'evaluation_analytics'
      categoryName = '评估分析'
      categoryIcon = 'DataAnalysis'
    } else if (feature.key.includes('profile') || feature.key.includes('user')) {
      categoryKey = 'user_profile'
      categoryName = '个人中心'
      categoryIcon = 'User'
    } else {
      categoryKey = 'other'
      categoryName = '其他功能'
      categoryIcon = 'Setting'
    }
    
    // 查找或创建分类
    let category = categories.find(cat => cat.key === categoryKey)
    if (!category) {
      category = {
        key: categoryKey,
        name: categoryName,
        icon: categoryIcon,
        features: []
      }
      categories.push(category)
    }
    
    // 添加功能到分类
    category.features.push({
      key: feature.key,
      name: feature.name,
      icon: feature.icon,
      description: feature.description,
      path: feature.path
    })
  })
  
  console.log('返回的功能分类:', categories)
  return categories
})

// 角色切换方法
const switchRole = (role) => {
  testRole.value = role
  ElMessage.success(`已切换到 ${role} 角色`)
}

// 清除角色
const clearRole = () => {
  testRole.value = null
  ElMessage.info('已清除测试角色')
}

// 处理功能点击
const handleFeatureClick = (feature) => {
  ElMessage.info(`正在跳转到 ${feature.name}...`)
  router.push(feature.path)
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.statistics-section {
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-name {
  font-size: 14px;
  font-weight: bold;
  color: #909399;
}

.features-section {
  margin-top: 30px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.category-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #303133;
}

.category-icon {
  margin-right: 8px;
  font-size: 18px;
}

.category-title {
  font-size: 16px;
}

.sub-features {
  padding: 10px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.feature-item:hover {
  background-color: #f5f7fa;
}

.feature-item.enabled {
  border-color: #e1f3d8;
  background-color: #f0f9ff;
}

.feature-item.enabled:hover {
  background-color: #e1f3d8;
  border-color: #67c23a;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.svg-icon {
  width: 50px;
  height: 50px;
}

/* 统计卡片中的SVG图标样式 */
.stat-icon .svg-icon {
  width: 80px;
  height: 80px;
}

.feature-info {
  flex: 1;
}

.feature-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.feature-status {
  margin-left: 10px;
}
</style> 