<template>
  <div class="hr-cockpit">
    <!-- 顶部固定导航栏 -->
    <header class="topbar glass">
      <div class="left">
        <img class="logo" src="@/assets/logo.png" alt="logo"/>
        <div class="company">
          <div class="name">{{ companyName }}</div>
        </div>
      </div>
      <div class="center">
        <el-input
            v-model="globalSearch"
            class="search"
            placeholder="搜索候选人 / 岗位 / 关键词"
            clearable
            @keyup.enter="handleGlobalSearch"
        >
          <template #prefix>🔎</template>
        </el-input>
      </div>
      <div class="right">
        <div class="quick-indicators">
          <el-badge :value="stats.pendingResumes" class="item" type="danger">
            <span class="indicator">待处理简历</span>
          </el-badge>
          <el-badge :value="stats.todayInterviews" class="item" type="warning">
            <span class="indicator">今日面试</span>
          </el-badge>
          <div class="today">{{ currentDate }}</div>
        </div>
        <el-dropdown @command="handleDropdown">
          <span class="profile">
            <el-avatar size="small">{{ userInitial }}</el-avatar>
            <span class="username">{{ userInfo.nickname || userInfo.username || 'HR' }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="report">我的报告</el-dropdown-item>
              <el-dropdown-item command="settings">通知设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="layout">
      <!-- 左侧功能菜单 -->
      <aside class="aside glass">
        <div class="aside-title">功能菜单</div>
        <el-menu class="menu" :default-active="activeMenu" @select="handleMenuSelect">
          <el-menu-item v-for="item in hrFeatures" :key="item.key" :index="item.key">
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 中央主工作区 -->
      <main class="main">
        <!-- 核心数据仪表盘 -->
        <section class="section">
          <div class="section-header">
            <h2>招聘效能矩阵</h2>
            <div class="actions">
              <el-button size="small" type="primary" plain @click="refreshDashboard">刷新</el-button>
            </div>
          </div>
          <div class="grid-2">
            <div class="panel glass" ref="radarPanel">
              <div class="panel-title">5项核心指标雷达图</div>
              <div class="radar" ref="radarRef"></div>
            </div>
            <div class="panel glass">
              <div class="panel-title">实时数据卡片</div>
              <div class="cards">
                <div class="card">
                  <div class="label">今日新增简历</div>
                  <div class="value">{{ realtime.todayNewResumes }}</div>
                </div>
                <div class="card">
                  <div class="label">待处理数量</div>
                  <div class="value">{{ stats.pendingResumes }}</div>
                </div>
                <div class="card">
                  <div class="label">今日面试安排</div>
                  <div class="value">{{ stats.todayInterviews }}</div>
                </div>
                <div class="card">
                  <div class="label">活跃岗位</div>
                  <div class="value">{{ stats.activeJobs }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 动态任务流水线（看板） -->
        <section class="section">
          <div class="section-header">
            <h2>动态任务流水线</h2>
            <div class="actions">
              <el-switch v-model="kanbanCompact" active-text="紧凑" inactive-text="舒展"/>
            </div>
          </div>
          <div class="kanban" :class="{ compact: kanbanCompact }">
            <div
                v-for="column in kanbanColumns"
                :key="column.key"
                class="kanban-column glass"
                @dragover.prevent
                @drop="onDrop(column.key)"
            >
              <div class="kanban-header">
                <div class="title">{{ column.title }}</div>
                <div class="count">{{ kanban[column.key].length }}</div>
              </div>
              <div class="kanban-list">
                <div
                    v-for="card in kanban[column.key]"
                    :key="card.id"
                    class="kanban-card"
                    draggable="true"
                    @dragstart="onDragStart(card, column.key)"
                >
                  <div class="card-top">
                    <img class="avatar" :alt="card.name" :src="card.avatar"/>
                    <div class="info">
                      <div class="name">{{ card.name }}</div>
                      <div class="meta">{{ card.position }} · 匹配度 {{ card.match }}%</div>
                    </div>
                    <span class="tag" :class="card.urgency">{{ urgencyMap[card.urgency] }}</span>
                  </div>
                  <div class="card-tags">
                    <span class="badge" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 快速操作区 -->
        <section class="section quick-actions">
          <div class="section-header">
            <h2>快速操作</h2>
          </div>
          <div class="quick-grid">
            <el-button type="primary" @click="startAIScreening">🤖 AI智能筛选</el-button>
            <el-button type="success" @click="batchInvite">📨 批量面试邀请</el-button>
            <el-button type="warning" @click="generateReport">📊 报告生成</el-button>
            <el-button type="info" @click="openTemplates">🧩 模板管理</el-button>
          </div>
        </section>

        <!-- 底部资源中心 -->
        <section class="section">
          <div class="section-header">
            <h2>资源中心</h2>
          </div>
          <div class="resource-grid">
            <div class="resource glass" @click="goToResource('jd')">
              <div class="title">岗位JD生成器</div>
              <div class="desc">快速生成岗位说明书</div>
            </div>
            <div class="resource glass" @click="goToResource('qbank')">
              <div class="title">面试题套餐</div>
              <div class="desc">按岗位定制题库</div>
            </div>
            <div class="resource glass" @click="goToResource('eval')">
              <div class="title">评估报告模板</div>
              <div class="desc">标准化评估输出</div>
            </div>
            <div class="resource glass" @click="goToResource('watch')">
              <div class="title">关注列表</div>
              <div class="desc">重点候选人与关键岗位</div>
            </div>
            <div class="resource glass" @click="goToResource('market')">
              <div class="title">竞品监控</div>
              <div class="desc">行业动态与人才趋势</div>
            </div>
            <div class="resource glass" @click="goToResource('shortcuts')">
              <div class="title">快捷入口</div>
              <div class="desc">常用功能快速访问</div>
            </div>
          </div>
        </section>
      </main>

      <!-- 右侧智能助手悬浮 -->
      <div class="smart-sidebar">
        <!-- HR助手悬浮气泡 -->
        <div
            class="hr-assistant-bubble"
            :class="{ active: assistantOpen }"
            @click="showAssistantDialog"
        >
          <div class="bubble-icon">
            💬
          </div>
          <div class="bubble-text">HR助手</div>
        </div>
      </div>

      <!-- HR助手对话框 - 右侧弹出面板 -->
      <div class="hr-assistant-panel" :class="{ active: assistantOpen }">
        <div class="panel-header">
          <div class="header-left">
            <h3>HR智能助手</h3>
          </div>
          <div class="header-controls">
            <img 
              :src="clearChatIcon"
              alt="清空聊天"
              class="control-icon"
              @click="clearChat"
              title="清空聊天"
            />
            <img 
              :src="closeChatIcon"
              alt="关闭"
              class="control-icon"
              @click="closeAssistantDialog"
              title="关闭"
            />
          </div>
        </div>
        
        <div class="panel-content">
          <div class="welcome-message" v-if="assistantMessages.length === 0">
            <div class="welcome-icon">⭐</div>
            <div class="welcome-text">您好！我是您的智能招聘助手</div>
            <div class="welcome-subtitle">有什么需要帮助的吗？</div>
          </div>
          
          <div class="chat-messages" v-if="assistantMessages.length > 0" ref="chatMessagesRef">
            <div
                v-for="message in assistantMessages"
                :key="message.id"
                class="message"
                :class="message.type"
            >
              <div class="message-content">
                <span v-if="message.type === 'assistant'" class="assistant-icon">⭐</span>
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
    
    <!-- 公告弹窗 -->
    <div v-if="announcementVisible" class="announcement-overlay" @click="closeAnnouncement">
      <div class="announcement-modal" @click.stop>
        <div class="announcement-header">
          <h3>📢 系统公告</h3>
          <button class="close-btn" @click="closeAnnouncement">✕</button>
        </div>
        <div class="announcement-content">
          <div class="announcement-icon">🎉</div>
          <div class="announcement-title">本次新增功能</div>
          <div class="announcement-text">HR智能助手</div>
          <div class="announcement-description">
            全新的AI智能助手，为您提供专业的HR咨询服务！
          </div>
        </div>
        <div class="announcement-footer">
          <button class="confirm-btn" @click="closeAnnouncement">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import * as echarts from 'echarts'
// 移除对getRoleFeatures的导入，改为使用用户状态管理器
import {LOGOUT_URL} from '@/api/endpoints'
import sendEnableIcon from '@/assets/chat/send-enable.svg'
import sendDisableIcon from '@/assets/chat/send-disable.svg'
import clearChatIcon from '@/assets/chat/clear-chat.svg'
import closeChatIcon from '@/assets/chat/close-chat.svg'
import { aiApi } from '@/api/ai'



export default {
  name: 'HRDashboard',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

    // 顶部状态栏
    const globalSearch = ref('')
    const companyName = computed(() => {
      // 优先从JWT中获取公司名称
      if (userStore.getUserInfo?.company?.companyName) {
        return userStore.getUserInfo.company.companyName
      }
      // 备用方案：从用户信息中获取
      if (userStore.userInfo?.company?.companyName) {
        return userStore.userInfo.company.companyName
      }
      // 最后备用：显示默认名称
      return ''
    })

    const userInfo = computed(() => userStore.getUserInfo || userStore.userInfo || {})
    const userInitial = computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || 'H'
      return name.charAt(0).toUpperCase()
    })

    // 角色功能（左侧菜单）- 使用用户状态管理器
    const hrFeatures = computed(() => userStore.userFeatures)
    const activeMenu = ref(hrFeatures.value[0]?.key || 'resume_screening')
    const handleMenuSelect = (key) => {
      activeMenu.value = key
      // 这里可以根据key切换主工作区视图；当前为统一仪表盘视图
    }

    // 仪表盘数据
    const stats = ref({
      pendingResumes: 12,
      todayInterviews: 5,
      monthlyProgress: 78,
      activeJobs: 8
    })
    const realtime = ref({
      todayNewResumes: 9
    })

    // 雷达图
    const radarRef = ref(null)
    const radarInstance = ref(null)
    const radarPanel = ref(null)

    const radarOptions = computed(() => ({
      tooltip: {},
      radar: {
        indicator: [
          {name: '岗位缺口预警率', max: 100},
          {name: '人才库健康度', max: 100},
          {name: '面试漏斗转化率', max: 100},
          {name: '招聘效率指标', max: 100},
          {name: '人才质量评分', max: 100}
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
              value: [72, 66, 58, 74, 81],
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

    const refreshDashboard = async () => {
      // 模拟刷新
      realtime.value.todayNewResumes = Math.floor(5 + Math.random() * 12)
      stats.value.pendingResumes = Math.floor(8 + Math.random() * 20)
      stats.value.todayInterviews = Math.floor(3 + Math.random() * 10)
      radarInstance.value && radarInstance.value.setOption(radarOptions.value)
    }

    // 看板数据与拖拽
    const kanbanColumns = [
      {key: 'inbox', title: '新简历堆'},
      {key: 'ai', title: 'AI初筛'},
      {key: 'eval', title: '面试评估'},
      {key: 'offer', title: 'Offer待签发'}
    ]

    const kanban = ref({
      inbox: [
        {
          id: 1,
          name: '王小明',
          position: '前端开发',
          match: 86,
          urgency: 'high',
          tags: ['React', '3年', '本科'],
          avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 2,
          name: '李华',
          position: '后端工程师',
          match: 78,
          urgency: 'medium',
          tags: ['Java', '5年'],
          avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
        }
      ],
      ai: [
        {
          id: 3,
          name: '赵强',
          position: '测试工程师',
          match: 73,
          urgency: 'low',
          tags: ['自动化', 'Python'],
          avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
        }
      ],
      eval: [
        {
          id: 4,
          name: '陈静',
          position: '产品经理',
          match: 81,
          urgency: 'medium',
          tags: ['需求分析'],
          avatar: 'https://avatars.githubusercontent.com/u/4?v=4'
        }
      ],
      offer: []
    })

    const dragState = ref({card: null, from: null})
    const urgencyMap = {high: '高', medium: '中', low: '低'}

    const onDragStart = (card, fromKey) => {
      dragState.value = {card, from: fromKey}
    }

    const onDrop = (toKey) => () => {
      const {card, from} = dragState.value
      if (!card || !from || from === toKey) return
      kanban.value[from] = kanban.value[from].filter((c) => c.id !== card.id)
      kanban.value[toKey] = [card, ...kanban.value[toKey]]
      dragState.value = {card: null, from: null}
    }

    // 快速操作
    const startAIScreening = () => {
      // 可跳转至现有页面：简历管理
      router.push('/resume/management')
    }
    const batchInvite = () => {
      // 示例：打开面试列表
      router.push('/interview')
    }
    const generateReport = () => {
      router.push('/report')
    }
    const openTemplates = () => {
      // 当前无路由，保留为占位
    }

    // 智能助手
    const assistantOpen = ref(false)
    const inputMessage = ref('')
    const assistantMessages = ref([])
    const conversationId = ref(`hr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const isChatLoading = ref(false)
    const chatMessagesRef = ref(null) // 新增：用于引用聊天消息区域
    
    // 公告弹窗
    const announcementVisible = ref(false)

    // 自动滚动到聊天底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          console.log('执行滚动到底部，当前scrollHeight:', chatMessagesRef.value.scrollHeight)
          // 使用平滑滚动效果
          chatMessagesRef.value.scrollTo({
            top: chatMessagesRef.value.scrollHeight,
            behavior: 'smooth'
          })
          
          // 备用方案：如果scrollTo不支持，使用scrollTop
          setTimeout(() => {
            if (chatMessagesRef.value) {
              chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
              console.log('备用滚动完成，scrollTop设置为:', chatMessagesRef.value.scrollTop)
            }
          }, 100)
        } else {
          console.log('chatMessagesRef未找到')
        }
      })
    }

    const showAssistantDialog = () => {
      assistantOpen.value = true
      
      // 对话框打开后滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
    }
    
    const showAnnouncement = () => {
      announcementVisible.value = true
    }
    
    const closeAnnouncement = () => {
      announcementVisible.value = false
    }

    const closeAssistantDialog = () => {
      assistantOpen.value = false
    }

    const handleSendMessage = async () => {
      if (!inputMessage.value.trim() || isChatLoading.value) return
      
      const userMessageText = inputMessage.value.trim()
      
      // 添加用户消息到聊天框
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: userMessageText,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      assistantMessages.value.push(userMessage)
      
      // 滚动到用户消息 - 添加延迟确保DOM更新
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      
      // 清空输入框
      inputMessage.value = ''
      
      // 设置加载状态
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
      // 检查是否有输入法候选项
      const hasComposition = e.isComposing || e.keyCode === 229
      
      // 如果有输入法候选项，不阻止默认行为，让输入法处理
      if (hasComposition) {
        return
      }
      
      // 如果没有输入法候选项，则发送消息
      e.preventDefault()
      if (inputMessage.value.trim()) {
        handleSendMessage()
      }
    }

    const handleShiftEnter = () => {
      // 允许Shift+Enter换行，不做任何处理
      // 或者可以在这里添加换行逻辑
    }

    const clearChat = () => {
      // 清空聊天记录
      assistantMessages.value = []
      // 重置对话ID
      conversationId.value = `hr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      scrollToBottom() // 清空聊天后滚动到底部
    }
    
    // 其他
    const currentDate = computed(() => {
      const now = new Date()
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
      })
    })

    const handleGlobalSearch = () => {
      // 根据关键字联动看板或跳转到列表页，这里保持占位
    }

    const goTo = (path) => router.push(path)
    const openSettings = () => {
    }
    const logout = async () => {
      try {
        // 调用退出登录接口
        const response = await fetch(LOGOUT_URL, {
          method: 'POST',
          headers: {
            'Authorization': sessionStorage.getItem('Authorization') || '',
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          
          if (result.code === 200) {
            // 退出成功，清除JWT并跳转
            console.log('退出登录成功:', result.message)
            sessionStorage.removeItem('Authorization')
            router.push('/login')
          } else {
            // 退出失败，显示错误信息
            console.warn('退出登录失败:', result.message)
            alert(`退出登录失败: ${result.message}`)
          }
        } else {
          console.warn('退出登录请求失败:', response.status)
          alert('退出登录请求失败，请重试')
        }
      } catch (error) {
        console.error('退出登录异常:', error)
        alert('退出登录异常，请重试')
      }
    }

    const goToResource = (key) => {
      // 资源中心占位跳转/操作
      switch (key) {
        case 'jd':
          activeMenu.value = 'position_management'
          break
        case 'qbank':
          activeMenu.value = 'interview_management'
          break
        default:
          break
      }
    }

    const handleDropdown = (cmd) => {
      if (cmd === 'report') return goTo('/report')
      if (cmd === 'settings') return openSettings()
      if (cmd === 'logout') return logout()
    }

    // 修复滚动问题的函数
    const fixScrollIssues = () => {
      // 强制重新计算布局
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'

      // 确保主容器可以滚动
      const mainContainer = document.querySelector('.main')
      if (mainContainer) {
        mainContainer.style.overflowY = 'auto'
        mainContainer.style.height = 'auto'
      }

      // 确保左侧边栏可以滚动
      const asideContainer = document.querySelector('.aside')
      if (asideContainer) {
        asideContainer.style.overflowY = 'auto'
        asideContainer.style.height = 'auto'
      }

      // 强制触发重排
      window.dispatchEvent(new Event('resize'))

      console.log('滚动问题修复完成')
    }

    // 监听消息变化，自动滚动到底部
    watch(assistantMessages, () => {
      scrollToBottom()
    }, { deep: true })

    onMounted(async () => {
      await nextTick()
      initRadar()
      window.addEventListener('resize', resizeHandler)

      // 强制修复滚动问题
      setTimeout(() => {
        fixScrollIssues()
      }, 100)

      // 再次确保滚动正常
      setTimeout(() => {
        fixScrollIssues()
      }, 500)
      
      // 显示公告弹窗
      setTimeout(() => {
        showAnnouncement()
      }, 1000)
    })

    // 监听路由变化，确保每次进入页面都能正常滚动
    watch(() => route.path, () => {
      nextTick(() => {
        setTimeout(() => {
          fixScrollIssues()
        }, 100)
      })
    }, {immediate: true})

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler)
      if (radarInstance.value) {
        radarInstance.value.dispose()
      }
    })

    return {
      // 顶部
      globalSearch,
      companyName,
      userInfo,
      userInitial,
      currentDate,

      // 菜单
      hrFeatures,
      activeMenu,
      handleMenuSelect,

      // 仪表盘
      stats,
      realtime,
      refreshDashboard,
      radarRef,
      radarPanel,

      // 看板
      kanban,
      kanbanColumns,
      kanbanCompact: ref(false),
      onDragStart,
      onDrop,
      urgencyMap,

      // 快速操作
      startAIScreening,
      batchInvite,
      generateReport,
      openTemplates,

      // 助手
      assistantOpen,
      inputMessage,
      assistantMessages,
      isChatLoading,
      showAssistantDialog,
      closeAssistantDialog,
      handleSendMessage,
      handleEnterKey,
      handleShiftEnter,
      clearChat,
      sendEnableIcon,
      sendDisableIcon,
      clearChatIcon,
      closeChatIcon,
      chatMessagesRef, // 新增：暴露给模板
      
      // 公告弹窗
      announcementVisible,
      showAnnouncement,
      closeAnnouncement,

      // 其他
      handleGlobalSearch,
      goTo,
      openSettings,
      logout,
      goToResource,
      handleDropdown
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

.hr-cockpit {
  --bg: #f8fafc;
  --panel: rgba(255, 255, 255, 0.8);
  --panel-strong: rgba(255, 255, 255, 0.9);
  --primary: #3b82f6;
  --accent: #22c55e;
  --text: #1a202c;
  --muted: #2d3748;
  background: rgba(248, 250, 252, 0.95);
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
}

.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(120%) blur(14px);
  -webkit-backdrop-filter: saturate(120%) blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
}

/* 顶部栏 */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  padding: 10px 24px;
  margin: 0;
  color: #1a202c;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(120%) blur(20px);
  -webkit-backdrop-filter: saturate(120%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  height: 60px;
}

.topbar .left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.company .name {
  font-weight: 600;
  color: #1a202c;
}

.company .meta {
  font-size: 12px;
  color: #2d3748;
}

.topbar .center {
  padding: 0 12px;
}

.topbar .right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.quick-indicators {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-indicators .indicator {
  color: #1a202c;
  font-size: 12px;
  font-weight: 500;
}

.today {
  color: #2d3748;
  font-size: 12px;
}

.profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
}

/* 主体布局 */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr 0; /* 右侧悬浮独立定位，因此列宽为0 */
  gap: 16px;
  padding: 16px;
  margin-top: 0; /* 移除顶部间距，让内容紧贴导航栏 */
  min-height: calc(100vh - 80px);
  overflow: visible;
}

.aside {
  height: calc(100vh - 100px);
  padding: 16px;
  color: var(--text);
  position: sticky;
  top: 80px;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: saturate(120%) blur(20px);
  -webkit-backdrop-filter: saturate(120%) blur(20px);
}

.aside-title {
  font-size: 16px;
  color: #1a202c;
  margin: 8px 8px 16px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-align: center;
  padding: 12px 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-shadow: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.menu {
  background: transparent;
  border-right: none;
}

/* 左侧菜单样式优化 - 提高字体可见性 */

/* 确保菜单项有足够的间距和可读性 */

.menu :deep(.el-menu-item span) {
  font-size: 15px;
  letter-spacing: 0.6px;
  font-weight: 500;
  color: #2d3748;
  text-shadow: none;
  transition: all 0.3s ease;
}

.menu :deep(.el-menu-item:hover span) {
  color: #1a202c;
  text-shadow: none;
}

.menu :deep(.el-menu-item.is-active span) {
  color: #1a202c;
  font-weight: 600;
  text-shadow: none;
}

/* 添加菜单项之间的分隔线 */

/* 移除Element Plus默认的菜单样式 */

/* 为菜单添加整体容器样式 */
.menu {
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 添加菜单项的图标样式（如果有的话） */
.menu :deep(.el-menu-item i) {
  color: #2d3748;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.menu :deep(.el-menu-item:hover i) {
  color: #1a202c;
}

.menu :deep(.el-menu-item.is-active i) {
  color: #3b82f6;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 100px);
  overflow-y: visible;
  height: auto;
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

.grid-2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.panel {
  padding: 14px;
  color: var(--text);
}

.panel-title {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 10px;
}

.radar {
  width: 100%;
  height: 320px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
}

.card .label {
  color: var(--muted);
  font-size: 12px;
}

.card .value {
  font-size: 22px;
  font-weight: 700;
  color: #e2f9ee;
}

/* 看板 */
.kanban {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kanban.compact .kanban-card {
  padding: 10px;
}

.kanban-column {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.kanban-column:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.kanban-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.kanban-header .title {
  font-size: 15px;
  color: #1a202c;
  font-weight: 600;
  text-shadow: none;
}

.kanban-header .count {
  font-size: 13px;
  color: #2d3748;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.kanban-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 120px;
}

.kanban-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.kanban-card:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #1a202c;
  font-size: 14px;
  text-shadow: none;
  margin-bottom: 2px;
}

.meta {
  font-size: 13px;
  color: #2d3748;
  font-weight: 500;
  text-shadow: none;
}

.tag {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 500;
  text-shadow: none;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.badge {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.25);
  color: #1a202c;
  border: 1px solid rgba(59, 130, 246, 0.35);
  font-weight: 500;
  text-shadow: none;
  transition: all 0.2s ease;
}

.badge:hover {
  background: rgba(59, 130, 246, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

/* 快速操作区 */
.quick-actions .quick-grid {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 12px;
}

/* 资源中心 */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.resource {
  padding: 14px;
  cursor: pointer;
  transition: transform .2s ease;
  color: var(--text);
}

.resource:hover {
  transform: translateY(-2px);
}

.resource .title {
  font-weight: 600;
}

.resource .desc {
  font-size: 12px;
  color: var(--muted);
}

/* 智能助手 */
.smart-sidebar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
}

/* HR助手悬浮气泡 */
.hr-assistant-bubble {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
  transition: all 0.3s ease;
  color: white;
  position: relative;
  right: -30px; /* 默认只露出一半 */
  opacity: 0.6; /* 默认半透明 */
}

.hr-assistant-bubble:hover,
.hr-assistant-bubble.active {
  right: 0; /* 悬浮时完全显示 */
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(64, 158, 255, 0.6);
  opacity: 1; /* 悬浮或激活时不透明 */
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

/* HR助手右侧弹出面板样式 */
.hr-assistant-panel {
  position: fixed;
  right: -420px; /* 默认隐藏在右侧 */
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

.hr-assistant-panel.active {
  right: 0;
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 12px 0 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
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
  display: block;
  vertical-align: middle;
}

.control-icon:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: rgba(59, 130, 246, 0.1);
}

/* 面板内容 */
.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 移除居中对齐，让聊天消息正常显示 */
  align-items: stretch;
  justify-content: flex-start;
  min-height: 0; /* 确保flex子元素可以正确收缩 */
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 40px 20px;
  /* 当有欢迎消息时，让它居中显示 */
  align-self: center;
  justify-self: center;
  margin: auto;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #3b82f6;
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

/* 聊天消息 */
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  /* 确保聊天消息区域可以滚动 */
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
  background: #3b82f6;
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

/* 输入区域 */
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
  border: 1px solid #93c5fd;
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



.send-icon:active:not(.disabled) {
  transform: translateY(0);
}

.send-icon.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 公告弹窗样式 */
.announcement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.announcement-modal {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 0;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: announcementSlideIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

.announcement-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
  z-index: -1;
}

@keyframes announcementSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.announcement-header {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 24px 16px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.announcement-header h3 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.announcement-content {
  padding: 32px 24px;
  text-align: center;
  color: white;
}

.announcement-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.announcement-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  opacity: 0.9;
}

.announcement-text {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.announcement-description {
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.5;
}

.announcement-footer {
  padding: 16px 24px 24px;
  text-align: center;
}

.confirm-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 加载状态样式 */
.chat-input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.chat-input:disabled::placeholder {
  color: #d1d5db;
}





/* 过渡 */

/* 响应式 */
@media (max-width: 1200px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .kanban {
    grid-template-columns: repeat(2, 1fr);
  }

  .resource-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1400px) {
  .smart-sidebar {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .main {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .aside {
    position: static;
    height: auto;
  }

  .kanban {
    grid-template-columns: 1fr;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style> 