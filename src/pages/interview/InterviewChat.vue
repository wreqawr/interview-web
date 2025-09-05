<template>
  <div class="interview-chat-page">

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧面试内容区域 -->
      <div class="interview-content">
        <!-- 聊天记录滚动区域 -->
        <div class="chat-messages" ref="chatMessagesRef">
          <div 
            v-for="msg in messageList" 
            :key="msg.id" 
            class="message"
            :class="msg.type"
          >
            <div class="message-header">
              <span class="sender-label">{{ msg.type === 'assistant' ? '面试官' : '我' }}</span>
            </div>
            <div class="message-content">
              <span v-if="msg.type === 'assistant'" class="assistant-icon">AI</span>
              {{ msg.content }}
            </div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- 固定在底部的输入和按钮区域 -->
        <div class="fixed-bottom-section">
          <!-- 用户回答区域 -->
          <div class="answer-section">
            <div class="input-wrapper">
              <textarea 
                class="chat-input" 
                :placeholder="isSubmitting ? 'AI正在处理中，请稍候...' : '请详细描述你的思路和解决方案，使用 Shift + Enter 换行'"
                v-model="userAnswer"
                rows="4"
                :disabled="!hasStarted || isSubmitting || isPaused"
                @keydown.enter.exact="handleEnterSubmit"
                @keydown.shift.enter="handleShiftEnter"
              ></textarea>
              <img 
                :src="canSend ? sendEnableIcon : sendDisableIcon"
                :alt="canSend ? '提交回答' : '提交回答(禁用)'"
                class="send-icon"
                :class="{ 'disabled': !canSend }"
                @click="canSend ? submitAnswer() : null"
                :style="{ cursor: canSend ? 'pointer' : 'not-allowed' }"
              />
            </div>
            <div class="thinking-indicator" v-if="isThinking">
              <div class="thinking-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="thinking-text">正在思考...</span>
            </div>
          </div>


        </div>
      </div>

      <!-- 右侧控制面板 -->
      <div class="control-panel">
        <div class="panel-header">
          <h3>面试控制面板</h3>
        </div>
        
        <div class="panel-content">
          <!-- 面试进度 -->
          <div class="panel-section">
            <h4>面试进度</h4>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <span class="progress-text">{{ userAnswerCount }}/{{ totalQuestions }}</span>
            </div>
          </div>

          <!-- 剩余时间 -->
          <div class="panel-section">
            <h4>剩余时间</h4>
            <div class="time-display">
              <el-icon><Clock /></el-icon>
              <span class="time-value">{{ formatTime(remainingTime) }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="panel-section">
            <h4>操作控制</h4>
            <div class="control-buttons">
              <div class="control-row">
                <div class="ctrl-item start" @click="startInterviewControl">
                  <el-icon><VideoPlay /></el-icon>
                  <span>开始</span>
                </div>

                <div class="ctrl-item pause" :class="{ disabled: isPaused }" @click="!isPaused && pauseInterview()">
                  <el-icon><VideoPause /></el-icon>
                  <span>暂停</span>
                </div>
              </div>

              <div class="control-row">
                <div class="ctrl-item restart" @click="restartQuestion">
                  <el-icon><Refresh /></el-icon>
                  <span>重置</span>
                </div>

                <div class="ctrl-item end" @click="endInterview">
                  <el-icon><VideoPlay /></el-icon>
                  <span>结束</span>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>

    <!-- 开始倒计时遮罩 -->
    <div class="countdown-overlay" v-if="isStarting">
      <div class="countdown-content">
        <div class="countdown-number">{{ countdown }}</div>
        <div class="countdown-text">面试即将开始</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useInterviewStore } from '@/stores/interview'
import { 
  Clock, VideoPause, Refresh, VideoPlay 
} from '@element-plus/icons-vue'
import sendEnableIcon from '@/assets/chat/send-enable.svg'
import sendDisableIcon from '@/assets/chat/send-disable.svg'
import { aiApi } from '@/api/ai'
import { nextTick, watch } from 'vue'

const router = useRouter()
const interviewStore = useInterviewStore()

// 面试配置
const interviewConfig = ref({
  position: '',
  resumeId: '',
  mode: 'chat'
})

// 面试状态
const isPaused = ref(false)
const isSubmitting = ref(false)
const isThinking = ref(false)
const isStarting = ref(false)
const countdown = ref(3)
const interviewTime = ref(0)
const remainingTime = ref(30 * 60) // 30分钟
const currentQuestionIndex = ref(0)
const totalQuestions = ref(5)
const userAnswerCount = ref(0)

// 用户输入
const userAnswer = ref('')

// 当前问题
const currentQuestion = ref({
  title: '请解释下面React代码的执行结果：',
  description: '',
  code: `function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
    setCount(count + 1);
  }, []);

  return <div>{count}</div>;
}`,
  language: 'JavaScript'
})

// 问题列表（模拟数据）
const questions = ref([
  {
    title: '请解释下面React代码的执行结果：',
    description: '',
    code: `function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
    setCount(count + 1);
  }, []);

  return <div>{count}</div>;
}`,
    language: 'JavaScript'
  },
  {
    title: '请解释JavaScript中的闭包概念，并举例说明',
    description: '请详细描述闭包的定义、特点和使用场景',
    code: '',
    language: ''
  },
  {
    title: '请解释CSS盒模型，并说明box-sizing属性的作用',
    description: '请描述标准盒模型和IE盒模型的区别',
    code: '',
    language: ''
  },
  {
    title: '请解释HTTP状态码的含义，并举例说明',
    description: '请重点说明2xx、4xx、5xx状态码的含义',
    code: '',
    language: ''
  },
  {
    title: '请描述前端性能优化的方法',
    description: '请从多个角度分析前端性能优化的策略',
    code: '',
    language: ''
  }
])

// 聊天记录
const messageList = ref([])
const chatMessagesRef = ref(null)
const hasStarted = ref(false)
const isAiStreaming = ref(false)
const canSend = computed(() => hasStarted.value && !isAiStreaming.value && !!userAnswer.value.trim() && !isSubmitting.value)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

watch(messageList, () => {
  scrollToBottom()
})

let streamMessageId = null

// 定时器
let timer = null

// 检查面试配置
const checkInterviewConfig = () => {
  const config = interviewStore.interviewConfig
  
  // 检查是否有必要的配置
  if (!config.position || !config.resumeId || !config.mode) {
    ElMessage.error('面试配置不完整，请返回重新配置')
    router.push('/interview/preparation')
    return false
  }
  
  // 检查面试模式是否正确
  if (config.mode !== 'chat') {
    ElMessage.error('当前页面仅支持文字聊天面试模式')
    router.push('/interview/preparation')
    return false
  }
  
  // 更新本地配置
  interviewConfig.value = { ...config }
  
  // 开始面试
  interviewStore.startInterview()
  
  return true
}



// 解析路由参数
onMounted(() => {
  // 检查面试配置
  if (!checkInterviewConfig()) {
    return
  }
  
  // 设置当前问题
  currentQuestion.value = questions.value[0]
  
  // 开始计时
  startTimer()
})

// 组件卸载时清理
onBeforeUnmount(() => {
  stopTimer()
})

// 开始计时
const startTimer = () => {
  timer = setInterval(() => {
    if (!isPaused.value) {
      interviewTime.value++
      if (remainingTime.value > 0) {
        remainingTime.value--
      } else {
        // 时间到，自动结束面试
        endInterview()
      }
    }
  }, 1000)
}

// 停止计时
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 计算进度百分比
const progressPercent = computed(() => {
  return Math.min((userAnswerCount.value / totalQuestions.value) * 100, 100)
})


// 处理Enter键提交
const handleEnterSubmit = (event) => {
  // 检查是否有输入法候选项
  const hasComposition = event.isComposing || event.keyCode === 229
  
  // 如果有输入法候选项，不阻止默认行为，让输入法处理
  if (hasComposition) {
    return
  }
  
  // 如果没有输入法候选项，则提交回答
  event.preventDefault()
  submitAnswer()
}

// 处理Shift+Enter换行
const handleShiftEnter = () => {
  // 允许默认的换行行为
}

// 提交回答 -> 调用后端进度接口（SSE流）并实时渲染
const submitAnswer = async () => {
  if (!userAnswer.value.trim() || isSubmitting.value || isPaused.value) return

  isSubmitting.value = true
  isThinking.value = true

  try {
    const conversationId = interviewConfig.value.conversationId || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    // 将会话ID写回，后续沿用
    interviewConfig.value.conversationId = conversationId

    // 先把用户消息插入到消息列表
    const userMsg = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: userAnswer.value,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    messageList.value.push(userMsg)
    
    // 增加用户回答计数
    userAnswerCount.value++

    // 预占位AI消息（用于聚合流）
    streamMessageId = `assistant_${Date.now()}`
    messageList.value.push({ id: streamMessageId, type: 'assistant', content: '', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) })
    scrollToBottom()

    // 触发后端流式接口
    isAiStreaming.value = true
    await aiApi.interviewProgress({
      conversationId,
      userMessage: userAnswer.value,
      onData: (data) => {
        const idx = messageList.value.findIndex(m => m.id === streamMessageId)
        if (idx !== -1) messageList.value[idx].content += data
        scrollToBottom()
      },
      onComplete: () => {
        isAiStreaming.value = false
      },
      onError: () => {
        isAiStreaming.value = false
        ElMessage.error('回答生成失败，请重试')
      }
    })

    // 成功后清空输入
    userAnswer.value = ''
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  } finally {
    isSubmitting.value = false
    isThinking.value = false
  }
}


// 重新开始当前题目
const restartQuestion = () => {
  userAnswer.value = ''
  ElMessage.info('已重新开始当前题目')
}

// 开始/继续面试
const startInterviewControl = () => {
  ElMessageBox.confirm(
    '现在开始？',
    '确认开始',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }
  ).then(() => {
    // 显示3秒倒计时
    isStarting.value = true
    countdown.value = 3
    let left = 3
    const timer = setInterval(() => {
      left -= 1
      countdown.value = left
      if (left <= 0) {
        clearInterval(timer)
        isStarting.value = false
        isPaused.value = false
        hasStarted.value = true
        ElMessage.success('面试已开始')

        // 触发面试准备流式请求
        const conversationId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        // 将conversationId保存到interviewConfig中，确保后续进度接口使用同一个ID
        interviewConfig.value.conversationId = conversationId
        const jobId = interviewStore.interviewConfig.position
        const resumeId = interviewStore.interviewConfig.resumeId

        // 先插入一条空的AI消息，用于聚合本次流
        streamMessageId = `assistant_${Date.now()}`
        messageList.value.push({
          id: streamMessageId,
          type: 'assistant',
          content: '',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        })
        isAiStreaming.value = true
        aiApi.interviewPrepare({
          conversationId,
          jobId,
          resumeId,
          onData: (data) => {
            // 将流式数据聚合到一条消息中
            const index = messageList.value.findIndex(m => m.id === streamMessageId)
            if (index !== -1) {
              messageList.value[index].content += data
            }
            scrollToBottom()
          },
          onComplete: () => {
            // 完成时不提示
            isAiStreaming.value = false
          },
          onError: () => {
            ElMessage.error('面试准备失败')
            isAiStreaming.value = false
          }
        })
      }
    }, 1000)
  }).catch(() => {
    // 取消开始
  })
}

// 暂停/继续面试
const pauseInterview = () => {
  isPaused.value = !isPaused.value
  ElMessage.info(isPaused.value ? '面试已暂停' : '面试已继续')
}

// 结束面试
const endInterview = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要结束面试吗？结束后将无法继续。',
      '确认结束',
      {
        confirmButtonText: '确定结束',
        cancelButtonText: '继续面试',
        type: 'warning'
      }
    )
    
    // 跳转到面试结果页面
    router.push({
      path: '/interview/results',
      query: { 
        mode: 'chat',
        duration: interviewTime.value,
        questions: currentQuestionIndex.value + 1
      }
    })
  } catch {
    // 用户取消
  }
}








</script>

<style scoped>
.interview-chat-page {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

/* 左侧面试内容区域 */
.interview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  min-height: 0;
}

/* 聊天记录滚动区域 */
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: calc(100% - 40px);
  overflow-y: auto;
  height: calc(100vh - 300px);
  min-height: 0;
  padding: 20px 52px 0 20px;
  margin: 0 20px;
  border-radius: 8px;
  box-sizing: border-box;
}

/* 固定在底部的输入和按钮区域 */
.fixed-bottom-section {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #e9ecef;
  padding: 20px;
  margin-top: auto;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.sender-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.message.user .message-content {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 6px;
  margin-left: auto;
  margin-right: 0;
}

.message.assistant .message-content {
  background: #f3f4f6;
  color: #374151;
  border-bottom-left-radius: 6px;
}

.assistant-icon {
  margin-right: 6px;
  color: #8b5cf6;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin: 0 4px;
  align-self: center;
  text-align: center;
}

/* 回答区域 */
.answer-section {
  margin: 0 0 20px 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.chat-input {
  flex: 1;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #374151;
  resize: none;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
  box-sizing: border-box;
}

.chat-input:focus {
  border: 1px solid transparent;
  background: linear-gradient(#ffffff, #ffffff) padding-box,
              linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899) border-box;
  background-size: 200% 100%;
  animation: gradientFlow 2s linear infinite;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@keyframes gradientFlow {
  0% {
    background-position: 0 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.chat-input::placeholder {
  color: #9ca3af;
}

.send-icon {
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.send-icon:hover:not(.disabled) {
  transform: translateY(-2px);
}

.send-icon:active:not(.disabled) {
  transform: translateY(0);
}

.send-icon.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 思考指示器 */
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 14px;
}

.thinking-bars {
  display: flex;
  gap: 3px;
}

.thinking-bars span {
  width: 3px;
  height: 15px;
  background: #667eea;
  border-radius: 2px;
  animation: thinking 1.4s infinite ease-in-out;
}

.thinking-bars span:nth-child(1) { animation-delay: -0.32s; }
.thinking-bars span:nth-child(2) { animation-delay: -0.16s; }
.thinking-bars span:nth-child(3) { animation-delay: 0s; }
.thinking-bars span:nth-child(4) { animation-delay: 0.16s; }

@keyframes thinking {
  0%, 80%, 100% { transform: scaleY(0.3); }
  40% { transform: scaleY(1); }
}

.thinking-text {
  color: #667eea;
  font-weight: 500;
}



/* 右侧控制面板 */
.control-panel {
  width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
}

.panel-section {
  margin-bottom: 25px;
}

.panel-section h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 进度条 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
}

/* 时间显示 */
.time-display {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.time-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

/* 控制按钮 */
.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.control-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
}

.ctrl-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.ctrl-item:hover { opacity: 0.9; transform: translateY(-1px); }
.ctrl-item.disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.ctrl-item.start { background: #67c23a; }
.ctrl-item.pause { background: #909399; }
.ctrl-item.restart { background: #e6a23c; }
.ctrl-item.end { background: #f56c6c; }



/* 响应式设计 */
@media (max-width: 1200px) {
  .control-panel {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 15px;
  }
  
  .control-panel {
    width: 100%;
    order: -1;
  }

}

@media (max-width: 480px) {

  .main-content {
    padding: 10px;
  }
  
  .interview-content {
    padding: 0;
  }
  
  .chat-messages {
    padding: 15px 47px 0 15px;
    margin: 0 15px;
    width: calc(100% - 30px);
    height: calc(100vh - 280px);
  }
  
  .fixed-bottom-section {
    padding: 15px;
  }
  
  .message-content {
    max-width: 85%;
  }

}

/* 倒计时遮罩 */
.countdown-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.countdown-content {
  text-align: center;
  color: #fff;
}

.countdown-number {
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
}

.countdown-text {
  margin-top: 10px;
  font-size: 18px;
  opacity: 0.9;
}
</style> 