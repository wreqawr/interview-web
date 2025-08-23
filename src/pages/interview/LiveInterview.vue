<template>
  <div class="live-interview-page">
    <!-- 顶部状态栏 -->
    <div class="top-status-bar">
      <div class="status-left">
        <div class="progress-info">
          <span class="progress-text">题目 {{ currentQuestionIndex }}/{{ totalQuestions }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>
      
      <div class="status-center">
        <div class="timer">
          <el-icon><Clock /></el-icon>
          <span class="time-display">{{ currentTime }}</span>
        </div>
      </div>
      
      <div class="status-right">
        <div class="connection-status">
          <div class="status-indicator" :class="{ connected: isConnected }"></div>
          <span class="status-text">{{ isConnected ? '稳定连接' : '连接中...' }}</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左栏 - AI面试官 -->
      <div class="left-column">
        <div class="ai-interviewer-section">
          <div class="interviewer-header">
            <h2>AI面试官</h2>
            <div class="interviewer-status" :class="aiStatus">
              {{ aiStatusText }}
            </div>
          </div>
          
          <div class="interviewer-video">
            <div class="ai-avatar" :class="{ speaking: aiStatus === 'speaking' }">
              <span class="avatar-emoji">{{ currentInterviewer.avatar }}</span>
              <div v-if="aiStatus === 'speaking'" class="speaking-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            
            <div class="interviewer-info">
              <h3 class="interviewer-name">{{ currentInterviewer.name }}</h3>
              <p class="interviewer-style">{{ currentInterviewer.style }}</p>
            </div>
          </div>
          
          <div class="current-question">
            <h4>当前问题</h4>
            <div class="question-content">
              {{ currentQuestion }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 - 实时字幕和控制 -->
      <div class="right-column">
        <!-- 实时字幕区域 -->
        <div class="transcript-section">
          <div class="transcript-header">
            <h3>实时对话</h3>
            <div class="transcript-controls">
              <el-button size="small" @click="toggleTranscript" :type="transcriptVisible ? 'primary' : 'default'">
                {{ transcriptVisible ? '隐藏' : '显示' }}字幕
              </el-button>
            </div>
          </div>
          
          <div v-if="transcriptVisible" class="transcript-content">
            <!-- AI说话区域 -->
            <div class="transcript-ai">
              <div class="transcript-label">
                <el-icon><UserFilled /></el-icon>
                AI面试官
              </div>
              <div class="transcript-text" v-html="aiTranscript"></div>
            </div>
            
            <!-- 用户说话区域 -->
            <div class="transcript-user">
              <div class="transcript-label">
                <el-icon><User /></el-icon>
                我的回答
              </div>
              <div class="transcript-text" v-html="userTranscript"></div>
            </div>
          </div>
        </div>

        <!-- 用户视频流 -->
        <div class="user-video-section">
          <div class="video-header">
            <h3>我的画面</h3>
            <div class="video-controls">
              <el-button 
                size="small" 
                :type="isMuted ? 'danger' : 'success'"
                @click="toggleMute"
              >
                <el-icon><component :is="isMuted ? 'Microphone' : 'Microphone'" /></el-icon>
                {{ isMuted ? '已静音' : '正常' }}
              </el-button>
              <el-button 
                size="small" 
                :type="isVideoOff ? 'danger' : 'success'"
                @click="toggleVideo"
              >
                <el-icon><component :is="isVideoOff ? 'VideoCamera' : 'VideoCamera'" /></el-icon>
                {{ isVideoOff ? '已关闭' : '正常' }}
              </el-button>
            </div>
          </div>
          
          <div class="user-video-container">
            <video 
              ref="userVideo" 
              class="user-video" 
              autoplay 
              muted
              :class="{ 'video-off': isVideoOff }"
            ></video>
            <div v-if="isVideoOff" class="video-placeholder">
              <el-icon><VideoCamera /></el-icon>
              <span>摄像头已关闭</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="control-bar">
      <div class="control-left">
        <!-- 主要操作按钮 -->
        <el-button 
          class="control-btn"
          :type="isMuted ? 'danger' : 'success'"
          @click="toggleMute"
        >
          <el-icon><component :is="isMuted ? 'Microphone' : 'Microphone'" /></el-icon>
          {{ isMuted ? '开启麦克风' : '静音' }}
        </el-button>
        
        <el-button 
          class="control-btn"
          :type="isVideoOff ? 'danger' : 'success'"
          @click="toggleVideo"
        >
          <el-icon><component :is="isVideoOff ? 'VideoCamera' : 'VideoCamera'" /></el-icon>
          {{ isVideoOff ? '开启摄像头' : '关闭摄像头' }}
        </el-button>
      </div>
      
      <div class="control-center">
        <el-button 
          class="control-btn repeat-btn"
          @click="repeatQuestion"
        >
          <el-icon><Refresh /></el-icon>
          重复问题
        </el-button>
        
        <el-button 
          class="control-btn pause-btn"
          @click="togglePause"
        >
          <el-icon><component :is="isPaused ? 'VideoPlay' : 'VideoPause'" /></el-icon>
          {{ isPaused ? '继续' : '暂停' }}
        </el-button>
        
        <el-button 
          class="control-btn skip-btn"
          @click="skipQuestion"
        >
          <el-icon><ArrowRight /></el-icon>
          跳过
        </el-button>
      </div>
      
      <div class="control-right">
        <el-button 
          type="info" 
          size="large"
          class="view-results-btn"
          @click="viewResults"
        >
          <el-icon><View /></el-icon>
          查看结果
        </el-button>
        
        <el-button 
          type="danger" 
          size="large"
          class="end-interview-btn"
          @click="endInterview"
        >
          <el-icon><VideoPlay /></el-icon>
          结束面试
        </el-button>
      </div>
    </div>

    <!-- 跳过确认对话框 -->
    <el-dialog
      v-model="skipDialogVisible"
      title="确认跳过"
      width="400px"
      center
    >
      <div class="skip-dialog-content">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <p>确定要跳过当前问题吗？</p>
        <p class="skip-warning">跳过后无法返回，可能会影响最终评分</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="skipDialogVisible = false">取消</el-button>
          <el-button type="warning" @click="confirmSkip">确认跳过</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 结束面试确认对话框 -->
    <el-dialog
      v-model="endDialogVisible"
      title="确认结束面试"
      width="400px"
      center
    >
      <div class="end-dialog-content">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <p>确定要结束本次面试吗？</p>
        <p class="end-warning">结束后将进入结果分析页面</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="endDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmEnd">确认结束</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {
  ArrowRight,
  Clock,
  Refresh,
  User,
  UserFilled,
  VideoCamera,
  VideoPlay,
  View,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 面试状态
const isConnected = ref(true)
const isPaused = ref(false)
const isMuted = ref(false)
const isVideoOff = ref(false)
const transcriptVisible = ref(true)

// 面试进度
const currentQuestionIndex = ref(1)
const totalQuestions = ref(10)
const currentTime = ref('00:00')
const aiStatus = ref('listening') // listening, speaking, waiting

// 对话框状态
const skipDialogVisible = ref(false)
const endDialogVisible = ref(false)

// 视频元素引用
const userVideo = ref(null)

// 面试配置
const interviewConfig = ref({})
const currentInterviewer = ref({
  name: 'Sarah Chen',
  avatar: '👩‍💼',
  style: '专业型'
})

// 当前问题
const currentQuestion = ref('请简单介绍一下你自己，包括你的教育背景和工作经验。')

// 实时字幕
const aiTranscript = ref('请简单介绍一下你自己，包括你的教育背景和工作经验。')
const userTranscript = ref('我正在思考如何回答这个问题...')

// 计算属性
const progressPercentage = computed(() => {
  return (currentQuestionIndex.value / totalQuestions.value) * 100
})

const aiStatusText = computed(() => {
  const statusMap = {
    listening: '正在倾听',
    speaking: '正在提问',
    waiting: '等待回答'
  }
  return statusMap[aiStatus.value]
})

// 计时器
let timer = null
let startTime = Date.now()

// 开始计时
const startTimer = () => {
  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    currentTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

// 停止计时
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 切换静音
const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (userVideo.value) {
    userVideo.value.muted = isMuted.value
  }
  ElMessage.success(isMuted.value ? '已静音' : '已取消静音')
}

// 切换视频
const toggleVideo = () => {
  isVideoOff.value = !isVideoOff.value
  ElMessage.success(isVideoOff.value ? '已关闭摄像头' : '已开启摄像头')
}

// 切换字幕显示
const toggleTranscript = () => {
  transcriptVisible.value = !transcriptVisible.value
}

// 重复问题
const repeatQuestion = () => {
  aiStatus.value = 'speaking'
  ElMessage.success('正在重复问题...')
  
  // 模拟AI重复问题
  setTimeout(() => {
    aiStatus.value = 'listening'
  }, 2000)
}

// 切换暂停
const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopTimer()
    ElMessage.info('面试已暂停')
  } else {
    startTimer()
    ElMessage.success('面试已继续')
  }
}

// 跳过问题
const skipQuestion = () => {
  skipDialogVisible.value = true
}

// 确认跳过
const confirmSkip = () => {
  skipDialogVisible.value = false
  currentQuestionIndex.value++
  
  if (currentQuestionIndex.value > totalQuestions.value) {
    ElMessage.success('所有问题已完成！')
    endInterview()
  } else {
    // 生成新问题
    generateNewQuestion()
    ElMessage.warning('问题已跳过')
  }
}

// 结束面试
const endInterview = () => {
  endDialogVisible.value = true
}

// 确认结束
const confirmEnd = () => {
  endDialogVisible.value = false
  stopTimer()
  
  // 跳转到结果页面
  router.push({
    path: '/interview/results',
    query: { 
      config: JSON.stringify(interviewConfig.value),
      duration: currentTime.value,
      questionsAnswered: currentQuestionIndex.value
    }
  })
}

// 生成新问题
const generateNewQuestion = () => {
  const questions = [
    '请描述一个你遇到的技术难题，以及你是如何解决的？',
    '在团队协作中，你是如何处理意见分歧的？',
    '请分享一个你最近学习的技能或技术，以及学习过程中的收获？',
    '如果项目延期了，你会如何向领导解释？',
    '你认为自己的优势和劣势是什么？',
    '请谈谈你对这个岗位的理解，以及为什么选择我们公司？',
    '如果让你重新设计一个系统，你会考虑哪些方面？',
    '请描述一个你参与过的项目，你在其中扮演什么角色？',
    '遇到技术问题时，你的解决思路是什么？',
    '你有什么问题想问我们的吗？'
  ]
  
  currentQuestion.value = questions[currentQuestionIndex.value - 1] || '请继续回答下一个问题。'
  aiTranscript.value = currentQuestion.value
  userTranscript.value = ''
  
  // 模拟AI提问状态
  aiStatus.value = 'speaking'
  setTimeout(() => {
    aiStatus.value = 'listening'
  }, 1500)
}

// 查看结果
const viewResults = () => {
  router.push({
    path: '/interview/results',
    query: { 
      config: JSON.stringify(interviewConfig.value),
      duration: currentTime.value,
      questionsAnswered: currentQuestionIndex.value
    }
  })
}

// 初始化摄像头
const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    })
    
    if (userVideo.value) {
      userVideo.value.srcObject = stream
    }
    
    ElMessage.success('摄像头初始化成功')
  } catch (error) {
    console.error('摄像头初始化失败:', error)
    ElMessage.error('摄像头初始化失败，请检查设备权限')
  }
}

// 模拟用户回答
const simulateUserAnswer = () => {
  const answers = [
    '我认为这个问题可以从以下几个方面来回答...',
    '根据我的经验，我建议采用以下方法...',
    '让我用一个具体的例子来说明...',
    '这个问题确实很有挑战性，我的思路是...'
  ]

  userTranscript.value = answers[Math.floor(Math.random() * answers.length)]
}

// 页面加载时初始化
onMounted(async () => {
  // 解析路由参数
  try {
    if (route.query.config) {
      interviewConfig.value = JSON.parse(route.query.config)
    }
  } catch (error) {
    console.error('解析配置参数失败:', error)
  }
  
  // 初始化摄像头
  await initCamera()
  
  // 开始计时
  startTimer()
  
  // 模拟面试流程
  setTimeout(() => {
    aiStatus.value = 'speaking'
    setTimeout(() => {
      aiStatus.value = 'listening'
    }, 2000)
  }, 1000)
  
  // 定期模拟用户回答
  setInterval(() => {
    if (aiStatus.value === 'listening' && !isPaused.value) {
      simulateUserAnswer()
    }
  }, 8000)
})

// 页面卸载时清理
onBeforeUnmount(() => {
  stopTimer()
  
  // 停止摄像头流
  if (userVideo.value && userVideo.value.srcObject) {
    const tracks = userVideo.value.srcObject.getTracks()
    tracks.forEach(track => track.stop())
  }
})
</script> 

<style scoped>
.live-interview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f1419;
  color: #fff;
  overflow: hidden;
}

/* 顶部状态栏样式 */
.top-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.status-left .progress-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.status-center .timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.time-display {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.status-right .connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d4f;
  animation: pulse 2s infinite;
}

.status-indicator.connected {
  background: #52c41a;
}

.status-text {
  font-size: 14px;
  color: #a0a0a0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

/* 左栏样式 */
.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-interviewer-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.interviewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interviewer-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.interviewer-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.interviewer-status.speaking {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.interviewer-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.ai-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.ai-avatar.speaking {
  border-color: #409eff;
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.3);
}

.avatar-emoji {
  font-size: 60px;
}

.speaking-animation {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.speaking-animation span {
  width: 6px;
  height: 6px;
  background: #409eff;
  border-radius: 50%;
  animation: speaking-wave 1.4s infinite ease-in-out;
}

.speaking-animation span:nth-child(1) { animation-delay: -0.32s; }
.speaking-animation span:nth-child(2) { animation-delay: -0.16s; }
.speaking-animation span:nth-child(3) { animation-delay: 0s; }

@keyframes speaking-wave {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.interviewer-info {
  text-align: center;
}

.interviewer-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 5px 0;
}

.interviewer-style {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.current-question {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.current-question h4 {
  font-size: 16px;
  font-weight: 600;
  color: #a0a0a0;
  margin: 0 0 15px 0;
}

.question-content {
  font-size: 16px;
  line-height: 1.6;
  color: #fff;
}

/* 右栏样式 */
.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transcript-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  flex: 1;
}

.transcript-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.transcript-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.transcript-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transcript-ai, .transcript-user {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.transcript-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #a0a0a0;
  margin-bottom: 10px;
}

.transcript-text {
  font-size: 15px;
  line-height: 1.6;
  color: #fff;
}

.user-video-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.video-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.video-controls {
  display: flex;
  gap: 10px;
}

.user-video-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.user-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.user-video.video-off {
  opacity: 0.3;
}

.video-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #a0a0a0;
  font-size: 14px;
}

/* 底部控制栏样式 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.control-left, .control-center, .control-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.repeat-btn {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.pause-btn {
  background: rgba(250, 173, 20, 0.2);
  color: #faad14;
  border: 1px solid rgba(250, 173, 20, 0.3);
}

.skip-btn {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.3);
}

.view-results-btn {
  background: rgba(100, 149, 237, 0.2);
  color: #6495ed;
  border: 1px solid rgba(100, 149, 237, 0.3);
}

.end-interview-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(255, 77, 79, 0.3);
  transition: all 0.3s ease;
}

.end-interview-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 77, 79, 0.4);
}

/* 对话框样式 */
.skip-dialog-content, .end-dialog-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 15px;
}

.skip-dialog-content p, .end-dialog-content p {
  margin: 10px 0;
  color: #333;
}

.skip-warning, .end-warning {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.dialog-footer {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-column, .right-column {
    flex: none;
  }
  
  .ai-interviewer-section {
    height: auto;
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .top-status-bar {
    padding: 15px 20px;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .control-bar {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }
  
  .control-left, .control-center, .control-right {
    justify-content: center;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .ai-avatar {
    width: 100px;
    height: 100px;
  }
  
  .avatar-emoji {
    font-size: 50px;
  }
}

@media (max-width: 480px) {
  .top-status-bar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .status-left, .status-center, .status-right {
    width: 100%;
    text-align: center;
  }
  
  .progress-bar {
    width: 100%;
  }
  
  .ai-interviewer-section {
    padding: 20px;
  }
  
  .transcript-section, .user-video-section {
    padding: 15px;
  }
  
  .control-btn {
    padding: 10px 15px;
    font-size: 14px;
  }
}
</style> 