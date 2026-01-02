<template>
  <div class="voice-interview-page">
    <!-- 顶部状态栏 -->
    <div class="top-status-bar">
      <div class="status-left">
        <el-button
            text
            @click="handleExit"
            class="exit-btn"
        >
          <el-icon>
            <ArrowLeft/>
          </el-icon>
          <span>退出面试</span>
        </el-button>
      </div>

      <div class="status-center">
        <div class="timer">
          <el-icon>
            <Clock/>
          </el-icon>
          <span class="time-display">{{ formatTime(interviewTime) }}</span>
        </div>
      </div>

      <div class="status-right">
        <div class="connection-status">
          <div class="status-indicator" :class="{ connected: isConnected }"></div>
          <span class="status-text">{{ statusText }}</span>
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
            <div class="interviewer-status" :class="aiStatusClass">
              {{ aiStatusText }}
            </div>
          </div>

          <!-- AI面试官居中显示 -->
          <div class="interviewer-center">
            <div class="interviewer-avatar">
              <VoiceAvatar :controller="controller"/>
              <div class="interviewer-info">
                <h3 class="interviewer-name">{{ interviewerName }}</h3>
                <p class="interviewer-style">专业型面试官</p>
              </div>
            </div>

            <!-- 当前问题 -->
            <div class="current-question" v-if="currentQuestion">
              <h4>当前问题</h4>
              <div class="question-content">
                {{ currentQuestion }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 - 控制面板 -->
      <div class="right-column">
        <!-- 面试进度 -->
        <div class="control-panel">
          <div class="panel-header">
            <h3>面试控制</h3>
          </div>
          <div class="panel-content">
            <!-- 连接状态 -->
            <div class="panel-section">
              <h4>连接状态</h4>
              <div class="status-card" :class="callState">
                <div class="status-icon">
                  <div class="status-dot" :class="{ connected: isConnected }"></div>
                </div>
                <div class="status-info">
                  <div class="status-title">{{ statusText }}</div>
                  <div class="status-desc" v-if="isConnected">语音通话已建立</div>
                  <div class="status-desc" v-else>正在建立连接...</div>
                </div>
              </div>
            </div>

            <!-- 错误提示 -->
            <div class="panel-section" v-if="callState === 'Error'">
              <div class="error-card">
                <el-icon class="error-icon">
                  <Warning/>
                </el-icon>
                <div class="error-message">{{ callErrorMessage || '连接失败' }}</div>
                <el-button type="primary" size="small" @click="handleRetry">重试连接</el-button>
              </div>
            </div>

            <!-- 连接中提示 -->
            <div class="panel-section" v-if="callState === 'Connecting'">
              <div class="connecting-card">
                <div class="spinner-small"></div>
                <div class="connecting-text">正在连接中，请稍候...</div>
              </div>
            </div>

            <!-- 操作控制 -->
            <div class="panel-section panel-section-controls">
              <h4>操作控制</h4>
              <button class="end-call-btn" @click="handleExit">
                <img src="@/assets/interview/call.svg" alt="结束通话" class="call-icon" />
                <span>结束通话</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {ArrowLeft, Clock, Warning} from '@element-plus/icons-vue'
import ARTCAICallEngine, {AICallAgentType, AICallState} from 'aliyun-auikit-aicall'
import AUIAICallStandardController from '@/controller/call/AUIAICallStandardController'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import {useUserStore} from '@/stores/user'
import {useInterviewStore} from '@/stores/interview'
import VoiceAvatar from '@/components/interview/VoiceAvatar.vue'

const router = useRouter()
const userStore = useUserStore()
const voiceInterviewStore = useVoiceInterviewStore()
const interviewStore = useInterviewStore()

const controller = ref(null)
const interviewTime = ref(0)
let timer = null


// 当前问题
const currentQuestion = ref('')

// 面试官名称（从面试配置中获取）
const interviewerName = computed(() => {
  const positionInfo = interviewStore.interviewConfig.positionInfo
  if (positionInfo && positionInfo.companyName) {
    return positionInfo.companyName
  }
  // 如果没有配置，返回默认值
  return 'offer侠'
})

// AI状态
const aiStatusText = computed(() => {
  if (callState.value === 'Connected') {
    return voiceInterviewStore.state.isSpeaking ? '正在提问' : '正在倾听'
  }
  if (callState.value === 'Connecting') return '连接中'
  return '等待连接'
})

const aiStatusClass = computed(() => {
  if (callState.value === 'Connected') {
    return voiceInterviewStore.state.isSpeaking ? 'speaking' : 'listening'
  }
  return 'waiting'
})

const callState = computed(() => {
  const state = voiceInterviewStore.state.callState
  if (state === AICallState.None) return 'None'
  if (state === AICallState.Connecting) return 'Connecting'
  if (state === AICallState.Connected) return 'Connected'
  if (state === AICallState.Error) return 'Error'
  if (state === AICallState.Over) return 'Over'
  return 'Unknown'
})

const callErrorMessage = computed(() => voiceInterviewStore.state.callErrorMessage)
const isConnected = computed(() => callState.value === 'Connected')

const statusText = computed(() => {
  const state = callState.value
  if (state === 'Connecting') return '连接中...'
  if (state === 'Connected') return '稳定连接'
  if (state === 'Error') return '连接失败'
  return '未连接'
})

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 开始计时
const startTimer = () => {
  timer = setInterval(() => {
    interviewTime.value++
  }, 1000)
}

// 停止计时
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 初始化控制器
const initController = () => {
  // 获取用户ID（从token中提取或使用默认值）
  const userInfo = userStore.getUserInfo
  const userId = userInfo?.userId || userInfo?.id || userInfo?.username || 'default_user'

  // 创建控制器（使用 standard 模式）
  controller.value = new AUIAICallStandardController(userId)

  // 配置控制器（只保留必要的配置）
  controller.value.config = {
    agentType: AICallAgentType.VoiceAgent,
  }

  // 设置状态
  voiceInterviewStore.setState({
    agentType: AICallAgentType.VoiceAgent,
  })

  // 注册事件监听
  setupEventListeners()
}

// 设置事件监听
const setupEventListeners = () => {
  if (!controller.value) return

  // 状态变化
  controller.value.on('AICallStateChanged', (newState) => {
    voiceInterviewStore.setState({callState: newState})
    if (newState === AICallState.Connected) {
      startTimer()
    } else if (newState === AICallState.Over || newState === AICallState.Error) {
      stopTimer()
    }
    if (newState === AICallState.Error) {
      controller.value?.handup()
      voiceInterviewStore.setState({
        callErrorMessage: '通话连接失败'
      })
    }
  })

  // 智能体状态变化
  controller.value.on('AICallAgentStateChanged', (newState) => {
    voiceInterviewStore.setState({agentState: newState})
  })

  // 音量变化
  controller.value.on('AICallActiveSpeakerVolumeChanged', (userId, volume) => {
    if (userId === '') {
      voiceInterviewStore.setState({isSpeaking: volume > 30})
    }
  })

  // 字幕通知（用于提取当前问题）
  controller.value.on('AICallAgentSubtitleNotify', (data) => {
    // 如果是第一个问题，更新当前问题
    if (data && data.text && !currentQuestion.value) {
      currentQuestion.value = data.text
    }
  })

  // Token 过期
  controller.value.on('AICallUserTokenExpired', () => {
    ElMessage.error('登录已过期，请重新登录')
    router.push('/login')
  })

  // 通话开始
  controller.value.on('AICallBegin', (elapsedTime) => {
    console.log('Call connected, elapsed time:', elapsedTime)
    ElMessage.success('语音面试已连接')
  })

  // 智能体配置加载
  controller.value.on('AICallAgentConfigLoaded', (config) => {
    if (config.AvatarUrl) {
      voiceInterviewStore.setState({voiceAvatarUrl: config.AvatarUrl})
    }
    if (config?.TtsConfig?.VoiceId) {
      voiceInterviewStore.setState({voiceId: config.TtsConfig.VoiceId})
    }
    if (config?.enablePushToTalk) {
      voiceInterviewStore.setState({enablePushToTalk: config.enablePushToTalk})
    }
  })
}

// 开始通话
const handleCall = async () => {
  if (!controller.value) return

  // 检查浏览器支持
  const supportedResult = await ARTCAICallEngine.isSupported()
  if (!supportedResult.support) {
    ElMessage.error('您的浏览器不支持音频通话功能')
    return
  }

  try {
    await controller.value.start()
  } catch (error) {
    console.error('Start call failed:', error)
    if (error.name === 'ServiceAuthError') {
      ElMessage.error('认证失败，请重新登录')
      await router.push('/login')
    }
    voiceInterviewStore.setState({
      callState: AICallState.Error,
      callErrorMessage: error.message || '启动通话失败'
    })
  }
}

// 停止通话
const handleStop = async () => {
  if (controller.value) {
    await controller.value.handup()
    voiceInterviewStore.reset()
    stopTimer()
    interviewTime.value = 0
  }
}

// 重试
const handleRetry = () => {
  voiceInterviewStore.setState({
    callState: AICallState.None,
    callErrorMessage: null
  })
  handleCall()
}

// 退出
const handleExit = async () => {
  await handleStop()
  await router.push('/interview/preparation')
}


onMounted(() => {
  initController()
  // 自动开始通话
  handleCall()
})

onUnmounted(() => {
  if (controller.value) {
    controller.value.handup()
    voiceInterviewStore.reset()
  }
  stopTimer()
})
</script>

<style scoped>
.voice-interview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f7fa 100%);
  color: #1a202c;
  overflow: hidden;
  position: relative;
}

.voice-interview-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.voice-interview-page > * {
  position: relative;
  z-index: 1;
}

/* 顶部状态栏样式 */
.top-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.status-left,
.status-center,
.status-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.status-left {
  justify-content: flex-start;
}

.status-center {
  justify-content: center;
}

.status-right {
  justify-content: flex-end;
}

.exit-btn {
  color: #4b5563;
  font-size: 16px;
  transition: all 0.2s ease;
}

.exit-btn:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.time-display {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.connection-status {
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
  background: #4caf50;
  animation: none;
}

.status-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
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
  height: 80vh;
}

.ai-interviewer-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
}

.interviewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interviewer-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.interviewer-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

/* AI面试官居中显示 */
.interviewer-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  min-height: 0;
}

.interviewer-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: visible;
  min-height: 200px;
  position: relative;
  width: 100%;
  max-width: 500px;
}

.interviewer-info {
  text-align: center;
}

.interviewer-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 5px 0;
}

.interviewer-style {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.current-question {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.1);
}

.current-question h4 {
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-question h4::before {
  content: '❓';
  font-size: 18px;
}

.question-content {
  font-size: 16px;
  line-height: 1.7;
  color: #78350f;
  font-weight: 500;
}


/* 右栏样式 */
.right-column {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.control-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
}

.panel-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  color: #fff;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
}

.panel-section {
  margin-bottom: 25px;
}

.panel-section-controls {
  margin-top: auto;
  margin-bottom: 20px;
  padding-top: 25px;
}

.end-call-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.end-call-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

.end-call-btn:active {
  transform: translateY(0);
}

.call-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.panel-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.status-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.status-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4d4f;
  animation: pulse 2s infinite;
}

.status-dot.connected {
  background: #4caf50;
  animation: none;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
}

.status-desc {
  font-size: 14px;
  color: #64748b;
}

.error-card {
  padding: 20px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.error-icon {
  font-size: 48px;
  color: #f44336;
  margin-bottom: 10px;
}

.error-message {
  color: #991b1b;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
}

.connecting-card {
  padding: 20px;
  text-align: center;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

.connecting-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .right-column {
    width: 100%;
  }

}

@media (max-width: 768px) {
  .top-status-bar {
    padding: 15px 20px;
  }

  .main-content {
    padding: 15px;
  }

  .ai-interviewer-section {
    padding: 20px;
    gap: 20px;
  }

  .right-column {
    width: 100%;
  }

  .interviewer-avatar {
    padding: 15px;
  }

  .current-question {
    padding: 15px;
  }
}
</style>

