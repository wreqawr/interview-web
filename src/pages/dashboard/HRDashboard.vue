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

      <!-- HR助手对话框 -->
      <el-dialog
          v-model="assistantOpen"
          title="HR智能助手"
          width="400px"
          :close-on-click-modal="true"
          :close-on-press-escape="true"
          class="assistant-dialog"
          @close="closeAssistantDialog"
      >
        <div class="assistant-content">
          <div class="chat-messages">
            <div
                v-for="message in assistantMessages"
                :key="message.id"
                class="message"
                :class="message.type"
            >
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
          <div class="quick-templates">
            <h5>快速话术</h5>
            <div class="template-buttons">
              <el-button size="small" @click="useTemplate('interview')">面试邀请</el-button>
              <el-button size="small" @click="useTemplate('rejection')">婉拒通知</el-button>
              <el-button size="small" @click="useTemplate('offer')">Offer通知</el-button>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeAssistantDialog">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import * as echarts from 'echarts'
import {getRoleFeatures} from '@/constants/permissions'


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
      return '示例科技有限公司'
    })

    const userInfo = computed(() => userStore.getUserInfo || userStore.userInfo || {})
    const userInitial = computed(() => {
      const name = userInfo.value.nickname || userInfo.value.username || 'H'
      return name.charAt(0).toUpperCase()
    })

    // 角色功能（左侧菜单）- 使用集中权限映射
    const hrFeatures = computed(() => getRoleFeatures('ROLE_HR'))
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
        axisName: {color: '#cfe6ff', fontSize: 12},
        splitArea: {
          show: true,
          areaStyle: {color: ['rgba(52,152,219,0.08)', 'rgba(52,152,219,0.12)']}
        },
        axisLine: {lineStyle: {color: 'rgba(255,255,255,0.3)'}},
        splitLine: {lineStyle: {color: 'rgba(255,255,255,0.3)'}}
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
    const assistantMessages = ref([
      {
        id: 1,
        type: 'assistant',
        content: '您好！我是您的智能招聘助手，有什么需要帮助的吗？',
        time: '刚刚'
      },
      {
        id: 2,
        type: 'user',
        content: '帮我生成一个前端工程师的面试邀请',
        time: '2分钟前'
      },
      {
        id: 3,
        type: 'assistant',
        content: '好的，我已经为您生成了面试邀请模板，请查看并确认。',
        time: '1分钟前'
      }
    ])

    const showAssistantDialog = () => {
      assistantOpen.value = true
    }

    const closeAssistantDialog = () => {
      assistantOpen.value = false
    }

    const useTemplate = (type) => {
      const templates = {
        interview: '面试邀请模板',
        rejection: '婉拒通知模板',
        offer: 'Offer通知模板'
      }
      // 这里可以集成后端模板系统
      console.log(`使用${templates[type]}`)
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
    const logout = () => {
      router.push('/login')
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
      assistantMessages,
      showAssistantDialog,
      closeAssistantDialog,
      useTemplate,

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
  --bg: #0f172a;
  --panel: rgba(13, 22, 40, 0.4);
  --panel-strong: rgba(13, 22, 40, 0.6);
  --primary: #3b82f6;
  --accent: #22c55e;
  --text: #e5e7eb;
  --muted: #94a3b8;
  background: rgba(15, 23, 42, 0.95); /* 与顶部导航栏背景色保持一致 */
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
}

.glass {
  background: var(--panel);
  backdrop-filter: saturate(120%) blur(14px);
  -webkit-backdrop-filter: saturate(120%) blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  color: #ffffff;
  background: rgba(15, 23, 42, 0.6); /* 改为半透明 */
  backdrop-filter: saturate(120%) blur(20px);
  -webkit-backdrop-filter: saturate(120%) blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 添加微妙的底部边框 */
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2); /* 调整阴影效果 */
  height: 60px; /* 调整导航栏高度到60px */
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
  color: #ffffff;
}

.company .meta {
  font-size: 12px;
  color: #cbd5e1;
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
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
}

.today {
  color: #cbd5e1;
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
  padding: 12px;
  color: var(--text);
  position: sticky;
  top: 80px; /* 调整为与顶部导航栏高度一致 */
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.aside-title {
  font-size: 14px;
  color: var(--muted);
  margin: 4px 8px 8px;
}

.menu {
  background: transparent;
  border-right: none;
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
  font-size: 16px;
  font-weight: 600;
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
  padding: 12px;
}

.kanban-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.kanban-header .title {
  font-size: 14px;
  color: var(--text);
}

.kanban-header .count {
  font-size: 12px;
  color: var(--muted);
}

.kanban-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 120px;
}

.kanban-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  transition: transform .2s ease;
}

.kanban-card:hover {
  transform: translateY(-2px);
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
}

.meta {
  font-size: 12px;
  color: var(--muted);
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.18);
  color: #cfe6ff;
  border: 1px solid rgba(59, 130, 246, 0.28);
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

/* HR助手对话框样式 */
.assistant-dialog {
  border-radius: 12px;
}

.assistant-content {
  max-height: 400px;
  overflow-y: auto;
}

.chat-messages {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 8px;
}

.message-content {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.message-time {
  font-size: 12px;
  color: #7f8c8d;
}

.quick-templates h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #2c3e50;
}

.template-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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