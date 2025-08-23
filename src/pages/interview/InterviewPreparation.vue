<template>
  <div class="interview-preparation-page">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">AI Interview Coach</span>
        </div>
      </div>
      <div class="navbar-right">
        <el-menu mode="horizontal" :default-active="activeMenu" @select="handleMenuSelect">
          <el-menu-item index="history">
            <el-icon><Clock /></el-icon>
            <span>历史记录</span>
          </el-menu-item>
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
          <el-menu-item index="help">
            <el-icon><QuestionFilled /></el-icon>
            <span>帮助</span>
          </el-menu-item>
        </el-menu>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 欢迎区域 -->
      <section class="welcome-section">
        <h1 class="main-title">准备好迎接你的下一次机会了吗？</h1>
        <p class="subtitle">选择下方的选项，开始一场为你量身定制的模拟面试吧</p>
        <div class="welcome-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
        </div>
      </section>

      <!-- 面试配置卡片 -->
      <section class="configuration-section">
        <div class="config-card">
          <div class="card-header">
            <h2>面试配置</h2>
            <p>根据你的需求定制面试体验</p>
          </div>
          
          <div class="config-form">
            <!-- 职位选择 -->
            <div class="form-group">
              <label class="form-label">
                <el-icon><Briefcase /></el-icon>
                目标职位
              </label>
              <el-select
                v-model="interviewConfig.position"
                placeholder="请选择目标职位"
                size="large"
                class="form-select"
                filterable
                allow-create
                @change="handlePositionChange"
              >
                <el-option
                  v-for="position in positionOptions"
                  :key="position.value"
                  :label="position.label"
                  :value="position.value"
                >
                  <div class="position-option">
                    <span class="position-icon">{{ position.icon }}</span>
                    <span class="position-label">{{ position.label }}</span>
                    <span class="position-desc">{{ position.description }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>

            <!-- 面试类型选择 -->
            <div class="form-group">
              <label class="form-label">
                <el-icon><ChatDotRound /></el-icon>
                面试类型
              </label>
              <div class="interview-type-tabs">
                <el-radio-group v-model="interviewConfig.type" @change="handleTypeChange">
                  <el-radio-button 
                    v-for="type in interviewTypes" 
                    :key="type.value" 
                    :label="type.value"
                    class="type-radio"
                  >
                    <div class="type-content">
                      <span class="type-icon">{{ type.icon }}</span>
                      <span class="type-name">{{ type.name }}</span>
                      <span class="type-desc">{{ type.description }}</span>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <!-- 难度选择 -->
            <div class="form-group">
              <label class="form-label">
                <el-icon><TrendCharts /></el-icon>
                难度级别
              </label>
              <div class="difficulty-selector">
                <el-radio-group v-model="interviewConfig.difficulty" @change="handleDifficultyChange">
                  <el-radio-button 
                    v-for="level in difficultyLevels" 
                    :key="level.value" 
                    :label="level.value"
                    class="difficulty-radio"
                  >
                    <div class="difficulty-content">
                      <span class="difficulty-icon">{{ level.icon }}</span>
                      <span class="difficulty-name">{{ level.name }}</span>
                      <span class="difficulty-desc">{{ level.description }}</span>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <!-- AI面试官选择 -->
            <div class="form-group">
              <label class="form-label">
                <el-icon><UserFilled /></el-icon>
                选择你的面试官
              </label>
              <div class="interviewer-selection">
                <div 
                  v-for="interviewer in interviewers" 
                  :key="interviewer.id"
                  class="interviewer-option"
                  :class="{ active: interviewConfig.interviewer === interviewer.id }"
                  @click="selectInterviewer(interviewer.id)"
                >
                  <div class="interviewer-avatar">
                    <span class="avatar-emoji">{{ interviewer.avatar }}</span>
                  </div>
                  <div class="interviewer-info">
                    <h4 class="interviewer-name">{{ interviewer.name }}</h4>
                    <p class="interviewer-style">{{ interviewer.style }}</p>
                    <p class="interviewer-desc">{{ interviewer.description }}</p>
                  </div>
                  <div class="selection-indicator">
                    <el-icon v-if="interviewConfig.interviewer === interviewer.id"><Select /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 准备区 -->
      <section class="preparation-section">
        <div class="preparation-grid">
          <!-- 可能问到的问题 -->
          <div class="prep-card questions-card">
            <div class="card-header">
              <h3>
                <el-icon><QuestionFilled /></el-icon>
                可能问到的问题
              </h3>
              <el-button 
                type="text" 
                @click="questionsExpanded = !questionsExpanded"
                class="expand-btn"
              >
                {{ questionsExpanded ? '收起' : '展开' }}
                <el-icon><ArrowDown v-if="!questionsExpanded" /><ArrowUp v-else /></el-icon>
              </el-button>
            </div>
            <el-collapse-transition>
              <div v-show="questionsExpanded" class="questions-content">
                <div 
                  v-for="(question, index) in sampleQuestions" 
                  :key="index"
                  class="question-item"
                >
                  <div class="question-number">{{ index + 1 }}</div>
                  <div class="question-text">{{ question }}</div>
                </div>
              </div>
            </el-collapse-transition>
          </div>

          <!-- 面试技巧提示 -->
          <div class="prep-card tips-card">
            <div class="card-header">
              <h3>
                <el-icon><Light /></el-icon>
                面试技巧提示
              </h3>
            </div>
            <div class="tips-content">
              <div 
                v-for="(tip, index) in interviewTips" 
                :key="index"
                class="tip-item"
              >
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                  <h4 class="tip-title">{{ tip.title }}</h4>
                  <p class="tip-desc">{{ tip.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 行动按钮 -->
      <section class="action-section">
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large" 
            class="start-interview-btn"
            :disabled="!canStartInterview"
            @click="startInterview"
          >
            <el-icon><VideoPlay /></el-icon>
            开始模拟面试
          </el-button>
          
          <el-button 
            type="success" 
            size="large" 
            class="preview-btn"
            @click="previewInterview"
          >
            <el-icon><View /></el-icon>
            预览面试流程
          </el-button>
        </div>
        <p class="action-hint">请确保已选择所有必要的配置项</p>
      </section>

      <!-- 设备检测提示 -->
      <section class="device-check-section">
        <div class="device-check-card">
          <div class="check-header">
            <el-icon><VideoCamera /></el-icon>
            <span>设备检测</span>
          </div>
          <div class="check-content">
            <div class="check-item">
              <el-icon :class="{ 'check-success': micWorking, 'check-error': !micWorking }">
                <component :is="micWorking ? 'Check' : 'Close'" />
              </el-icon>
              <span>麦克风 {{ micWorking ? '正常' : '异常' }}</span>
            </div>
            <div class="check-item">
              <el-icon :class="{ 'check-success': cameraWorking, 'check-error': !cameraWorking }">
                <component :is="cameraWorking ? 'Check' : 'Close'" />
              </el-icon>
              <span>摄像头 {{ cameraWorking ? '正常' : '异常' }}</span>
            </div>
          </div>
          <p class="device-note">开始前请确保你的麦克风和摄像头工作正常</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Clock, User, QuestionFilled, Briefcase, ChatDotRound, TrendCharts,
  UserFilled, Select, ArrowDown, ArrowUp, Light, VideoPlay,
  VideoCamera, View
} from '@element-plus/icons-vue'

const router = useRouter()

// 导航菜单
const activeMenu = ref('home')

// 面试配置
const interviewConfig = ref({
  position: '',
  type: 'technical',
  difficulty: 'intermediate',
  interviewer: 'professional'
})

// 展开状态
const questionsExpanded = ref(false)

// 设备状态
const micWorking = ref(false)
const cameraWorking = ref(false)

// 职位选项
const positionOptions = ref([
  { value: 'frontend', label: '前端开发工程师', icon: '💻', description: '负责用户界面开发' },
  { value: 'backend', label: '后端开发工程师', icon: '⚙️', description: '负责服务器端逻辑' },
  { value: 'fullstack', label: '全栈工程师', icon: '🔄', description: '前后端全栈开发' },
  { value: 'product', label: '产品经理', icon: '📋', description: '负责产品规划与管理' },
  { value: 'data', label: '数据分析师', icon: '📊', description: '负责数据分析与洞察' },
  { value: 'uiux', label: 'UI/UX设计师', icon: '🎨', description: '负责用户体验设计' },
  { value: 'qa', label: '测试工程师', icon: '🔍', description: '负责质量保证' },
  { value: 'devops', label: 'DevOps工程师', icon: '🚀', description: '负责运维与部署' }
])

// 面试类型
const interviewTypes = ref([
  { value: 'technical', name: '技术面试', icon: '⚡', description: '专业技能与知识考察' },
  { value: 'behavioral', name: '行为面试', icon: '👥', description: '个人经历与行为模式' },
  { value: 'comprehensive', name: '综合面试', icon: '🎯', description: '技术+行为综合考察' },
  { value: 'stress', name: '压力面试', icon: '🔥', description: '高压环境下的表现' }
])

// 难度级别
const difficultyLevels = ref([
  { value: 'junior', name: '初级', icon: '🌱', description: '校招/应届生水平' },
  { value: 'intermediate', name: '中级', icon: '🌿', description: '社招/有经验水平' },
  { value: 'senior', name: '高级', icon: '🌳', description: '专家/资深水平' }
])

// AI面试官
const interviewers = ref([
  {
    id: 'professional',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
    style: '专业型',
    description: '严谨专业，注重细节，适合技术面试'
  },
  {
    id: 'friendly',
    name: 'Mike Johnson',
    avatar: '👨‍💻',
    style: '友善型',
    description: '温和耐心，鼓励表达，适合行为面试'
  },
  {
    id: 'serious',
    name: 'Emma Wilson',
    avatar: '👩‍⚖️',
    style: '严肃型',
    description: '严格认真，压力测试，适合压力面试'
  }
])

// 示例问题
const sampleQuestions = computed(() => {
  const questions = {
    technical: [
      '请介绍一下你的技术栈和项目经验',
      '如何优化前端页面的性能？',
      '请解释一下你最近解决的一个技术难题',
      '你对新技术的学习方法是什么？'
    ],
    behavioral: [
      '请描述一个你遇到的最大挑战',
      '在团队中如何处理意见分歧？',
      '请分享一个你失败的经历和学到的教训',
      '你的职业规划是什么？'
    ],
    comprehensive: [
      '请做一下自我介绍',
      '为什么选择我们公司？',
      '你认为自己的优势和劣势是什么？',
      '有什么问题想问我们的吗？'
    ],
    stress: [
      '如果明天就要上线，但发现重大bug怎么办？',
      '你的代码被同事批评了，你会怎么做？',
      '如果项目延期了，你会如何向领导解释？'
    ]
  }
  return questions[interviewConfig.value.type] || questions.comprehensive
})

// 面试技巧
const interviewTips = ref([
  {
    title: 'STAR法则',
    description: '回答行为问题时，使用情境-任务-行动-结果的框架'
  },
  {
    title: '具体化描述',
    description: '用具体的数据和例子来支撑你的观点'
  },
  {
    title: '积极表达',
    description: '即使遇到困难，也要展现积极解决问题的态度'
  },
  {
    title: '准备反问',
    description: '准备2-3个有深度的问题来反问面试官'
  }
])

// 是否可以开始面试
const canStartInterview = computed(() => {
  return interviewConfig.value.position && 
         interviewConfig.value.type && 
         interviewConfig.value.difficulty && 
         interviewConfig.value.interviewer
})

// 处理职位变化
const handlePositionChange = (value) => {
  console.log('选择职位:', value)
}

// 处理面试类型变化
const handleTypeChange = (value) => {
  console.log('选择面试类型:', value)
}

// 处理难度变化
const handleDifficultyChange = (value) => {
  console.log('选择难度:', value)
}

// 选择面试官
const selectInterviewer = (id) => {
  interviewConfig.value.interviewer = id
}

// 处理菜单选择
const handleMenuSelect = (key) => {
  console.log('选择菜单:', key)
  // 这里可以添加路由跳转逻辑
}

// 开始面试
const startInterview = () => {
  if (!canStartInterview.value) {
    ElMessage.warning('请先完成面试配置')
    return
  }
  
  // 检查设备状态
  if (!micWorking.value || !cameraWorking.value) {
    ElMessage.warning('请先确保设备正常工作')
    return
  }
  
  // 跳转到面试页面，传递配置参数
  router.push({
    path: '/interview/live',
    query: { config: JSON.stringify(interviewConfig.value) }
  })
}

// 预览面试流程
const previewInterview = () => {
  ElMessage.info('预览功能待实现')
  // 这里可以跳转到面试流程预览页面
}

// 检测设备状态
const checkDevices = async () => {
  try {
    // 检测麦克风
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micWorking.value = true
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    micWorking.value = false
    console.log('麦克风检测失败:', error)
  }
  
  try {
    // 检测摄像头
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    cameraWorking.value = true
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    cameraWorking.value = false
    console.log('摄像头检测失败:', error)
  }
}

onMounted(() => {
  checkDevices()
})
</script> 

<style scoped>
.interview-preparation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 70px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.logo-icon {
  font-size: 32px;
}

/* 主内容区样式 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 欢迎区域样式 */
.welcome-section {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.5;
}

.welcome-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle:nth-child(1) {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.decoration-circle:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 50px;
  right: -75px;
  animation-delay: 2s;
}

.decoration-circle:nth-child(3) {
  width: 100px;
  height: 100px;
  bottom: -50px;
  left: 50px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 配置区域样式 */
.configuration-section {
  margin-bottom: 50px;
}

.config-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 30px;
  text-align: center;
}

.card-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.card-header p {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.config-form {
  padding: 40px;
}

.form-group {
  margin-bottom: 40px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.form-select {
  width: 100%;
}

.position-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.position-icon {
  font-size: 24px;
}

.position-label {
  font-weight: 600;
  color: #333;
}

.position-desc {
  color: #666;
  font-size: 14px;
  margin-left: auto;
}

/* 面试类型选择样式 */
.interview-type-tabs {
  margin-top: 15px;
}

.type-radio {
  margin-right: 15px;
  margin-bottom: 15px;
}

.type-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  min-width: 140px;
  text-align: center;
}

.type-icon {
  font-size: 32px;
}

.type-name {
  font-weight: 600;
  color: #333;
}

.type-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 难度选择样式 */
.difficulty-selector {
  margin-top: 15px;
}

.difficulty-radio {
  margin-right: 20px;
  margin-bottom: 15px;
}

.difficulty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 25px 20px;
  min-width: 120px;
  text-align: center;
}

.difficulty-icon {
  font-size: 28px;
}

.difficulty-name {
  font-weight: 600;
  color: #333;
}

.difficulty-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 面试官选择样式 */
.interviewer-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.interviewer-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.interviewer-option:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.interviewer-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.interviewer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-emoji {
  font-size: 32px;
}

.interviewer-info {
  flex: 1;
}

.interviewer-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.interviewer-style {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.interviewer-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.selection-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 准备区域样式 */
.preparation-section {
  margin-bottom: 50px;
}

.preparation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.prep-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.prep-card .card-header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prep-card .card-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  color: #333;
}

.expand-btn {
  color: #667eea;
  font-weight: 500;
}

.questions-content {
  padding: 20px;
}

.question-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.question-item:last-child {
  border-bottom: none;
}

.question-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  line-height: 1.6;
  color: #333;
}

.tips-content {
  padding: 20px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.tip-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 行动区域样式 */
.action-section {
  text-align: center;
  margin-bottom: 50px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.start-interview-btn {
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.start-interview-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.start-interview-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.preview-btn {
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 50px;
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
  border: none;
  box-shadow: 0 10px 30px rgba(82, 196, 26, 0.3);
  transition: all 0.3s ease;
}

.preview-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(82, 196, 26, 0.4);
}

.preview-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-hint {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

/* 设备检测样式 */
.device-check-section {
  margin-bottom: 40px;
}

.device-check-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.check-header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.check-content {
  padding: 20px;
  display: flex;
  gap: 30px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
}

.check-success {
  color: #52c41a;
}

.check-error {
  color: #ff4d4f;
}

.device-note {
  padding: 0 20px 20px;
  margin: 0;
  color: #666;
  font-size: 14px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .config-form {
    padding: 20px;
  }
  
  .preparation-grid {
    grid-template-columns: 1fr;
  }
  
  .interviewer-selection {
    grid-template-columns: 1fr;
  }
  
  .check-content {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-header h2 {
    font-size: 24px;
  }
  
  .type-radio, .difficulty-radio {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .type-content, .difficulty-content {
    min-width: auto;
    padding: 15px;
  }
}
</style> 