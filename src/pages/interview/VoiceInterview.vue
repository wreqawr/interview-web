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
      <!-- 左栏 - AI面试官和实时对话 -->
      <div class="left-column">
        <div class="ai-interviewer-section">
          <div class="interviewer-header">
            <h2>AI面试官</h2>
            <div class="interviewer-status" :class="aiStatusClass">
              {{ aiStatusText }}
            </div>
          </div>

          <!-- AI面试官和实时对话左右布局 -->
          <div class="interviewer-main-layout">
            <!-- 左侧：AI面试官 -->
            <div class="interviewer-left">
              <div class="interviewer-avatar">
                <VoiceAvatar/>
                <div class="interviewer-info">
                  <h3 class="interviewer-name">offer侠</h3>
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

            <!-- 右侧：实时对话 -->
            <div class="transcript-section">
              <div class="transcript-header">
                <h4>实时对话</h4>
              </div>
              <div class="transcript-content">
                <!-- AI说话区域 -->
                <div class="transcript-ai" v-if="aiTranscript">
                  <div class="transcript-label">
                    <el-icon>
                      <UserFilled/>
                    </el-icon>
                    AI面试官
                  </div>
                  <div class="transcript-text" v-html="formatTranscript(aiTranscript)"></div>
                </div>

                <!-- 用户说话区域 -->
                <div class="transcript-user" v-if="userTranscript">
                  <div class="transcript-label">
                    <el-icon>
                      <User/>
                    </el-icon>
                    我的回答
                  </div>
                  <div class="transcript-text" v-html="formatTranscript(userTranscript)"></div>
                </div>

                <!-- 空状态 -->
                <div v-if="!aiTranscript && !userTranscript" class="transcript-empty">
                  <p>对话内容将在这里显示</p>
                </div>
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
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="control-bar">
      <VoiceControls
          :controller="controller"
          @call="handleCall"
          @stop="handleStop"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {ArrowLeft, Clock, User, UserFilled, Warning} from '@element-plus/icons-vue'
import ARTCAICallEngine, {AICallAgentType, AICallState} from 'aliyun-auikit-aicall'
import AUIAICallProxyController from '@/controller/call/AUIAICallProxyController'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import {useUserStore} from '@/stores/user'
import VoiceAvatar from '@/components/interview/VoiceAvatar.vue'
import VoiceControls from '@/components/interview/VoiceControls.vue'

const router = useRouter()
const userStore = useUserStore()
const voiceInterviewStore = useVoiceInterviewStore()

const controller = ref(null)
const interviewTime = ref(0)
let timer = null

// 语音面试配置（可以从后端获取或使用默认值）
const voiceAgentId = ref('86f6aab36b0f4faa95f39a1ea2ddebc6') // 默认智能体ID，应该从配置获取
const region = ref('cn-shanghai')

// 实时字幕
const aiTranscript = ref('')
const userTranscript = ref('')
const currentQuestion = ref('')

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
  // 设置服务端地址（重要！与 vue-voice 保持一致）
  // voiceService.setAppServer('')  // 使用相对路径，空字符串表示当前域名

  // 获取用户ID（从token中提取或使用默认值）
  const userInfo = userStore.getUserInfo
  const userId = userInfo?.userId || userInfo?.id || userInfo?.username || 'default_user'
  const userToken = userStore.token || ''

  // 创建控制器
  controller.value = new AUIAICallProxyController(userId, userToken)

  // 配置控制器
  controller.value.config = {
    agentType: AICallAgentType.VoiceAgent,
    region: region.value,
    agentId: voiceAgentId.value,
    userId: String(userId),  // 确保 userId 是字符串类型
    userJoinToken: '',
    userData: '',
    agentConfig: null,
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

  // 字幕通知
  controller.value.on('AICallAgentSubtitleNotify', (data) => {
    console.log('Agent subtitle:', data)
    // 更新AI字幕
    if (data && data.text) {
      aiTranscript.value = data.text
      // 如果是第一个问题，更新当前问题
      if (!currentQuestion.value) {
        currentQuestion.value = data.text
      }
    }
  })

  controller.value.on('AICallUserSubtitleNotify', (data) => {
    console.log('User subtitle:', data)
    // 更新用户字幕
    if (data && data.text) {
      userTranscript.value = data.text
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

// 格式化字幕文本（支持HTML）
const formatTranscript = (text) => {
  if (!text) return ''
  // 转义HTML，但保留换行
  return text.replace(/\n/g, '<br>')
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
  color: #fff;
  font-size: 16px;
}

.exit-btn:hover {
  color: #a0a0a0;
}

.timer {
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
  color: #a0a0a0;
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
}

.ai-interviewer-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
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
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
}

/* AI面试官和实时对话左右布局 */
.interviewer-main-layout {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

/* 左侧：AI面试官区域 */
.interviewer-left {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.interviewer-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

/* 右侧：实时对话区域 */
.transcript-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.transcript-header {
  margin-bottom: 15px;
}

.transcript-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #a0a0a0;
  margin: 0;
}

.transcript-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow-y: auto;
}

.transcript-ai,
.transcript-user {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
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

.transcript-empty {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
}

/* 右栏样式 */
.right-column {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.control-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 20px;
  text-align: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 25px;
}

.panel-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #fff;
  margin-bottom: 5px;
}

.status-desc {
  font-size: 14px;
  color: #a0a0a0;
}

.error-card {
  padding: 20px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(244, 67, 54, 0.3);
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #f44336;
  margin-bottom: 10px;
}

.error-message {
  color: #fff;
  margin-bottom: 15px;
  font-size: 14px;
}

.connecting-card {
  padding: 20px;
  text-align: center;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

.connecting-text {
  color: #a0a0a0;
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 底部控制栏样式 */
.control-bar {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .right-column {
    width: 100%;
  }

  .interviewer-main-layout {
    flex-direction: column;
  }

  .interviewer-left {
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

  .interviewer-main-layout {
    flex-direction: column;
    gap: 15px;
  }

  .interviewer-left {
    width: 100%;
  }

  .interviewer-avatar {
    padding: 15px;
  }

  .current-question {
    padding: 15px;
  }

  .transcript-section {
    padding: 15px;
  }
}
</style>

