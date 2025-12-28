<template>
  <div class="voice-interview-page">
    <div class="voice-interview-container">
      <!-- 顶部状态栏 -->
      <div class="top-status-bar">
        <div class="status-left">
          <el-button
            text
            @click="handleExit"
            class="exit-btn"
          >
            <el-icon><ArrowLeft /></el-icon>
            <span>退出面试</span>
          </el-button>
        </div>

        <div class="status-center">
          <div class="timer">
            <el-icon><Clock /></el-icon>
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

      <!-- 主要内容区域 -->
      <div class="voice-content">
        <VoiceAvatar />

        <div v-if="callState === 'Connecting'" class="connecting">
          <div class="spinner"></div>
          <p>正在连接...</p>
        </div>

        <div v-if="callState === 'Error'" class="error">
          <p>连接失败: {{ callErrorMessage }}</p>
          <el-button @click="handleRetry">重试</el-button>
        </div>
      </div>

      <!-- 控制按钮 -->
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
import {ArrowLeft, Clock} from '@element-plus/icons-vue'
import ARTCAICallEngine, {AICallAgentType, AICallState} from 'aliyun-auikit-aicall'
import AUIAICallProxyController from '@/controller/call/AUIAICallProxyController'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import {useUserStore} from '@/stores/user'
import VoiceAvatar from '@/components/interview/VoiceAvatar.vue'
import VoiceControls from '@/components/interview/VoiceControls.vue'
import voiceService from '@/api/voiceService'

const router = useRouter()
const userStore = useUserStore()
const voiceInterviewStore = useVoiceInterviewStore()

const controller = ref(null)
const interviewTime = ref(0)
let timer = null

// 语音面试配置（可以从后端获取或使用默认值）
const voiceAgentId = ref('86f6aab36b0f4faa95f39a1ea2ddebc6') // 默认智能体ID，应该从配置获取
const region = ref('cn-shanghai')

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
  voiceService.setAppServer('')  // 使用相对路径，空字符串表示当前域名

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
    voiceInterviewStore.setState({ callState: newState })
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
    voiceInterviewStore.setState({ agentState: newState })
  })

  // 音量变化
  controller.value.on('AICallActiveSpeakerVolumeChanged', (userId, volume) => {
    if (userId === '') {
      voiceInterviewStore.setState({ isSpeaking: volume > 30 })
    }
  })

  // 字幕通知
  controller.value.on('AICallAgentSubtitleNotify', (data) => {
    console.log('Agent subtitle:', data)
  })

  controller.value.on('AICallUserSubtitleNotify', (data) => {
    console.log('User subtitle:', data)
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
      voiceInterviewStore.setState({ voiceAvatarUrl: config.AvatarUrl })
    }
    if (config?.TtsConfig?.VoiceId) {
      voiceInterviewStore.setState({ voiceId: config.TtsConfig.VoiceId })
    }
    if (config?.enablePushToTalk) {
      voiceInterviewStore.setState({ enablePushToTalk: config.enablePushToTalk })
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
  router.push('/interview/preparation')
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
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.voice-interview-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部状态栏 */
.top-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
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
  color: white;
  font-size: 16px;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.time-display {
  font-size: 18px;
  font-weight: 600;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulse 2s infinite;
}

.status-indicator.connected {
  background: #4caf50;
  animation: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 主要内容区域 */
.voice-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}

.connecting {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background: rgba(244, 67, 54, 0.8);
  padding: 20px;
  border-radius: 12px;
}
</style>

