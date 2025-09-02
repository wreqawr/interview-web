<template>
  <div class="interview-preparation-page">

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 欢迎区域 -->
      <section class="welcome-section">
        <h1 class="main-title">准备好迎接你的下一次机会了吗？</h1>
        <p class="subtitle">选择下方的选项，开始一场为你量身定制的模拟面试吧</p>
        <div class="welcome-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
        </div>
      </section>

      <!-- 面试配置卡片 -->
      <section class="configuration-section">
        <div class="config-card">
          <div class="card-header">
            <h2>面试配置</h2>
            <p>根据你的需求定制面试体验</p>
          </div>
          
          <div class="config-form">
            <!-- 简历和职位选择 - 左右结构 -->
            <div class="form-row">
              <!-- 左边：选择简历 -->
              <div class="form-group form-group-left">
                <label class="form-label">
                  <el-icon><Document /></el-icon>
                  选择简历
                </label>
                <el-select
                  v-model="interviewConfig.resumeId"
                  placeholder="请选择简历"
                  size="large"
                  class="form-select"
                  :loading="resumeLoading"
                  :disabled="resumes.length === 0"
                  @change="handleResumeChange"
                >
                  <el-option
                    v-for="resume in resumes"
                    :key="resume.id"
                    :label="resume.title"
                    :value="resume.id"
                  >
                    <div class="resume-option">
                      <span class="resume-icon">📄</span>
                      <div class="resume-info">
                        <span class="resume-title">{{ resume.title }}</span>
                        <span class="resume-meta">{{ resume.format }} · {{ resume.updateTime }} · 评分: {{ resume.score }}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
                <div v-if="resumes.length === 0" class="no-resume-tip">
                  <el-icon><Document /></el-icon>
                  <span>暂无简历，请先上传简历</span>
                </div>
              </div>

              <!-- 中间：选择职位 -->
              <div class="form-group form-group-center">
                <label class="form-label">
                  <el-icon><Briefcase /></el-icon>
                  目标职位
                </label>
                <el-select
                  v-model="interviewConfig.position"
                  placeholder="请选择目标职位"
                  size="large"
                  class="form-select"
                  :loading="positionLoading"
                  :disabled="positionOptions.length === 0"
                  @change="handlePositionChange"
                >
                  <el-option
                    v-for="position in positionOptions"
                    :key="position.value"
                    :label="position.label"
                    :value="position.value"
                  >
                    <div class="position-option">
                      <span class="position-icon">{{ position.icon }}</span>
                      <span class="position-label">{{ position.label }}</span>
                      <span class="position-desc">{{ position.description }}</span>
                    </div>
                  </el-option>
                </el-select>
                <div v-if="positionOptions.length === 0 && !positionLoading" class="no-position-tip">
                  <el-icon><Briefcase /></el-icon>
                  <span>当前还未投递过岗位，请先投递</span>
                </div>
              </div>

              <!-- 右边：选择面试模式 -->
              <div class="form-group form-group-right">
                <label class="form-label">
                  <el-icon><VideoPlay /></el-icon>
                  面试模式
                </label>
                <el-select
                  v-model="interviewConfig.mode"
                  placeholder="请选择面试模式"
                  size="large"
                  class="form-select"
                  @change="handleModeChange"
                >
                  <el-option
                    value="video"
                    label="视频面试"
                  >
                    <div class="mode-option">
                      <span class="mode-icon">🎥</span>
                      <span class="mode-label">视频面试</span>
                      <span class="mode-desc">实时视频对话，更真实的面试体验</span>
                    </div>
                  </el-option>
                  <el-option
                    value="chat"
                    label="文字聊天"
                  >
                    <div class="mode-option">
                      <span class="mode-icon">💬</span>
                      <span class="mode-label">文字聊天</span>
                      <span class="mode-desc">纯文字对话，更轻松自然的交流</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 准备区 -->
      <section class="preparation-section">
        <div class="preparation-grid">
          <!-- 可能问到的问题 -->
          <div class="prep-card questions-card">
            <div class="card-header">
              <h3>
                <el-icon><QuestionFilled /></el-icon>
                可能问到的问题
              </h3>
              <el-button 
                type="text" 
                @click="questionsExpanded = !questionsExpanded"
                class="expand-btn"
              >
                {{ questionsExpanded ? '收起' : '展开' }}
                <el-icon><ArrowDown v-if="!questionsExpanded" /><ArrowUp v-else /></el-icon>
              </el-button>
            </div>
            <el-collapse-transition>
              <div v-show="questionsExpanded" class="questions-content">
                <div 
                  v-for="(question, index) in sampleQuestions" 
                  :key="index"
                  class="question-item"
                >
                  <div class="question-number">{{ index + 1 }}</div>
                  <div class="question-text">{{ question }}</div>
                </div>
              </div>
            </el-collapse-transition>
          </div>

          <!-- 面试技巧提示 -->
          <div class="prep-card tips-card">
            <div class="card-header">
              <h3>
                <el-icon><Light /></el-icon>
                面试技巧提示
              </h3>
            </div>
            <div class="tips-content">
              <div 
                v-for="(tip, index) in interviewTips" 
                :key="index"
                class="tip-item"
              >
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                  <h4 class="tip-title">{{ tip.title }}</h4>
                  <p class="tip-desc">{{ tip.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 行动按钮 -->
      <section class="action-section">
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large" 
            class="start-interview-btn"
            :disabled="!canStartInterview"
            @click="startInterview"
          >
            <el-icon><VideoPlay /></el-icon>
            开始模拟面试
          </el-button>
          
          <el-button 
            type="success" 
            size="large" 
            class="preview-btn"
            @click="previewInterview"
          >
            <el-icon><View /></el-icon>
            预览面试流程
          </el-button>
        </div>
        <p class="action-hint">请确保已选择所有必要的配置项</p>
      </section>

      <!-- 设备检测提示 -->
      <section class="device-check-section">
        <div class="device-check-card">
          <div class="check-header">
            <el-icon><VideoCamera /></el-icon>
            <span>设备检测</span>
          </div>
          <div class="check-content">
            <div class="check-item">
              <el-icon :class="{ 'check-success': micWorking, 'check-error': !micWorking }">
                <component :is="micWorking ? 'Check' : 'Close'" />
              </el-icon>
              <span>麦克风 {{ micWorking ? '正常' : '异常' }}</span>
            </div>
            <div class="check-item">
              <el-icon :class="{ 'check-success': cameraWorking, 'check-error': !cameraWorking }">
                <component :is="cameraWorking ? 'Check' : 'Close'" />
              </el-icon>
              <span>摄像头 {{ cameraWorking ? '正常' : '异常' }}</span>
            </div>
          </div>
          <p class="device-note">开始前请确保你的麦克风和摄像头工作正常</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getResumeList } from '@/api/resume'
import { getCandidateJobList } from '@/api/candidate'
import { useInterviewStore } from '@/stores/interview'
import {
  QuestionFilled, Briefcase, Document,
  ArrowDown, ArrowUp, Light, VideoPlay,
  VideoCamera, View
} from '@element-plus/icons-vue'

const router = useRouter()
const interviewStore = useInterviewStore()

// 面试配置
const interviewConfig = ref({
  position: '',
  resumeId: '',
  mode: 'chat' // 默认文字聊天面试模式
})

// 简历数据
const resumes = ref([])
const resumeLoading = ref(false)

// 获取简历列表
const fetchResumeList = async () => {
  try {
    resumeLoading.value = true
    const response = await getResumeList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换简历数据格式
      resumes.value = data.data.map(resume => ({
        id: resume.resumeId,
        title: resume.resumeTitle || '未命名简历',
        format: resume.mimeType === 'application/pdf' ? 'PDF' : 
                resume.mimeType === 'application/msword' ? 'DOC' : 
                resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' : '未知',
        updateTime: new Date(resume.updatedAt).toLocaleDateString('zh-CN'),
        score: resume.rate || 0
      }))
      
      // 默认选择第一个简历
      if (resumes.value.length > 0) {
        interviewConfig.value.resumeId = resumes.value[0].id
        // 同时设置resumeInfo，确保store中有完整的简历信息
        interviewStore.setResumeInfo(resumes.value[0])
      }
    } else {
      ElMessage.error(data.message || '获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    ElMessage.error('获取简历列表失败，请重试')
  } finally {
    resumeLoading.value = false
  }
}

// 获取职位列表
const fetchPositionList = async () => {
  try {
    positionLoading.value = true
    const response = await getCandidateJobList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换职位数据格式
      positionOptions.value = data.data.map(job => ({
        value: job.jobId.toString(),
        label: job.jobTitle, // 只显示职位名称，避免重复
        icon: '💼',
        description: job.companyName, // 显示公司名作为补充信息
        originalData: job
      }))
      
      // 默认选择第一个职位
      if (positionOptions.value.length > 0) {
        interviewConfig.value.position = positionOptions.value[0].value
        // 同时设置positionInfo，确保store中有完整的职位信息
        interviewStore.setPositionInfo(positionOptions.value[0].originalData)
      }
    } else {
      ElMessage.error(data.message || '获取职位列表失败')
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取职位列表失败，请重试')
    }
  } finally {
    positionLoading.value = false
  }
}

// 展开状态
const questionsExpanded = ref(true)

// 设备状态
const micWorking = ref(false)
const cameraWorking = ref(false)

// 职位选项
const positionOptions = ref([])
const positionLoading = ref(false)

// 示例问题
const sampleQuestions = computed(() => [
  '请介绍一下你的技术栈和项目经验',
  '如何优化前端页面的性能？',
  '请解释一下你最近解决的一个技术难题',
  '你对新技术的学习方法是什么？',
  '请描述一个你遇到的最大挑战',
  '在团队中如何处理意见分歧？',
  '请分享一个你失败的经历和学到的教训',
  '你的职业规划是什么？'
])

// 面试技巧
const interviewTips = ref([
  {
    title: 'STAR法则',
    description: '回答行为问题时，使用情境-任务-行动-结果的框架'
  },
  {
    title: '具体化描述',
    description: '用具体的数据和例子来支撑你的观点'
  },
  {
    title: '积极表达',
    description: '即使遇到困难，也要展现积极解决问题的态度'
  },
  {
    title: '准备反问',
    description: '准备2-3个有深度的问题来反问面试官'
  }
])

// 是否可以开始面试
const canStartInterview = computed(() => {
  return interviewConfig.value.position && 
         interviewConfig.value.resumeId && 
         interviewConfig.value.mode
})

// 处理职位选择变化
const handlePositionChange = (position) => {
  interviewConfig.value.position = position
  // 找到对应的职位信息并存储
  const selectedPosition = positionOptions.value.find(pos => pos.value === position)
  if (selectedPosition) {
    interviewStore.setPositionInfo(selectedPosition.originalData)
  }
  // 同时更新store中的配置
  interviewStore.setInterviewConfig({ position })
}

// 处理简历选择变化
const handleResumeChange = (resumeId) => {
  interviewConfig.value.resumeId = resumeId
  // 找到对应的简历信息并存储
  const selectedResume = resumes.value.find(resume => resume.id === resumeId)
  if (selectedResume) {
    interviewStore.setResumeInfo(selectedResume)
  }
  interviewStore.setInterviewConfig({ resumeId })
}

// 处理面试模式变化
const handleModeChange = (mode) => {
  interviewConfig.value.mode = mode
  interviewStore.setInterviewConfig({ mode })
}



// 开始面试
const startInterview = () => {
  if (!canStartInterview.value) {
    ElMessage.warning('请先完成面试配置')
    return
  }
  
  // 将完整配置保存到store
  interviewStore.setInterviewConfig(interviewConfig.value)
  
  // 根据面试模式跳转到不同页面
  if (interviewConfig.value.mode === 'video') {
    // 视频面试模式：检查设备状态
    if (!micWorking.value || !cameraWorking.value) {
      ElMessage.warning('请先确保设备正常工作')
      return
    }
    
    // 跳转到视频面试页面，不传递URL参数
    router.push('/interview/live')
  } else if (interviewConfig.value.mode === 'chat') {
    // 文字聊天模式：直接跳转，不传递URL参数
    router.push('/interview/chat')
  }
}

// 预览面试流程
const previewInterview = () => {
  ElMessage.info('预览功能待实现')
  // 这里可以跳转到面试流程预览页面
}

// 检测设备状态
const checkDevices = async () => {
  try {
    // 检测麦克风
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micWorking.value = true
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    micWorking.value = false
    console.log('麦克风检测失败:', error)
  }
  
  try {
    // 检测摄像头
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    cameraWorking.value = true
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    cameraWorking.value = false
    console.log('摄像头检测失败:', error)
  }
}

// 滚动解锁函数
const unlockScroll = () => {
  try {
    const body = document.body
    const html = document.documentElement
    
    // 移除可能影响滚动的类
    body.classList.remove('el-popup-parent--hidden')
    body.classList.remove('el-overflow-hidden')
    
    // 清理内联样式
    if (body.style.overflow) body.style.overflow = ''
    if (body.style.position) body.style.position = ''
    if (html.style.overflow) html.style.overflow = ''
    if (html.style.position) html.style.position = ''
    
    // 强制设置可滚动
    body.style.overflow = 'auto'
    html.style.overflow = 'auto'
    
    // 检查并清理页面内可能影响滚动的元素
    const pageElements = document.querySelectorAll('.interview-preparation-page *')
    pageElements.forEach(el => {
      if (el.style && el.style.overflow === 'hidden') {
        el.style.overflow = ''
      }
    })
  } catch (e) { /* 忽略 */ }
}

onMounted(() => {
  checkDevices()
  fetchResumeList()
  fetchPositionList()
  // 进入页面强制解锁滚动并做多次延迟兜底
  unlockScroll()
  setTimeout(unlockScroll, 50)
  setTimeout(unlockScroll, 200)
  setTimeout(unlockScroll, 500)
})
</script> 

<style scoped>
.interview-preparation-page {
  min-height: calc(100vh - 64px);
  background: rgba(248, 250, 252, 0.95);
  color: #333;
}



/* 主内容区样式 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px; /* 移除顶部内边距，因为现在有全局导航栏 */
}

/* 欢迎区域样式 */
.welcome-section {
  text-align: center;
  margin-bottom: 20px; /* 进一步减少底部间距 */
  position: relative;
}

.main-title {
  font-size: 36px; /* 减少标题字体大小 */
  font-weight: 700;
  color: #1a202c; /* 统一与其他页面的深色标题 */
  margin-bottom: 10px; /* 进一步减少标题底部间距 */
  text-shadow: none;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px; /* 减少副标题字体大小 */
  color: #4b5563; /* 与全站统一的次要文字颜色 */
  margin-bottom: 20px; /* 进一步减少副标题底部间距 */
  line-height: 1.5;
}

.welcome-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0.06; /* 更淡以适配浅色背景 */
}

.decoration-circle {
  position: absolute;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle:nth-child(1) {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.decoration-circle:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 50px;
  right: -75px;
  animation-delay: 2s;
}

.decoration-circle:nth-child(3) {
  width: 100px;
  height: 100px;
  bottom: -50px;
  left: 50px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 配置区域样式 */
.configuration-section {
  margin-bottom: 25px; /* 减少底部间距 */
}

.config-card {
  background: #fff;
  border-radius: 15px; /* 减少圆角 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 减少阴影 */
  overflow: hidden;
}

.card-header {
  background: #f8f9fa; /* 与其他页面一致的浅灰背景 */
  color: #1a202c; /* 深色标题 */
  padding: 15px; /* 进一步减少内边距 */
  text-align: center;
}

.card-header h2 {
  font-size: 24px; /* 减少标题字体大小 */
  font-weight: 700;
  margin: 0 0 8px 0; /* 减少标题底部间距 */
}

.card-header p {
  font-size: 14px; /* 减少描述字体大小 */
  margin: 0;
  color: #4b5563;
}

.config-form {
  padding: 20px 25px; /* 减少顶部内边距，保持左右内边距 */
}

.form-row {
  display: flex;
  gap: 20px; /* 减少左右间距 */
  margin-bottom: 25px; /* 减少底部间距 */
}

.form-group {
  flex: 1;
}

.form-group-left {
  /* Add specific styles if needed for left group */
}

.form-group-center {
  /* Add specific styles if needed for center group */
}

.form-group-right {
  /* Add specific styles if needed for right group */
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px; /* 减少图标和文字间距 */
  font-size: 16px; /* 减少标签字体大小 */
  font-weight: 600;
  color: #333;
  margin-bottom: 10px; /* 减少标签底部间距 */
}

.form-select {
  width: 100%;
}

.resume-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.resume-icon {
  font-size: 24px;
}

.resume-info {
  display: flex;
  flex-direction: column;
}

.resume-title {
  font-weight: 600;
  color: #333;
}

.resume-meta {
  color: #666;
  font-size: 14px;
}

.no-resume-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}

.no-position-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}

.position-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.position-icon {
  font-size: 24px;
}

.position-label {
  font-weight: 600;
  color: #333;
}

.position-desc {
  color: #666;
  font-size: 14px;
  margin-left: auto;
}

/* 准备区域样式 */
.preparation-section {
  margin-bottom: 25px; /* 减少底部间距 */
}

.preparation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); /* 减少最小宽度 */
  gap: 20px; /* 减少卡片间距 */
}

.prep-card {
  background: #fff;
  border-radius: 12px; /* 减少圆角 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* 减少阴影 */
  overflow: hidden;
}

.prep-card .card-header {
  background: #f8f9fa;
  padding: 15px; /* 减少内边距 */
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prep-card .card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px; /* 减少图标和文字间距 */
  margin: 0;
  font-size: 18px; /* 减少标题字体大小 */
  color: #333;
}

.expand-btn {
  color: #667eea;
  font-weight: 500;
}

.questions-content {
  padding: 15px; /* 减少内边距 */
}

.question-item {
  display: flex;
  align-items: flex-start;
  gap: 12px; /* 减少间距 */
  padding: 10px 0; /* 减少上下内边距 */
  border-bottom: 1px solid #f0f0f0;
}

.question-item:last-child {
  border-bottom: none;
}

.question-number {
  width: 24px; /* 减少数字圆圈大小 */
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 12px; /* 减少数字字体大小 */
}

.question-text {
  flex: 1;
  line-height: 1.5; /* 减少行高 */
  color: #333;
  font-size: 14px; /* 减少问题字体大小 */
}

.tips-content {
  padding: 15px; /* 减少内边距 */
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px; /* 减少间距 */
  padding: 10px 0; /* 减少上下内边距 */
  border-bottom: 1px solid #f0f0f0;
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-icon {
  font-size: 20px; /* 减少图标大小 */
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 14px; /* 减少标题字体大小 */
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0; /* 减少标题底部间距 */
}

.tip-desc {
  font-size: 13px; /* 减少描述字体大小 */
  color: #666;
  line-height: 1.4; /* 减少行高 */
  margin: 0;
}

/* 行动区域样式 */
.action-section {
  text-align: center;
  margin-bottom: 25px; /* 减少底部间距 */
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px; /* 减少按钮间距 */
  margin-bottom: 12px; /* 减少底部间距 */
}

.start-interview-btn {
  padding: 16px 32px; /* 减少按钮内边距 */
  font-size: 18px; /* 减少按钮字体大小 */
  font-weight: 600;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); /* 减少阴影 */
  transition: all 0.3s ease;
}

.start-interview-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4); /* 减少悬停阴影 */
}

.start-interview-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.preview-btn {
  padding: 16px 32px; /* 减少按钮内边距 */
  font-size: 18px; /* 减少按钮字体大小 */
  font-weight: 600;
  border-radius: 50px;
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
  border: none;
  box-shadow: 0 8px 25px rgba(82, 196, 26, 0.3); /* 减少阴影 */
  transition: all 0.3s ease;
}

.preview-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(82, 196, 26, 0.4); /* 减少悬停阴影 */
}

.preview-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-hint {
  margin-top: 12px; /* 减少顶部间距 */
  color: #666;
  font-size: 13px; /* 减少提示字体大小 */
}

/* 设备检测样式 */
.device-check-section {
  margin-bottom: 25px; /* 减少底部间距 */
}

.device-check-card {
  background: #fff;
  border-radius: 12px; /* 减少圆角 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* 减少阴影 */
  overflow: hidden;
}

.check-header {
  background: #f8f9fa;
  padding: 15px; /* 减少内边距 */
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 8px; /* 减少间距 */
  font-size: 16px; /* 减少标题字体大小 */
  font-weight: 600;
  color: #333;
}

.check-content {
  padding: 15px; /* 减少内边距 */
  display: flex;
  gap: 25px; /* 减少间距 */
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px; /* 减少间距 */
  font-size: 14px; /* 减少字体大小 */
  color: #333;
}

.check-success {
  color: #52c41a;
}

.check-error {
  color: #ff4d4f;
}

.device-note {
  padding: 0 15px 15px; /* 减少内边距 */
  margin: 0;
  color: #666;
  font-size: 13px; /* 减少字体大小 */
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 15px; /* 移除顶部内边距，因为现在有全局导航栏 */
  }
  
  .main-title {
    font-size: 28px; /* 进一步减少小屏幕标题大小 */
  }
  
  .subtitle {
    font-size: 14px; /* 进一步减少小屏幕副标题大小 */
  }
  
  .config-form {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 15px; /* 减少小屏幕下的间距 */
  }

  .preparation-grid {
    grid-template-columns: 1fr;
    gap: 15px; /* 减少小屏幕下的间距 */
  }
  
  .check-content {
    flex-direction: column;
    gap: 12px; /* 减少小屏幕下的间距 */
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 15px; /* 移除顶部内边距，因为现在有全局导航栏 */
  }
  
  .main-title {
    font-size: 24px; /* 进一步减少超小屏幕标题大小 */
  }
  
  .card-header {
    padding: 15px; /* 减少小屏幕下的内边距 */
  }
  
  .card-header h2 {
    font-size: 20px; /* 减少小屏幕下的标题大小 */
  }
  
  .config-form {
    padding: 15px; /* 减少小屏幕下的内边距 */
  }
}
</style> 