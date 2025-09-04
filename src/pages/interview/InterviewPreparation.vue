<template>
  <div class="interview-preparation">
    <!-- 主体布局，与主页和简历管理页面完全一致 -->
    <div class="layout">
      <main class="main">
        <!-- 第一行：问题卡片和配置卡片 -->
        <div class="row-layout">
          <!-- 左侧：可能问到的问题 -->
          <div class="left-card">
            <section class="section">
              <div class="section-header">
                <h2>可能问到的问题</h2>
                <el-button 
                  type="text" 
                  @click="questionsExpanded = !questionsExpanded"
                  class="expand-btn"
                >
                  {{ questionsExpanded ? '收起' : '展开' }}
                  <el-icon><ArrowDown v-if="!questionsExpanded" /><ArrowUp v-else /></el-icon>
                </el-button>
              </div>
              <div class="questions-panel glass">
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
            </section>
          </div>

          <!-- 右侧：面试配置 -->
          <div class="right-card">
            <section class="section">
              <div class="section-header">
                <h2>面试配置</h2>
                <div></div>
              </div>
              <div class="config-card glass">
                <div class="config-form">
                  <!-- 简历和职位选择 - 上下结构 -->
                  <div class="form-column">
                    <!-- 选择简历 -->
                    <div class="form-group">
                      <label class="form-label">
                        <el-icon><Document /></el-icon>
                        选择简历
                      </label>
                      <el-select
                        v-model="interviewConfig.resumeId"
                        placeholder="请选择简历"
                        size="large"
                        class="form-select"
                        :loading="resumeLoading"
                        :disabled="resumes.length === 0"
                        @change="handleResumeChange"
                      >
                        <el-option
                          v-for="resume in resumes"
                          :key="resume.id"
                          :label="resume.title"
                          :value="resume.id"
                        >
                          <div class="resume-option">
                            <span class="resume-icon">📄</span>
                            <div class="resume-info">
                              <span class="resume-title">{{ resume.title }}</span>
                              <span class="resume-meta">{{ resume.format }} · {{ resume.updateTime }} · 评分: {{ resume.score }}</span>
                            </div>
                          </div>
                        </el-option>
                      </el-select>
                      <div v-if="resumes.length === 0" class="no-resume-tip">
                        <el-icon><Document /></el-icon>
                        <span>暂无简历，请先上传简历</span>
                      </div>
                    </div>

                    <!-- 选择职位 -->
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
                        :loading="positionLoading"
                        :disabled="positionOptions.length === 0"
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
                      <div v-if="positionOptions.length === 0 && !positionLoading" class="no-position-tip">
                        <el-icon><Briefcase /></el-icon>
                        <span>当前还未投递过岗位，请先投递</span>
                      </div>
                    </div>

                    <!-- 选择面试模式 -->
                    <div class="form-group">
                      <label class="form-label">
                        <el-icon><VideoPlay /></el-icon>
                        面试模式
                      </label>
                      <el-select
                        v-model="interviewConfig.mode"
                        placeholder="请选择面试模式"
                        size="large"
                        class="form-select"
                        @change="handleModeChange"
                      >
                        <el-option
                          value="video"
                          label="视频面试"
                        >
                          <div class="mode-option">
                            <span class="mode-icon">🎥</span>
                            <span class="mode-label">视频面试</span>
                            <span class="mode-desc">实时视频对话，更真实的面试体验</span>
                          </div>
                        </el-option>
                        <el-option
                          value="chat"
                          label="文字面试"
                        >
                          <div class="mode-option">
                            <span class="mode-icon">💬</span>
                            <span class="mode-label">文字面试</span>
                            <span class="mode-desc">纯文字对话，更轻松自然的交流</span>
                          </div>
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- 第二行：面试技巧提示（右侧设备检测已移除） -->
        <div class="row-layout">
          <div class="left-card">
            <section class="section">
              <div class="section-header">
                <h2>面试技巧提示</h2>
                <div></div>
              </div>
              <div class="tips-panel glass">
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
            </section>
          </div>

          <!-- 右侧：设备检测（清空内容，红色边框） -->
          <div class="right-card">
            <section class="section">
              <div class="section-header">
                <h2>设备检测</h2>
                <div></div>
              </div>
              <div class="device-panel glass">
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
              </div>
            </section>
          </div>
        </div>

        
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getResumeList } from '@/api/resume'
import { getCandidateJobList } from '@/api/candidate'
import { useInterviewStore } from '@/stores/interview'
import {
  Briefcase, Document,
  ArrowDown, ArrowUp, VideoPlay,
  View
} from '@element-plus/icons-vue'

const router = useRouter()
const interviewStore = useInterviewStore()

// 面试配置
const interviewConfig = ref({
  position: '',
  resumeId: '',
  mode: 'chat' // 默认文字聊天面试模式
})

// 简历数据
const resumes = ref([])
const resumeLoading = ref(false)

// 获取简历列表
const fetchResumeList = async () => {
  try {
    resumeLoading.value = true
    const response = await getResumeList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换简历数据格式
      resumes.value = data.data.map(resume => ({
        id: resume.resumeId,
        title: resume.resumeTitle || '未命名简历',
        format: resume.mimeType === 'application/pdf' ? 'PDF' : 
                resume.mimeType === 'application/msword' ? 'DOC' : 
                resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' : '未知',
        updateTime: new Date(resume.updatedAt).toLocaleDateString('zh-CN'),
        score: resume.rate || 0
      }))
      
      // 默认选择第一个简历
      if (resumes.value.length > 0) {
        interviewConfig.value.resumeId = resumes.value[0].id
        // 同时设置resumeInfo，确保store中有完整的简历信息
        interviewStore.setResumeInfo(resumes.value[0])
      }
    } else {
      ElMessage.error(data.message || '获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    ElMessage.error('获取简历列表失败，请重试')
  } finally {
    resumeLoading.value = false
  }
}

// 获取职位列表
const fetchPositionList = async () => {
  try {
    positionLoading.value = true
    const response = await getCandidateJobList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换职位数据格式
      positionOptions.value = data.data.map(job => ({
        value: job.jobId.toString(),
        label: job.jobTitle, // 只显示职位名称，避免重复
        icon: '💼',
        description: job.companyName, // 显示公司名作为补充信息
        originalData: job
      }))
      
      // 默认选择第一个职位
      if (positionOptions.value.length > 0) {
        interviewConfig.value.position = positionOptions.value[0].value
        // 同时设置positionInfo，确保store中有完整的职位信息
        interviewStore.setPositionInfo(positionOptions.value[0].originalData)
      }
    } else {
      ElMessage.error(data.message || '获取职位列表失败')
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取职位列表失败，请重试')
    }
  } finally {
    positionLoading.value = false
  }
}

// 展开状态
const questionsExpanded = ref(true)

// 设备状态
const micWorking = ref(false)
const cameraWorking = ref(false)

// 职位选项
const positionOptions = ref([])
const positionLoading = ref(false)

// 示例问题 - 改为5个
const sampleQuestions = computed(() => [
  '请介绍一下你的技术栈和项目经验',
  '如何优化前端页面的性能？',
  '请解释一下你最近解决的一个技术难题',
  '你对新技术的学习方法是什么？',
  '请描述一个你遇到的最大挑战'
])

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
         interviewConfig.value.resumeId && 
         interviewConfig.value.mode
})

// 处理职位选择变化
const handlePositionChange = (position) => {
  interviewConfig.value.position = position
  // 找到对应的职位信息并存储
  const selectedPosition = positionOptions.value.find(pos => pos.value === position)
  if (selectedPosition) {
    interviewStore.setPositionInfo(selectedPosition.originalData)
  }
  // 同时更新store中的配置
  interviewStore.setInterviewConfig({ position })
}

// 处理简历选择变化
const handleResumeChange = (resumeId) => {
  interviewConfig.value.resumeId = resumeId
  // 找到对应的简历信息并存储
  const selectedResume = resumes.value.find(resume => resume.id === resumeId)
  if (selectedResume) {
    interviewStore.setResumeInfo(selectedResume)
  }
  interviewStore.setInterviewConfig({ resumeId })
}

// 处理面试模式变化
const handleModeChange = (mode) => {
  interviewConfig.value.mode = mode
  interviewStore.setInterviewConfig({ mode })
}

// 开始面试
const startInterview = () => {
  if (!canStartInterview.value) {
    ElMessage.warning('请先完成面试配置')
    return
  }
  
  // 将完整配置保存到store
  interviewStore.setInterviewConfig(interviewConfig.value)
  
  // 根据面试模式跳转到不同页面
  if (interviewConfig.value.mode === 'video') {
    // 视频面试模式：检查设备状态
    if (!micWorking.value || !cameraWorking.value) {
      ElMessage.warning('请先确保设备正常工作')
      return
    }
    
    // 跳转到视频面试页面，不传递URL参数
    router.push('/interview/live')
  } else if (interviewConfig.value.mode === 'chat') {
    // 文字聊天模式：直接跳转，不传递URL参数
    router.push('/interview/chat')
  }
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

// 滚动解锁函数
const unlockScroll = () => {
  try {
    const body = document.body
    const html = document.documentElement
    
    // 移除可能影响滚动的类
    body.classList.remove('el-popup-parent--hidden')
    body.classList.remove('el-overflow-hidden')
    
    // 清理内联样式
    if (body.style.overflow) body.style.overflow = ''
    if (body.style.position) body.style.position = ''
    if (html.style.overflow) html.style.overflow = ''
    if (html.style.position) html.style.position = ''
    
    // 强制设置可滚动
    body.style.overflow = 'auto'
    html.style.overflow = 'auto'
    
    // 检查并清理页面内可能影响滚动的元素
    const pageElements = document.querySelectorAll('.interview-preparation *')
    pageElements.forEach(el => {
      if (el.style && el.style.overflow === 'hidden') {
        el.style.overflow = ''
      }
    })
  } catch (e) { /* 忽略 */ }
}

onMounted(() => {
  checkDevices()
  fetchResumeList()
  fetchPositionList()
  // 进入页面强制解锁滚动并做多次延迟兜底
  unlockScroll()
  setTimeout(unlockScroll, 50)
  setTimeout(unlockScroll, 200)
  setTimeout(unlockScroll, 500)
})
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

.interview-preparation {
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
  width: 100%;
  box-sizing: border-box;
}

.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(120%) blur(14px);
  -webkit-backdrop-filter: saturate(120%) blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
}

/* 主体布局，与主页和简历管理页面完全一致 */
.layout {
  display: flex;
  padding: 16px;
  margin-top: 0;
  min-height: calc(100vh - 64px);
  overflow: visible;
  width: 100%;
  box-sizing: border-box;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 64px);
  overflow-y: visible;
  overflow-x: hidden;
  height: auto;
  width: 100%;
  box-sizing: border-box;
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

/* 行布局 */
.row-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.left-card,
.right-card {
  display: flex;
  flex-direction: column;
}

/* 配置卡片样式 */
.config-card {
  padding: 16px;
  height: 280px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.config-form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  width: 100%;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
}

.resume-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.resume-icon {
  font-size: 20px;
}

.resume-info {
  display: flex;
  flex-direction: column;
}

.resume-title {
  font-weight: 600;
  color: #1a202c;
  font-size: 15px;
}

.resume-meta {
  color: #2d3748;
  font-size: 13px;
}

.no-resume-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2d3748;
  font-size: 13px;
  margin-top: 8px;
}

.no-position-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2d3748;
  font-size: 13px;
  margin-top: 8px;
}

.position-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.position-icon {
  font-size: 20px;
}

.position-label {
  font-weight: 600;
  color: #1a202c;
  font-size: 15px;
}

.position-desc {
  color: #2d3748;
  font-size: 13px;
  margin-left: auto;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.mode-icon {
  font-size: 20px;
}

.mode-label {
  font-weight: 600;
  color: #1a202c;
  font-size: 15px;
}

.mode-desc {
  color: #2d3748;
  font-size: 13px;
  margin-left: auto;
}

/* 问题卡片和技巧卡片样式 */
.questions-panel {
  height: 280px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* 技巧面板样式 */
.tips-panel {
  height: 260px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* 右侧设备检测空卡片，保持同高，红色边框 */
.device-panel {
  height: 260px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* 将按钮固定在红色卡片底部 */
.device-panel .action-buttons {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.questions-content {
  overflow: auto;
  flex: 1;
}

.tips-content {
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 8px 0;
}

/* 问题列表样式 */
.question-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.question-item:last-child {
  border-bottom: none;
}

.question-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 12px;
}

.question-text {
  flex: 1;
  line-height: 1.5;
  color: #1a202c;
  font-size: 15px;
}

/* 技巧提示样式 */
.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  flex-shrink: 0;
}

.tip-desc {
  font-size: 14px;
  color: #2d3748;
  line-height: 1.4;
  margin: 0;
  flex: 1;
}

/* 设备检测样式 */
/* 设备检测样式（已删除卡片，样式保留以防未来复用） */

.check-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #1a202c;
  padding: 10px 0;
}

.check-success {
  color: #22c55e;
}

.check-error {
  color: #ef4444;
}

/* 行动按钮行样式 */

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.start-interview-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.preview-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.expand-btn {
  color: #3b82f6;
  font-weight: 500;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .row-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .questions-panel,
  .config-card {
    height: 260px;
  }
  
  .tips-panel {
    height: 260px;
  }
  .device-panel {
    height: 260px;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .check-content {
    flex-direction: row;
    gap: 24px;
  }
}
</style>
