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
      <!-- 统计卡片区域 - 仅求职者可见 -->
      <el-col :span="24" v-if="userRole === 'ROLE_JOB_SEEKER'">
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
          
          <!-- 功能轮播图 -->
          <el-carousel 
            :interval="0" 
            :autoplay="false" 
            indicator-position="outside"
            height="400px"
            class="feature-carousel"
          >
            <el-carousel-item v-for="page in userFeatures" :key="page.key">
              <div class="carousel-content">
                <div class="feature-row">
                  <div 
                    v-for="(feature, index) in page.features" 
                    :key="feature.key"
                    class="feature-card-wrapper"
                    :class="{
                      'feature-left': index === 0,
                      'feature-center': index === 1,
                      'feature-right': index === 2
                    }"
                    @click="handleFeatureClick(feature)"
                  >
                    <div class="feature-card-content">
                      <div class="feature-icon-large">
                        <img 
                          v-if="feature.icon === '@/assets/resume/resume-management.svg'" 
                          :src="resumeManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/resume/resume-version.svg'" 
                          :src="resumeVersionIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/interview/interview-count.svg'" 
                          :src="interviewCountIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/user-management.svg'" 
                          :src="userManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/company-management.svg'" 
                          :src="companyManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/system-setting.svg'" 
                          :src="systemSettingIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/data-management.svg'" 
                          :src="dataManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/system-monitor.svg'" 
                          :src="systemMonitorIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/candidate-management.svg'" 
                          :src="candidateManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobs-management.svg'" 
                          :src="jobsManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/communication-management.svg'" 
                          :src="communicationManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/data-analyze.svg'" 
                          :src="dataAnalyzeIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/resume-select.svg'" 
                          :src="resumeSelectIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/interview-management.svg'" 
                          :src="interviewManagementIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/interview-assessment.svg'" 
                          :src="interviewAssessmentIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/company-info.svg'" 
                          :src="companyInfoIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/user-profile.svg'" 
                          :src="userProfileIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/interview-appointment.svg'" 
                          :src="interviewAppointmentIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/ai-interview.svg'" 
                          :src="aiInterviewIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/realtime-interview.svg'" 
                          :src="realtimeInterviewIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/interview-record.svg'" 
                          :src="interviewRecordIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/interview-report.svg'" 
                          :src="interviewReportIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <img 
                          v-else-if="feature.icon === '@/assets/function/jobseeker/study-center.svg'" 
                          :src="studyCenterIcon" 
                          :alt="feature.name"
                          class="svg-icon-large"
                        />
                        <component 
                          v-else 
                          :is="feature.icon" 
                        />
                      </div>
                      <div class="feature-info-large">
                        <div class="feature-name-large">{{ feature.name }}</div>
                        <div class="feature-desc-large">{{ feature.description }}</div>
                      </div>
                      <div class="feature-status-large">
                        <el-tag type="success" size="large">
                          可用
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
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

// 根据用户角色获取功能列表
const userFeatures = computed(() => {
  const role = userRole.value
  console.log('获取功能列表，用户角色:', role)
  if (!role) {
    console.log('没有用户角色，返回空数组')
    return []
  }
  
  // 从permissions.js中获取角色功能
  const roleFeatures = getRoleFeatures(role)
  console.log('从permissions.js获取的功能:', roleFeatures)
  
  // 将功能列表按每页3个进行分组（中间完整，左右各半个）
  const featuresPerPage = 3
  const featurePages = []
  
  for (let i = 0; i < roleFeatures.length; i += featuresPerPage) {
    const pageFeatures = roleFeatures.slice(i, i + featuresPerPage)
    featurePages.push({
      key: `page_${Math.floor(i / featuresPerPage) + 1}`,
      features: pageFeatures
    })
  }
  
  console.log('返回的功能页面:', featurePages)
  return featurePages
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

/* 轮播图样式 */
.feature-carousel {
  margin: 20px 0;
}

.carousel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.carousel-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
}

.feature-row {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  perspective: 1000px;
}

.feature-card-wrapper {
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-left {
  transform: translateX(-30%) scale(0.8) rotateY(-15deg);
  opacity: 0.7;
  z-index: 1;
}

.feature-center {
  transform: scale(1) rotateY(0deg);
  opacity: 1;
  z-index: 3;
}

.feature-right {
  transform: translateX(30%) scale(0.8) rotateY(15deg);
  opacity: 0.7;
  z-index: 1;
}

.feature-card-wrapper:hover {
  transform: translateY(-8px) scale(1.05);
}

.feature-left:hover {
  transform: translateX(-30%) scale(0.85) rotateY(-15deg) translateY(-8px);
  opacity: 0.9;
}

.feature-center:hover {
  transform: scale(1.05) translateY(-8px);
  opacity: 1;
}

.feature-right:hover {
  transform: translateX(30%) scale(0.85) rotateY(15deg) translateY(-8px);
  opacity: 0.9;
}

.feature-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  width: 100%;
}

.feature-icon-large {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 48px;
  box-shadow: 
    0 15px 35px rgba(102, 126, 234, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.feature-icon-large::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 24px;
}

.svg-icon-large {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  position: relative;
  z-index: 1;
}

/* 统计卡片中的SVG图标样式 */
.stat-icon .svg-icon {
  width: 80px;
  height: 80px;
}

.feature-info-large {
  text-align: center;
  margin-bottom: 20px;
}

.feature-name-large {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.feature-desc-large {
  font-size: 16px;
  color: #606266;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
}

.feature-status-large {
  margin-top: 16px;
}

/* 轮播图指示器样式 */

</style>