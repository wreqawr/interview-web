<template>
  <div class="candidate-cockpit">
    <!-- 顶部固定导航栏已移除，现在使用全局导航栏 -->

    <div class="layout">
      <!-- 中央主工作区 -->
      <main class="main">
        <!-- 个人数据概览 -->
        <section class="section">
          <div class="section-header">
            <h2>个人数据概览</h2>
            <div class="actions">
              <el-button size="small" type="primary" plain @click="refreshDashboard">刷新</el-button>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-card glass" v-for="stat in userStatistics" :key="stat.key">
              <div class="stat-icon">
                <img :src="stat.icon" :alt="stat.name" class="stat-svg"/>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.name }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 技能雷达图 -->
        <section class="section">
          <div class="two-col-grid">
            <div class="col left-col">
              <div class="section-header">
                <h2>技能评估雷达图</h2>
              </div>
              <div class="radar-container glass">
                <div class="radar" ref="radarRef"></div>
              </div>
            </div>
            <div class="col right-col">
              <div class="section-header">
                <h2>最近面试记录</h2>
                <div class="actions">
                  <el-button size="small" type="primary" @click="viewAllInterviews">查看全部</el-button>
                </div>
              </div>
              <div class="interview-list panel glass">
                <div class="interview-item" v-for="interview in recentInterviews" :key="interview.id">
                  <div class="interview-header">
                    <div class="company">{{ interview.company }}</div>
                    <div class="position">{{ interview.position }}</div>
                    <div class="status" :class="interview.status">{{ interview.statusText }}</div>
                  </div>
                  <div class="interview-details">
                    <div class="time">{{ interview.time }}</div>
                    <div class="score" v-if="interview.score">评分: {{ interview.score }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 学习进度模块已移除 -->
      </main>

      <!-- 右侧AI助手悬浮 -->
      <div class="smart-sidebar">
        <div class="ai-assistant-bubble" :class="{ active: assistantOpen }" @click="showAssistantDialog">
          <div class="bubble-icon">🤖</div>
          <div class="bubble-text">AI助手</div>
        </div>
      </div>

      <!-- AI助手对话框 -->
      <div class="ai-assistant-panel" :class="{ active: assistantOpen }">
        <div class="panel-header">
          <div class="header-left">
            <h3>AI求职助手</h3>
          </div>
          <div class="header-controls">
            <img :src="clearChatIcon" alt="清空聊天" class="control-icon" @click="clearChat" title="清空聊天"/>
            <img :src="closeChatIcon" alt="关闭" class="control-icon" @click="closeAssistantDialog" title="关闭"/>
          </div>
        </div>
        
        <div class="panel-content">
          <div class="welcome-message" v-if="assistantMessages.length === 0">
            <div class="welcome-icon">⭐</div>
            <div class="welcome-text">您好！我是您的AI求职助手</div>
            <div class="welcome-subtitle">有什么需要帮助的吗？</div>
          </div>
          
          <div class="chat-messages" v-if="assistantMessages.length > 0" ref="chatMessagesRef">
            <div v-for="message in assistantMessages" :key="message.id" class="message" :class="message.type">
              <div class="message-content">
                <span v-if="message.type === 'assistant'" class="assistant-icon">🤖</span>
                {{ message.content }}
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>
        
        <div class="panel-input">
          <div class="input-wrapper">
            <textarea 
              class="chat-input" 
              :placeholder="isChatLoading ? 'AI正在思考中，请稍候...' : '请将您遇到的问题告诉我，使用 Shift + Enter 换行'"
              v-model="inputMessage"
              rows="3"
              :disabled="isChatLoading"
              @keydown.enter.exact="handleEnterKey"
              @keydown.shift.enter="handleShiftEnter"
            ></textarea>
            <img 
              :src="inputMessage.trim() && !isChatLoading ? sendEnableIcon : sendDisableIcon"
              :alt="inputMessage.trim() && !isChatLoading ? '发送' : '发送(禁用)'"
              class="send-icon"
              :class="{ 'disabled': !inputMessage.trim() || isChatLoading }"
              @click="inputMessage.trim() && !isChatLoading ? handleSendMessage() : null"
              :style="{ cursor: inputMessage.trim() && !isChatLoading ? 'pointer' : 'not-allowed' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import * as echarts from 'echarts'
// 移除直接导入权限函数，改为使用用户状态管理器
import sendEnableIcon from '@/assets/chat/send-enable.svg'
import sendDisableIcon from '@/assets/chat/send-disable.svg'
import clearChatIcon from '@/assets/chat/clear-chat.svg'
import closeChatIcon from '@/assets/chat/close-chat.svg'
import { aiApi } from '@/api/ai'

export default {
  name: 'CandidateDashboard',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 顶部状态栏
    const globalSearch = ref('')
    const userInfo = computed(() => userStore.getUserInfo || userStore.userInfo || {})
    const userInitial = computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || 'J'
      return name.charAt(0).toUpperCase()
    })
    const userStatus = computed(() => {
      // 根据用户状态返回相应文本
      return '求职中'
    })



    // 用户统计数据 - 使用用户状态管理器
    const userStatistics = computed(() => userStore.userStatistics)
    const stats = ref({
      pendingInterviews: 3,
      newMessages: 5
    })

    // 雷达图
    const radarRef = ref(null)
    const radarInstance = ref(null)

    const radarOptions = computed(() => ({
      tooltip: {},
      radar: {
        indicator: [
          {name: '技术能力', max: 100},
          {name: '沟通表达', max: 100},
          {name: '问题解决', max: 100},
          {name: '团队协作', max: 100},
          {name: '学习能力', max: 100}
        ],
        splitNumber: 5,
        axisName: {color: '#2d3748', fontSize: 12},
        splitArea: {
          show: true,
          areaStyle: {color: ['rgba(45, 55, 72, 0.08)', 'rgba(45, 55, 72, 0.12)']}
        },
        axisLine: {lineStyle: {color: 'rgba(45, 55, 72, 0.3)'}},
        splitLine: {lineStyle: {color: 'rgba(45, 55, 72, 0.3)'}}
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [85, 78, 82, 75, 88],
              areaStyle: {color: 'rgba(46,204,113,0.35)'},
              lineStyle: {color: 'rgba(46,204,113,0.8)'},
              symbol: 'circle',
              symbolSize: 6
            }
          ]
        }
      ]
    }))

    const initRadar = () => {
      const dom = radarRef.value
      if (!dom) return
      radarInstance.value = echarts.init(dom)
      radarInstance.value.setOption(radarOptions.value)
    }

    const resizeHandler = () => {
      radarInstance.value && radarInstance.value.resize()
    }

    // 最近面试记录
    const recentInterviews = ref([
      {
        id: 1,
        company: '腾讯科技',
        position: '前端开发工程师',
        status: 'completed',
        statusText: '已完成',
        time: '2024-01-15 14:00',
        score: '85'
      },
      {
        id: 2,
        company: '阿里巴巴',
        position: 'Java开发工程师',
        status: 'pending',
        statusText: '待面试',
        time: '2024-01-18 10:00'
      },
      {
        id: 3,
        company: '字节跳动',
        position: '产品经理',
        status: 'completed',
        statusText: '已完成',
        time: '2024-01-12 16:00',
        score: '78'
      }
    ])

    // 学习进度模块已移除

    // AI助手
    const assistantOpen = ref(false)
    const inputMessage = ref('')
    const assistantMessages = ref([])
    const conversationId = ref(`candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const isChatLoading = ref(false)
    const chatMessagesRef = ref(null)

    // 自动滚动到聊天底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTo({
            top: chatMessagesRef.value.scrollHeight,
            behavior: 'smooth'
          })
        }
      })
    }

    const showAssistantDialog = () => {
      assistantOpen.value = true
      nextTick(() => {
        scrollToBottom()
      })
    }

    const closeAssistantDialog = () => {
      assistantOpen.value = false
    }

    const handleSendMessage = async () => {
      if (!inputMessage.value.trim() || isChatLoading.value) return
      
      const userMessageText = inputMessage.value.trim()
      
      // 添加用户消息
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: userMessageText,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      assistantMessages.value.push(userMessage)
      
      // 延迟滚动
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      
      inputMessage.value = ''
      
      isChatLoading.value = true
      
      // 创建AI回复消息（直接显示，不显示思考状态）
      const assistantMessageId = Date.now() + 1
      const assistantMessage = {
        id: assistantMessageId,
        type: 'assistant',
        content: '',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      assistantMessages.value.push(assistantMessage)
      
      try {
        // 调用后端AI聊天接口（流式响应）
        await aiApi.chat({
          conversationId: conversationId.value,
          userMessage: userMessageText,
          taskType: 'GENERAL_CHAT',
          params: {},
          onData: (data) => {
            // 实时更新AI回复内容
            const messageIndex = assistantMessages.value.findIndex(msg => msg.id === assistantMessageId)
            if (messageIndex !== -1) {
              assistantMessages.value[messageIndex].content += data
              // 实时滚动到底部
              nextTick(() => {
                scrollToBottom()
              })
            }
          },
          onComplete: () => {
            // 流式响应完成
            console.log('AI回复完成')
            isChatLoading.value = false
            scrollToBottom()
          },
          onError: (error) => {
            console.error('AI聊天流式响应错误:', error)
            
            // 更新AI回复为错误信息
            const messageIndex = assistantMessages.value.findIndex(msg => msg.id === assistantMessageId)
            if (messageIndex !== -1) {
              let errorContent = '抱歉，我遇到了一些问题，请稍后再试。'
              
              if (error.message.includes('401')) {
                errorContent = '认证失败，请重新登录。'
              } else if (error.message.includes('403')) {
                errorContent = '权限不足，无法访问AI助手。'
              } else if (error.message.includes('500')) {
                errorContent = '服务器内部错误，请稍后再试。'
              } else if (error.message.includes('NetworkError')) {
                errorContent = '网络连接出现问题，请检查网络后重试。'
              }
              
              assistantMessages.value[messageIndex].content = errorContent
            }
            
            isChatLoading.value = false
            scrollToBottom()
          }
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        
        // 更新AI回复为错误信息
        const messageIndex = assistantMessages.value.findIndex(msg => msg.id === assistantMessageId)
        if (messageIndex !== -1) {
          let errorContent = '网络连接出现问题，请检查网络后重试。'
          
          if (error.message.includes('401')) {
            errorContent = '认证失败，请重新登录。'
          } else if (error.message.includes('403')) {
            errorContent = '权限不足，无法访问AI助手。'
          } else if (error.message.includes('500')) {
            errorContent = '服务器内部错误，请稍后再试。'
          }
          
          assistantMessages.value[messageIndex].content = errorContent
        }
        
        isChatLoading.value = false
        scrollToBottom()
      }
    }

    const handleEnterKey = (e) => {
      const hasComposition = e.isComposing || e.keyCode === 229
      if (hasComposition) return
      
      e.preventDefault()
      if (inputMessage.value.trim()) {
        handleSendMessage()
      }
    }

    const handleShiftEnter = () => {
      // 允许Shift+Enter换行
    }

    const clearChat = () => {
      assistantMessages.value = []
      conversationId.value = `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      scrollToBottom()
    }

    // 监听消息变化，自动滚动到底部
    watch(assistantMessages, () => {
      scrollToBottom()
    }, { deep: true })

    // 其他功能
    const currentDate = computed(() => {
      const now = new Date()
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
      })
    })

    const handleGlobalSearch = () => {
      // 全局搜索功能
    }

    const refreshDashboard = () => {
      // 刷新仪表板数据
      stats.value.pendingInterviews = Math.floor(1 + Math.random() * 5)
      stats.value.newMessages = Math.floor(2 + Math.random() * 8)
      radarInstance.value && radarInstance.value.setOption(radarOptions.value)
    }

    const viewAllInterviews = () => {
      router.push('/interview')
    }

    const handleDropdown = (cmd) => {
      if (cmd === 'profile') router.push('/jobseeker/profile')
      if (cmd === 'settings') router.push('/jobseeker/settings')
      if (cmd === 'logout') {
        // 退出登录逻辑
        sessionStorage.removeItem('Authorization')
        router.push('/login')
      }
    }

    onMounted(async () => {
      await nextTick()
      initRadar()
      window.addEventListener('resize', resizeHandler)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler)
      if (radarInstance.value) {
        radarInstance.value.dispose()
      }
    })

    return {
      // 顶部
      globalSearch,
      userInfo,
      userInitial,
      userStatus,
      currentDate,



      // 数据
      userStatistics,
      stats,
      recentInterviews,
      
      // 雷达图
      radarRef,
      refreshDashboard,

      // 功能
      viewAllInterviews,
      handleGlobalSearch,
      handleDropdown,

      // AI助手
      assistantOpen,
      inputMessage,
      assistantMessages,
      isChatLoading,
      chatMessagesRef,
      showAssistantDialog,
      closeAssistantDialog,
      handleSendMessage,
      handleEnterKey,
      handleShiftEnter,
      clearChat,
      sendEnableIcon,
      sendDisableIcon,
      clearChatIcon,
      closeChatIcon
    }
  }
}
</script> 

<style scoped>
:root {
  color-scheme: light;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 确保页面可以滚动 */
html, body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.candidate-cockpit {
  --bg: #f8fafc;
  --panel: rgba(255, 255, 255, 0.8);
  --panel-strong: rgba(255, 255, 255, 0.9);
  --primary: #3b82f6;
  --accent: #22c55e;
  --text: #1a202c;
  --muted: #2d3748;
  background: rgba(248, 250, 252, 0.95);
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
  overflow-y: auto;
  height: 100vh;
  width: 100%; /* 确保宽度不超出 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(120%) blur(14px);
  -webkit-backdrop-filter: saturate(120%) blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
}

/* 顶部栏样式已移除，现在使用全局导航栏 */

/* 主体布局 */
.layout {
  display: flex;
  padding: 16px;
  margin-top: 0;
  min-height: calc(100vh - 64px); /* 调整为全局导航栏高度 */
  overflow: visible;
  width: 100%; /* 确保宽度不超出 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}



.main {
  flex: 1; /* 让主内容区域填充剩余空间 */
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 64px); /* 调整为全局导航栏高度 */
  overflow-y: visible;
  overflow-x: hidden; /* 防止水平滚动 */
  height: auto;
  width: 100%; /* 确保宽度不超出 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text);
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  text-shadow: none;
  letter-spacing: 0.5px;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 100%;
  width: 100%; /* 确保宽度不超出 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.stat-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
}

.stat-svg {
  width: 60px;
  height: 60px;
}

/* 移除SVG图标的背景，但保持原有颜色 */
.stat-svg svg {
  background: transparent !important;
}

/* 移除背景元素，但保持图标本身的颜色 */
.stat-svg svg defs,
.stat-svg svg linearGradient {
  display: none !important;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 15px;
  color: #2d3748;
}

/* 雷达图容器 */
.radar-container {
  padding: 20px;
  height: 400px;
  width: 100%;
}

.radar {
  width: 100%;
  height: 100%;
}

/* 面试记录列表 */
.interview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%; /* 确保宽度不超出 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.interview-item {
  padding: 16px;
  transition: all 0.3s ease;
}

.interview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.interview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.company {
  font-weight: 600;
  color: #1a202c;
  font-size: 16px;
}

.position {
  color: #2d3748;
  font-size: 14px;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.interview-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--muted);
}

.score {
  color: #22c55e;
  font-weight: 500;
}

/* 学习进度模块已移除 */

/* AI助手样式 */
.smart-sidebar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
}

.ai-assistant-bubble {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  transition: all 0.3s ease;
  color: white;
  position: relative;
  right: -30px;
  opacity: 0.6;
}

.ai-assistant-bubble:hover,
.ai-assistant-bubble.active {
  right: 0;
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6);
  opacity: 1;
}

.bubble-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.bubble-text {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
}

/* AI助手面板 */
.ai-assistant-panel {
  position: fixed;
  right: -420px;
  top: 80px;
  width: 400px;
  height: calc(100vh - 100px);
  background: #ffffff;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
}

.ai-assistant-panel.active {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 12px 0 0 0;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.control-icon:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: rgba(139, 92, 246, 0.1);
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
  justify-content: flex-start;
  min-height: 0;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  align-self: center;
  justify-self: center;
  margin: auto;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #8b5cf6;
}

.welcome-text {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  overflow-y: auto;
  max-height: 100%;
  flex: 1;
  min-height: 0;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  background: #8b5cf6;
  color: white;
  border-bottom-right-radius: 6px;
  align-self: flex-end;
  margin-left: auto;
}

.message.assistant .message-content {
  background: #f3f4f6;
  color: #374151;
  border-bottom-left-radius: 6px;
  align-self: flex-start;
}

.assistant-icon {
  margin-right: 6px;
  color: #8b5cf6;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin: 0 4px;
  align-self: flex-end;
}

.panel-input {
  padding: 20px;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 0 0 0 12px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-input {
  flex: 1;
  border: 1px solid #c4b5fd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #374151;
  resize: none;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.5;
}

.chat-input:focus {
  border: 1px solid transparent;
  background: linear-gradient(#ffffff, #ffffff) padding-box,
              linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899) border-box;
  background-size: 200% 100%;
  animation: gradientFlow 2s linear infinite;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

@keyframes gradientFlow {
  0% { background-position: 0 50%; }
  100% { background-position: 200% 50%; }
}

.send-icon {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
}

.send-icon:hover:not(.disabled) {
  transform: translateY(-2px);
}

.send-icon.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

/* 两栏内标题与卡片之间的间距 */
.two-col-grid .section-header {
  margin-bottom: 12px;
}

.two-col-grid .col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 统一两栏内容区域高度（不含各自的标题栏）*/
.two-col-grid .left-col .radar-container,
.two-col-grid .right-col .panel {
  height: 420px;
  position: relative; /* 建立堆叠上下文，避免阴影覆盖造成的视觉重叠 */
  overflow: hidden;
  box-sizing: border-box;
}

/* 面板滚动由内部内容承担，防止溢出重叠 */
.two-col-grid .panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.two-col-grid .panel .interview-list {
  overflow: auto;
  flex: 1;
}

/* 雷达容器内部充满 */
.radar-container { display: flex; flex-direction: column; }
.radar { flex: 1; }

@media (max-width: 1024px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }
  .two-col-grid .left-col .radar-container,
  .two-col-grid .right-col .panel {
    height: auto;
    min-height: 360px;
  }
}
</style> 