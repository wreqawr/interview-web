<template>
  <div class="mock-interview-page">
    <!-- 沉浸式顶部栏 -->
    <div class="immersive-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-left">
          <div class="interview-status">
            <div class="status-indicator" :class="{ active: isRunning }"></div>
            <h1 class="title">{{ isRunning ? '面试进行中' : 'AI模拟面试' }}</h1>
            <el-tag v-if="!isRunning" type="warning" effect="dark" size="small">准备就绪</el-tag>
            <el-tag v-else type="success" effect="dark" size="small">进行中</el-tag>
          </div>
        </div>
        
        <div class="header-center">
          <div class="interview-config">
            <el-select
                v-model="context.resumeId"
                placeholder="选择简历"
                size="large"
                class="config-select"
                @change="handleResumeChange"
            >
              <el-option
                  v-for="resume in resumeOptions"
                  :key="resume.value"
                  :label="resume.label"
                  :value="resume.value"
              />
            </el-select>
            <el-select 
                v-model="context.jobId" 
                placeholder="选择岗位" 
                size="large" 
                class="config-select"
            >
              <el-option v-for="j in jobOptions" :key="j.value" :label="j.label" :value="j.value"/>
            </el-select>
          </div>
        </div>
        
        <div class="header-right">
          <div class="interview-controls">
            <el-button 
                type="success" 
                size="large" 
                :disabled="isRunning || !canStart" 
                @click="handleStart"
                class="control-btn start-btn"
            >
              <el-icon><VideoPlay /></el-icon>
              开始面试
            </el-button>
            <el-button 
                v-if="isRunning"
                type="warning" 
                size="large" 
                @click="handlePause"
                class="control-btn pause-btn"
            >
              <el-icon><VideoPause /></el-icon>
              暂停
            </el-button>
            <el-button 
                v-if="messages.length > 0"
                type="danger" 
                size="large" 
                @click="handleEnd"
                class="control-btn end-btn"
            >
              <el-icon><VideoPlay /></el-icon>
              结束面试
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧信息面板 -->
      <div class="left-panel">
        <!-- 简历概览卡片 -->
        <div class="info-card resume-card">
          <div class="card-header">
            <div class="card-icon">📄</div>
            <h3>简历概览</h3>
          </div>
          <div v-if="loading" class="loading-state">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="!currentResume" class="empty-state">
            <el-empty description="请先选择简历" :image-size="60" />
          </div>
          <div v-else class="resume-content">
            <div class="resume-header">
              <h4 class="resume-title">{{ currentResume.title }}</h4>
              <div class="match-score">
                <span class="score-label">匹配度</span>
                <div class="score-circle">
                  <span class="score-value">82</span>
                  <span class="score-unit">%</span>
                </div>
              </div>
            </div>
            <div class="resume-details">
              <div class="detail-item">
                <span class="detail-label">格式</span>
                <span class="detail-value">{{ currentResume.format }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">大小</span>
                <span class="detail-value">{{ currentResume.size }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间</span>
                <span class="detail-value">{{ currentResume.createTime.split(' ')[0] }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">评分</span>
                <el-rate
                    v-model="currentResume.score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                    size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 岗位要求卡片 -->
        <div class="info-card job-card">
          <div class="card-header">
            <div class="card-icon">💼</div>
            <h3>岗位要求</h3>
          </div>
          <div class="job-content">
            <h4 class="job-title">{{ currentJob?.label || '未选择岗位' }}</h4>
            <div class="job-tags">
              <el-tag 
                  v-for="keyword in jobKeywords" 
                  :key="keyword" 
                  size="small" 
                  class="skill-tag"
              >
                {{ keyword }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 面试技巧卡片 -->
        <div class="info-card tips-card">
          <div class="card-header">
            <div class="card-icon">💡</div>
            <h3>面试技巧</h3>
          </div>
          <div class="tips-content">
            <div class="tip-item" v-for="(tip, index) in interviewTips" :key="index">
              <div class="tip-number">{{ index + 1 }}</div>
              <div class="tip-text">{{ tip }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央面试对话区 -->
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-title">
            <span class="title-icon">🎯</span>
            AI面试官
          </div>
          <div class="chat-stats">
            <span class="stat-item">
              <el-icon><Clock /></el-icon>
              {{ interviewDuration }}
            </span>
            <span class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              {{ messages.length }} 轮对话
            </span>
          </div>
        </div>

        <div class="chat-container" ref="chatRef">
          <div v-for="(msg, idx) in messages" :key="idx" class="chat-message" :class="msg.role">
            <div class="message-avatar">
              <div class="avatar-content" :class="msg.role">
                <span v-if="msg.role === 'ai'">🤖</span>
                <span v-else>👤</span>
              </div>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="speaker-name">{{ msg.role === 'ai' ? 'AI面试官' : '我' }}</span>
                <span class="message-time">{{ msg.time }}</span>
              </div>
              <div class="message-bubble" v-html="msg.html"></div>
              <div v-if="msg.role === 'ai' && msg.hint" class="message-hint">
                <el-icon><Light /></el-icon>
                <span>考察点：{{ msg.hint }}</span>
              </div>
            </div>
          </div>
          
          <!-- 输入提示 -->
          <div v-if="isRunning" class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="typing-text">AI面试官正在思考下一个问题...</span>
          </div>
        </div>

        <!-- 智能输入区域 -->
        <div class="input-area">
          <div class="quick-tools">
            <el-button 
                v-for="tool in quickTools" 
                :key="tool.key"
                size="small" 
                @click="insertTemplate(tool.template)"
                class="tool-btn"
            >
              <el-icon><component :is="tool.icon" /></el-icon>
              {{ tool.label }}
            </el-button>
          </div>
          
          <div class="input-container">
            <el-input
                v-model="inputText"
                type="textarea"
                :rows="4"
                placeholder="请输入你的回答，或使用上方快捷工具..."
                class="answer-input"
                @keydown.enter.exact.prevent="handleSend"
            />
            <div class="input-actions">
              <div class="input-options">
                <el-checkbox v-model="options.instantFeedback" label="即时反馈" size="small"/>
                <el-checkbox v-model="options.voiceInput" label="语音输入" size="small"/>
              </div>
              <el-button 
                  type="primary" 
                  size="large" 
                  :disabled="!canSend" 
                  @click="handleSend"
                  class="send-btn"
              >
                <el-icon><Promotion /></el-icon>
                发送回答
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧进度面板 -->
      <div class="right-panel">
        <!-- 面试进度 -->
        <div class="info-card progress-card">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <h3>面试进度</h3>
          </div>
          <div class="progress-content">
            <el-steps direction="vertical" :active="activeStep" finish-status="success" class="interview-steps">
              <el-step 
                  v-for="step in interviewSteps" 
                  :key="step.key"
                  :title="step.title" 
                  :description="step.description"
                  :icon="step.icon"
              />
            </el-steps>
          </div>
        </div>

        <!-- 实时评分 -->
        <div class="info-card score-card">
          <div class="card-header">
            <div class="card-icon">⭐</div>
            <h3>实时评分</h3>
          </div>
          <div class="score-content">
            <div class="score-item" v-for="score in realtimeScores" :key="score.key">
              <div class="score-label">{{ score.label }}</div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: score.value + '%', background: score.color }"></div>
              </div>
              <div class="score-value">{{ score.value }}%</div>
            </div>
          </div>
        </div>

        <!-- 面试建议 -->
        <div class="info-card advice-card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <h3>面试建议</h3>
          </div>
          <div class="advice-content">
            <div class="advice-item" v-for="(advice, index) in currentAdvice" :key="index">
              <div class="advice-icon">💡</div>
              <div class="advice-text">{{ advice }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {VideoPlay, VideoPause, Clock, ChatDotRound, Light, Promotion} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import {getResumeList} from '@/api/resume'
// 导入SVG图标以解决404错误
// import resumeVersionIcon from '@/assets/resume/resume-version.svg'
// import interviewCountIcon from '@/assets/interview/interview-count.svg'
// import comprehensiveScoreIcon from '@/assets/other/comprehensive-score.svg'
// import getOfferIcon from '@/assets/other/get-offer.svg'

const context = ref({
  resumeId: null,
  jobId: null
})

// 简历相关状态
const loading = ref(false)
const resumes = ref([])
const resumeOptions = ref([])

const jobOptions = ref([
  {label: '前端开发工程师', value: 'j1'},
  {label: '全栈工程师', value: 'j2'},
  {label: '后端开发工程师', value: 'j3'},
  {label: '产品经理', value: 'j4'}
])

const isRunning = ref(false)
const canStart = computed(() => context.value.resumeId && context.value.jobId)

const jobKeywords = ['Vue3', 'TypeScript', '组件化', '性能优化', '工程化']

const activeStep = ref(1)

// 面试步骤配置
const interviewSteps = ref([
  {key: 'opening', title: '开场', description: '寒暄与背景', icon: 'ChatDotRound'},
  {key: 'resume', title: '简历导向', description: '经历与项目', icon: 'Document'},
  {key: 'technical', title: '技术深挖', description: '知识与能力', icon: 'Cpu'},
  {key: 'behavioral', title: '行为面试', description: '沟通与协作', icon: 'User'},
  {key: 'closing', title: '收尾', description: '反问与总结', icon: 'Flag'}
])

// 实时评分数据
const realtimeScores = ref([
  {key: 'technical', label: '技术能力', value: 85, color: '#409eff'},
  {key: 'communication', label: '沟通表达', value: 78, color: '#67c23a'},
  {key: 'problem_solving', label: '问题解决', value: 82, color: '#e6a23c'},
  {key: 'teamwork', label: '团队协作', value: 75, color: '#f56c6c'}
])

// 面试建议
const currentAdvice = ref([
  '回答技术问题时优先给出结论，再给依据',
  '结合 STAR 法则组织你的项目经历',
  '善用数据来量化你的成果与影响',
  '保持自信，语速适中，表达清晰'
])

// 面试技巧
const interviewTips = ref([
  '准备3-5个具体的项目案例，用STAR法则描述',
  '技术问题先说思路，再写代码，最后优化',
  '遇到不会的问题，诚实承认并表达学习意愿',
  '准备2-3个有深度的问题反问面试官'
])

// 快捷工具
const quickTools = ref([
  {key: 'star', label: 'STAR模板', template: 'STAR 模板：情境-任务-行动-结果', icon: 'Document'},
  {key: 'example', label: '请求举例', template: '请给出一个具体案例进行说明', icon: 'Light'},
  {key: 'hint', label: '请求提示', template: '可否提示关键点？', icon: 'QuestionFilled'},
  {key: 'clarify', label: '澄清问题', template: '我想确认一下这个问题的具体含义', icon: 'ChatDotRound'}
])

const messages = ref([
  {
    role: 'ai',
    time: dayjs().format('HH:mm:ss'),
    html: '你好，我是本次的AI面试官。在开始之前，请简单介绍一下你自己与最近的一份项目经历。',
    hint: '沟通表达 / 总结能力 / 近因效应'
  }
])

const inputText = ref('')
const options = ref({
  instantFeedback: true,
  voiceInput: false
})

const canSend = computed(() => !!inputText.value.trim() && isRunning.value)
const chatRef = ref(null)

// 面试时长计算
const interviewDuration = computed(() => {
  if (messages.value.length <= 1) return '00:00'
  const startTime = dayjs(messages.value[0].time, 'HH:mm:ss')
  const currentTime = dayjs()
  const diff = currentTime.diff(startTime, 'minute')
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

const currentResume = computed(() => resumes.value.find(r => r.id === context.value.resumeId))
const currentJob = computed(() => jobOptions.value.find(j => j.value === context.value.jobId))

// 获取简历列表
const fetchResumeList = async () => {
  try {
    loading.value = true
    const response = await getResumeList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换简历数据格式
      resumes.value = data.data.map((resume) => {
        // 格式化文件大小：将字节转换为MB
        const formatFileSize = (bytes) => {
          const mb = bytes / (1024 * 1024)
          return `${mb.toFixed(1)}MB`
        }

        // 格式化文件类型
        const formatMimeType = (mimeType) => {
          const typeMap = {
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
          }
          return typeMap[mimeType] || mimeType
        }

        // 格式化时间：YYYY-MM-DD hh:mm:ss
        const formatDateTime = (dateTimeStr) => {
          const date = new Date(dateTimeStr)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        return {
          id: resume.resumeId,
          title: resume.resumeTitle || '未命名简历',
          format: formatMimeType(resume.mimeType),
          size: formatFileSize(resume.fileSize),
          createTime: formatDateTime(resume.createdAt),
          updateTime: formatDateTime(resume.updatedAt),
          score: resume.rate || 0,
          originalData: resume
        }
      })

      // 生成简历选项
      resumeOptions.value = resumes.value.map(resume => ({
        label: `${resume.title}（${resume.createTime.split(' ')[0]}）`,
        value: resume.id
      }))

      // 默认选择第一个简历
      if (resumes.value.length > 0 && !context.value.resumeId) {
        context.value.resumeId = resumes.value[0].id
      }
    } else {
      ElMessage.error(data.message || '获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取简历列表失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 处理简历选择变化
const handleResumeChange = (resumeId) => {
  if (resumeId) {
    ElMessage.success(`已选择简历：${currentResume.value?.title}`)
  }
}

const insertTemplate = (tpl) => {
  inputText.value = inputText.value ? inputText.value + '\n' + tpl : tpl
}

const handleStart = () => {
  if (!context.value.resumeId || !context.value.jobId) {
    ElMessage.warning('请先选择简历与岗位')
    return
  }
  isRunning.value = true
  ElMessage.success('面试开始！请认真回答AI面试官的问题')
  
  // 更新面试进度
  activeStep.value = 1
}

const handlePause = () => {
  isRunning.value = false
  ElMessage.info('面试已暂停，可以继续或结束')
}

const handleEnd = () => {
  isRunning.value = false
  ElMessage.success('面试结束！请查看您的表现评估')
  
  // 更新面试进度到完成
  activeStep.value = 5
}

const handleSend = async () => {
  if (!canSend.value) return
  const text = inputText.value.trim()
  inputText.value = ''
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    time: dayjs().format('HH:mm:ss'),
    html: text
  })
  
  await nextTick()
  scrollToBottom()

  // 模拟AI响应
  setTimeout(async () => {
    const aiResponse = generateAIResponse(text)
    messages.value.push({
      role: 'ai',
      time: dayjs().format('HH:mm:ss'),
      html: aiResponse.content,
      hint: aiResponse.hint
    })
    
    // 更新面试进度
    if (messages.value.length > 3) {
      activeStep.value = Math.min(5, Math.floor(messages.value.length / 2) + 1)
    }
    
    // 更新实时评分
    updateRealtimeScores()
    
    await nextTick()
    scrollToBottom()
  }, 800)
}

// 生成AI响应
const generateAIResponse = (userInput) => {
  const responses = [
    {
      content: `你提到"${userInput.slice(0, 20)}..."。请进一步说明你的具体角色与贡献？`,
      hint: '项目拆解 / 角色澄清 / 结果量化'
    },
    {
      content: '这个项目遇到了哪些技术挑战？你是如何解决的？',
      hint: '问题分析 / 解决方案 / 技术深度'
    },
    {
      content: '如果让你重新设计这个系统，你会做哪些改进？',
      hint: '系统思维 / 优化能力 / 前瞻性思考'
    },
    {
      content: '在团队协作中，你是如何处理意见分歧的？',
      hint: '沟通技巧 / 冲突处理 / 团队合作'
    }
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// 更新实时评分
const updateRealtimeScores = () => {
  realtimeScores.value.forEach(score => {
    // 模拟评分变化
    const change = Math.floor(Math.random() * 6) - 3 // -3 到 +3
    score.value = Math.max(0, Math.min(100, score.value + change))
  })
}

const scrollToBottom = () => {
  const el = chatRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

// 页面加载时获取简历列表
onMounted(() => {
  fetchResumeList()
})
</script>

<style scoped>
.mock-interview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

/* 沉浸式顶部栏样式 */
.immersive-header {
  position: relative;
  height: 200px; /* Adjust as needed */
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: -1;
}

.header-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.interview-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #67c23a; /* Green for active */
}

.status-indicator.active {
  background-color: #f56c6c; /* Red for inactive */
}

.header-left .title {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-center {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.interview-config .config-select {
  width: 300px;
}

.header-right {
  display: flex;
  justify-content: center;
}

.interview-controls {
  display: flex;
  gap: 15px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.control-btn:hover {
  opacity: 0.9;
}

.control-btn.start-btn {
  background-color: #67c23a;
  color: #fff;
}

.control-btn.pause-btn {
  background-color: #e6a23c;
  color: #fff;
}

.control-btn.end-btn {
  background-color: #f56c6c;
  color: #fff;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 350px; /* Increased width */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 中间聊天面板 */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 右侧面板 */
.right-panel {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 信息卡片样式 */
.info-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.card-icon {
  font-size: 24px;
  color: #409eff;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.loading-state, .empty-state {
  padding: 20px;
  text-align: center;
}

.resume-content, .job-content, .tips-content {
  padding: 20px;
}

.resume-title, .job-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 10px;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #606266;
}

.score-circle {
  display: flex;
  align-items: baseline;
  background-color: #fff3cd;
  border-radius: 15px;
  padding: 4px 10px;
  border: 1px solid #ffe58f;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #faad14;
}

.score-unit {
  font-size: 14px;
  color: #faad14;
}

.resume-details, .job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.detail-item, .skill-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.detail-label {
  font-weight: 500;
  color: #909399;
}

.skill-tag {
  background-color: #e1f3d8;
  color: #67c23a;
  border: 1px solid #d9f7be;
  border-radius: 6px;
  padding: 4px 10px;
}

.tips-content .tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
}

.tip-number {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  min-width: 25px;
}

.tip-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
}

/* 聊天区域样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.chat-title .title-icon {
  font-size: 24px;
  color: #409eff;
}

.chat-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #909399;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.chat-message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
}

.message-avatar .avatar-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 14px;
  color: #909399;
}

.speaker-name {
  font-weight: 600;
  color: #303133;
}

.message-bubble {
  background: #ecf5ff; /* Light blue for user messages */
  border-radius: 10px;
  padding: 10px 12px;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #d9ecff;
  font-size: 15px;
  line-height: 1.6;
  color: #303133;
}

.chat-message.user .message-bubble {
  background: #ecf5ff;
  border-color: #d9ecff;
}

.message-hint {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

/* 输入提示样式 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #f0f9eb; /* Light green background */
  border: 1px solid #e1f3d8;
  border-radius: 8px;
  margin-top: 15px;
  font-size: 14px;
  color: #67c23a;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #67c23a;
  border-radius: 50%;
  animation: typing-animation 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typing-animation {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* 智能输入区域样式 */
.input-area {
  border-top: 1px solid #e5e7eb;
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background-color: #e1f3d8;
  border-color: #d9f7be;
  color: #52c41a;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.8;
  resize: none;
  transition: all 0.3s ease;
}

.answer-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px #c6e2ff;
  outline: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.input-options {
  display: flex;
  gap: 15px;
  align-items: center;
}

.send-btn {
  flex-shrink: 0;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #409eff;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.send-btn:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.send-btn:disabled {
  background-color: #a0c4ff;
  cursor: not-allowed;
  box-shadow: none;
}

/* 面试进度样式 */
.progress-card .interview-steps {
  padding: 0 15px;
}

/* 实时评分样式 */
.score-card .score-content {
  padding: 15px 20px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.score-bar {
  width: 100%;
  height: 8px;
  background-color: #ebeef5;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}

.score-value {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

/* 面试建议样式 */
.advice-card .advice-content {
  padding: 15px 20px;
}

.advice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.advice-icon {
  font-size: 20px;
  color: #409eff;
}

.advice-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .right-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .immersive-header {
    height: auto;
    padding: 100px 20px 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .header-left, .header-center, .header-right {
    width: 100%;
    text-align: center;
  }

  .interview-config {
    flex-direction: column;
    gap: 15px;
  }

  .config-select {
    width: 100%;
  }

  .interview-controls {
    flex-direction: column;
    gap: 10px;
  }

  .control-btn {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    flex-direction: column;
    padding: 16px;
  }

  .left-panel, .right-panel {
    width: 100%;
  }

  .chat-panel {
    order: -1; /* Bring chat to top */
  }
}
</style> 