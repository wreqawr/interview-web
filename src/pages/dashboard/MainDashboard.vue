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
          
          <!-- 2D轮播图容器 -->
          <div class="carousel-container">
            <!-- 控制按钮 -->
            <div class="carousel-controls">
              <div 
                class="carousel-btn carousel-btn-prev" 
                @click="prevSlide"
                :class="{ disabled: currentIndex === 0 }"
              >
                <el-icon><ArrowLeft /></el-icon>
                <span>上一个</span>
              </div>
              <div 
                class="carousel-btn carousel-btn-next" 
                @click="nextSlide"
              >
                <el-icon><ArrowRight /></el-icon>
                <span>下一个</span>
              </div>
            </div>
            
            <!-- 轮播图主体 -->
            <div class="carousel-wrapper">
              <div 
                class="carousel-track"
                :style="{ transform: `translateX(-${(currentIndex - 1) * 33.333}%)` }"
              >
                <div 
                  v-for="(feature, index) in extendedFeatures" 
                  :key="`${feature.key}-${index}`"
                  class="carousel-slide"
                  :class="{ 
                    'active-slide': currentIndex === index,
                    'prev-slide': currentIndex - 1 === index,
                    'next-slide': currentIndex + 1 === index
                  }"
                >
                  <div 
                    class="feature-card-content"
                    @click="handleFeatureClick(feature)"
                  >
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
            
            <!-- 指示器 -->
            <div class="carousel-indicators">
              <div 
                v-for="(feature, index) in userFeatures[0].features" 
                :key="`indicator-${feature.key}`"
                class="indicator"
                :class="{ active: currentIndex % originalFeatureCount === index }"
                @click="goToSlide(index)"
              ></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
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

// 2D轮播图控制
const currentIndex = ref(1)
const autoPlayInterval = ref(null)
const isAutoPlaying = ref(true)

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
  
  return [{
    key: 'carousel_features',
    features: roleFeatures
  }]
})

// 扩展功能列表，用于无缝循环
const extendedFeatures = computed(() => {
  if (!userFeatures.value[0]?.features) return []
  const features = userFeatures.value[0].features
  const featureCount = features.length
  
  // 动态计算需要复制的次数，确保有足够的内容
  // 假设currentIndex最大可能达到1000，我们需要确保有足够的内容
  const copiesNeeded = Math.ceil(1000 / featureCount) + 2
  const extendedArray = []
  
  for (let i = 0; i < copiesNeeded; i++) {
    extendedArray.push(...features)
  }
  
  return extendedArray
})

// 获取原始功能数量
const originalFeatureCount = computed(() => {
  if (!userFeatures.value[0]?.features) return 0
  return userFeatures.value[0].features.length
})

// 角色切换方法
const switchRole = (role) => {
  testRole.value = role
  currentIndex.value = 1 // 重置轮播图位置
  ElMessage.success(`已切换到 ${role} 角色`)
}

// 清除角色
const clearRole = () => {
  testRole.value = null
  currentIndex.value = 1
  ElMessage.info('已清除测试角色')
}

// 轮播图控制方法
const nextSlide = () => {
  currentIndex.value++
  resetAutoPlay()
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetAutoPlay()
  }
}

const goToSlide = (index) => {
  currentIndex.value = index + 1
  resetAutoPlay()
}

const resetAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
  if (isAutoPlaying.value) {
    autoPlayInterval.value = setInterval(() => {
      currentIndex.value++
    }, 4000) // 4秒自动切换
  }
}

// 处理功能点击
const handleFeatureClick = (feature) => {
  router.push(feature.path)
}

// 启动自动播放
const startAutoPlay = () => {
  if (isAutoPlaying.value && userFeatures.value[0]?.features?.length > 1) {
    autoPlayInterval.value = setInterval(() => {
      currentIndex.value++
    }, 4000)
  }
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

// 确保页面滚动正常工作
onMounted(() => {
  // 确保body可以正常滚动
  document.body.style.overflow = 'auto'
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'auto'
  
  // 确保html可以正常滚动
  document.documentElement.style.overflow = 'auto'
  document.documentElement.style.overflowX = 'hidden'
  document.documentElement.style.overflowY = 'auto'
  
  // 启动自动播放
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
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
  margin-top: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  text-align: center;
}

/* 2D轮播图样式 */
.carousel-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 0 80px;
  box-sizing: border-box;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0;
  z-index: 1000;
  pointer-events: none;
}

.carousel-btn {
  pointer-events: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border: none;
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 2px;
  user-select: none;
}

.carousel-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: scale(0.9);
}

.carousel-btn:not(.disabled):hover {
  transform: scale(1.1);
  box-shadow: 0 12px 30px rgba(64, 158, 255, 0.4);
}

.carousel-btn:not(.disabled):active {
  transform: scale(0.95);
}

.carousel-btn span {
  font-size: 10px;
  line-height: 1;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease-out;
  align-items: center;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  margin-left: -33.333%;
}

.carousel-slide {
  flex: 0 0 33.333%;
  width: 33.333%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.carousel-slide.active-slide {
  z-index: 10;
}

.carousel-slide.next-slide {
  z-index: 5;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 1000;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: #409eff;
  transform: scale(1.3);
}

.feature-card-content {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 25px;
  width: 100%;
  max-width: 280px;
  height: 100%;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  margin: 0 auto;
  transform: scale(0.9) translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.active-slide .feature-card-content {
  transform: scale(1) translateZ(0);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}

.prev-slide .feature-card-content {
  transform: scale(0.75) translateZ(0);
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.next-slide .feature-card-content {
  transform: scale(0.75) translateZ(0);
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.feature-card-content:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.2),
    0 12px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.feature-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: rgba(102, 126, 234, 0.8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 32px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.feature-card-content:hover .feature-icon-large {
  transform: scale(1.02) translateZ(0);
}

.svg-icon-large {
  width: 48px;
  height: 48px;
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
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
}

.feature-desc-large {
  font-size: 12px;
  color: #34495e;
  line-height: 1.5;
  max-width: 240px;
  margin: 0 auto;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.feature-status-large {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }
  
  .carousel-slide {
    padding: 20px;
  }
  
  .feature-card-content {
    padding: 30px;
  }
  
  .feature-icon-large {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }
  
  .svg-icon-large {
    width: 60px;
    height: 60px;
  }
  
  .feature-name-large {
    font-size: 24px;
  }
  
  .feature-desc-large {
    font-size: 14px;
  }
  
  .carousel-btn {
    width: 60px;
    height: 60px;
  }
  
  .carousel-btn span {
    font-size: 10px;
  }
}

/* 低性能设备优化 */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: transform 0.1s ease-out;
  }
  
  .carousel-slide {
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  }
  
  .feature-card-content {
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  }
  
  .feature-icon-large {
    transition: transform 0.1s ease-out;
  }
}

/* 低分辨率设备优化 */
@media (max-resolution: 1dppx) {
  .carousel-track {
    transition: transform 0.1s ease-out;
  }
  
  .carousel-slide {
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  }
  
  .feature-card-content {
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  }
}
</style> 