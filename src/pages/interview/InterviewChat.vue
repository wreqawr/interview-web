<template>
  <div class="interview-chat-page">
    <!-- 顶部标题栏 -->
    <div class="top-header">
      <div class="header-left">
        <el-button type="text" @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="interview-title">{{ interviewConfig.position }}-技术面试</h1>
      </div>
      <div class="header-right">
        <el-button type="text" @click="showHelp" class="help-btn">
          <el-icon><QuestionFilled /></el-icon>
        </el-button>
        <el-button type="text" @click="showSettings" class="settings-btn">
          <el-icon><Setting /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧面试内容区域 -->
      <div class="interview-content">
        <!-- 欢迎消息 -->
        <div class="message ai-message">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="message-text">
              欢迎参加{{ interviewConfig.position }}技术面试，我是AI面试官。本次面试将包含{{ totalQuestions }}个技术问题，预计用时{{ estimatedTime }}分钟。准备好了吗？
            </div>
            <div class="message-time">{{ formatTime(interviewTime) }}</div>
          </div>
        </div>

        <!-- 用户准备确认 -->
        <div class="message user-message">
          <div class="message-content">
            <div class="message-text">准备好了，可以开始面试。</div>
            <div class="message-time">{{ formatTime(interviewTime) }}</div>
          </div>
          <div class="message-avatar">👤</div>
        </div>

        <!-- 当前问题 -->
        <div v-if="currentQuestion" class="message ai-message">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="message-text">
              <div class="question-header">
                第{{ currentQuestionIndex + 1 }}题：{{ currentQuestion.title }}
              </div>
              <div v-if="currentQuestion.description" class="question-description">
                {{ currentQuestion.description }}
              </div>
              <div v-if="currentQuestion.code" class="code-block">
                <div class="code-header">
                  <span class="code-language">{{ currentQuestion.language || 'JavaScript' }}</span>
                  <el-button type="text" size="small" @click="copyCode" class="copy-btn">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
                <pre class="code-content"><code>{{ currentQuestion.code }}</code></pre>
              </div>
            </div>
            <div class="message-time">{{ formatTime(interviewTime) }}</div>
          </div>
        </div>

        <!-- 用户回答区域 -->
        <div class="answer-section">
          <div class="answer-input-container">
            <div class="input-header">
              <span class="input-label">请输入你的回答：</span>
              <div class="format-controls">
                <el-button type="text" size="small" @click="insertBold" class="format-btn">
                  <strong>B</strong>
                </el-button>
                <el-button type="text" size="small" @click="insertList" class="format-btn">
                  <el-icon><List /></el-icon>
                </el-button>
                <el-button type="text" size="small" @click="insertCode" class="format-btn">
                  &lt;/&gt;
                </el-button>
              </div>
            </div>
            <el-input
              v-model="userAnswer"
              type="textarea"
              :rows="6"
              placeholder="请详细描述你的思路和解决方案..."
              :disabled="isSubmitting || isPaused"
              class="answer-input"
            />
            <div class="input-footer">
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

        <!-- 导航按钮 -->
        <div class="navigation-buttons">
          <el-button 
            type="default" 
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="nav-btn prev-btn"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>
          
          <el-button 
            type="primary" 
            @click="submitAnswer"
            :disabled="!userAnswer.trim() || isSubmitting || isPaused"
            :loading="isSubmitting"
            class="nav-btn submit-btn"
          >
            提交回答
          </el-button>
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
              <span class="progress-text">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
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
              <el-button 
                type="default" 
                @click="pauseInterview"
                :disabled="isPaused"
                class="control-btn"
              >
                <el-icon><VideoPause /></el-icon>
                暂停
              </el-button>
              
              <el-button 
                type="warning" 
                @click="restartQuestion"
                class="control-btn"
              >
                <el-icon><Refresh /></el-icon>
                重新开始
              </el-button>
              
              <el-button 
                type="danger" 
                @click="endInterview"
                class="control-btn end-btn"
              >
                <el-icon><VideoPlay /></el-icon>
                结束面试
              </el-button>
            </div>
          </div>

          <!-- 输入模式选择 -->
          <div class="panel-section">
            <h4>输入模式</h4>
            <div class="input-mode-selector">
              <el-radio-group v-model="inputMode" @change="handleInputModeChange">
                <el-radio-button value="text" class="mode-option">
                  <el-icon><Keyboard /></el-icon>
                  文字输入
                </el-radio-button>
                <el-radio-button value="voice" class="mode-option">
                  <el-icon><Microphone /></el-icon>
                  语音输入
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="panel-footer">
          <el-button 
            type="primary" 
            @click="nextQuestion"
            :disabled="currentQuestionIndex >= totalQuestions - 1 || !canProceed"
            class="next-btn"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
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
  ArrowLeft, ArrowRight, QuestionFilled, Setting, CopyDocument, 
  List, Clock, VideoPause, Refresh, VideoPlay, Keyboard, Microphone 
} from '@element-plus/icons-vue'

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
const interviewTime = ref(0)
const remainingTime = ref(30 * 60) // 30分钟
const currentQuestionIndex = ref(0)
const totalQuestions = ref(5)
const estimatedTime = ref(30)

// 用户输入
const userAnswer = ref('')
const inputMode = ref('text')

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
  return Math.min(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100, 100)
})

// 是否可以进入下一题
const canProceed = computed(() => {
  return userAnswer.value.trim() && !isSubmitting.value
})

// 提交回答
const submitAnswer = async () => {
  if (!userAnswer.value.trim() || isSubmitting.value || isPaused.value) {
    return
  }

  isSubmitting.value = true
  isThinking.value = true

  try {
    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 保存用户回答
    // TODO: 这里可以调用后端API保存回答
    
    ElMessage.success('回答提交成功！')
    
    // 清空输入框
    userAnswer.value = ''
    
    // 自动进入下一题（如果不是最后一题）
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      setTimeout(() => {
        nextQuestion()
      }, 1000)
    }
    
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  } finally {
    isSubmitting.value = false
    isThinking.value = false
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    currentQuestion.value = questions.value[currentQuestionIndex.value]
    userAnswer.value = ''
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    currentQuestion.value = questions.value[currentQuestionIndex.value]
    userAnswer.value = ''
  }
}

// 重新开始当前题目
const restartQuestion = () => {
  userAnswer.value = ''
  ElMessage.info('已重新开始当前题目')
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

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 显示帮助
const showHelp = () => {
  ElMessage.info('帮助功能待实现')
}

// 显示设置
const showSettings = () => {
  ElMessage.info('设置功能待实现')
}

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(currentQuestion.value.code)
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 格式化控制
const insertBold = () => {
  userAnswer.value += '**粗体文字**'
}

const insertList = () => {
  userAnswer.value += '\n- 列表项1\n- 列表项2\n- 列表项3'
}

const insertCode = () => {
  userAnswer.value += '\n```\n代码块\n```'
}

// 处理输入模式变化
const handleInputModeChange = (mode) => {
  if (mode === 'voice') {
    ElMessage.info('语音输入功能待实现')
    inputMode.value = 'text' // 暂时保持文字输入
  }
}
</script>

<style scoped>
.interview-chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 顶部标题栏 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #667eea;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-btn {
  color: #fff;
  font-size: 18px;
}

.interview-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  gap: 10px;
}

.help-btn, .settings-btn {
  color: #fff;
  font-size: 18px;
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
}

/* 聊天记录区域 */
.interview-content {
  padding: 20px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.user-message .message-avatar {
  background: #e9ecef;
  color: #666;
}

.message-content {
  max-width: 80%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
}

.ai-message .message-text {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
}

.user-message .message-text {
  background: #667eea;
  color: #fff;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  text-align: right;
}

.user-message .message-time {
  text-align: left;
}

/* 问题样式 */
.question-header {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.question-description {
  margin-bottom: 15px;
  color: #666;
  line-height: 1.5;
}

/* 代码块样式 */
.code-block {
  margin: 15px 0;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.code-language {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.copy-btn {
  color: #667eea;
  font-size: 14px;
}

.code-content {
  margin: 0;
  padding: 15px;
  background: #2d3748;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
}

/* 回答区域 */
.answer-section {
  margin: 20px 0;
}

.answer-input-container {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.answer-input-container:focus-within {
  border-color: #667eea;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.input-label {
  font-weight: 500;
  color: #333;
}

.format-controls {
  display: flex;
  gap: 8px;
}

.format-btn {
  color: #666;
  font-size: 14px;
  padding: 4px 8px;
}

.format-btn:hover {
  color: #667eea;
  background: #f0f0f0;
  border-radius: 4px;
}

.answer-input {
  border: none;
  border-radius: 0;
}

.input-footer {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
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

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.nav-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

.prev-btn {
  color: #666;
}

.submit-btn {
  background: #667eea;
  border-color: #667eea;
}

.submit-btn:hover {
  background: #5a67d8;
  border-color: #5a67d8;
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
  margin: 0 0 12px 0;
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
  gap: 10px;
}

.control-btn {
  justify-content: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
}

.end-btn {
  background: #e53e3e;
  border-color: #e53e3e;
  color: #fff;
}

.end-btn:hover {
  background: #c53030;
  border-color: #c53030;
}

/* 输入模式选择 */
.input-mode-selector {
  margin-top: 10px;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.mode-option:hover {
  background: #f8f9fa;
}

/* 面板底部 */
.panel-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.next-btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  background: #667eea;
  border-color: #667eea;
}

.next-btn:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

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
  
  .top-header {
    padding: 15px 20px;
  }
  
  .interview-title {
    font-size: 18px;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .top-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .header-left {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .main-content {
    padding: 10px;
  }
  
  .interview-content {
    padding: 15px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .code-content {
    font-size: 12px;
    padding: 10px;
  }
}
</style> 