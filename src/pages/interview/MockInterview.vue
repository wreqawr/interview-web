<template>
  <div class="mock-interview-page">
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-left">
        <h1 class="title">AI 模拟面试</h1>
        <el-tag type="warning" effect="dark">Beta</el-tag>
      </div>
      <div class="header-center">
        <el-select
            v-model="context.resumeId"
            placeholder="选择简历"
            size="small"
            style="width: 220px"
            @change="handleResumeChange"
        >
          <el-option
              v-for="resume in resumeOptions"
              :key="resume.value"
              :label="resume.label"
              :value="resume.value"
          />
        </el-select>
        <el-select v-model="context.jobId" placeholder="选择岗位" size="small" style="width: 220px">
          <el-option v-for="j in jobOptions" :key="j.value" :label="j.label" :value="j.value"/>
        </el-select>
      </div>
      <div class="header-right">
        <el-tag :type="statusTagType">{{ statusText }}</el-tag>
        <div class="button-group">
          <el-button size="small" type="success" :disabled="isRunning" @click="handleStart">开始</el-button>
          <el-button size="small" type="warning" :disabled="!isRunning" @click="handlePause">暂停</el-button>
          <el-button size="small" type="danger" :disabled="!isRunning && messages.length===0" @click="handleEnd">结束
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧上下文 -->
      <div class="left-panel">
        <el-card shadow="never" class="panel">
          <template #header>
            <div class="panel-header">简历概览</div>
          </template>
          <div v-if="loading" class="resume-loading">
            <el-icon class="is-loading">
              <Loading/>
            </el-icon>
            <span>加载简历中...</span>
          </div>
          <div v-else-if="!currentResume" class="resume-empty">
            <el-empty description="请先选择简历"/>
          </div>
          <div v-else class="resume-brief">
            <div class="resume-title">{{ currentResume.title }}</div>
            <el-tag size="small" type="success">匹配度 82%</el-tag>
            <div class="resume-info">
              <div class="info-item">
                <span class="label">格式：</span>
                <span class="value">{{ currentResume.format }}</span>
              </div>
              <div class="info-item">
                <span class="label">大小：</span>
                <span class="value">{{ currentResume.size }}</span>
              </div>
              <div class="info-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ currentResume.createTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">评分：</span>
                <span class="value">
                  <el-rate
                      v-model="currentResume.score"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                      size="small"
                  />
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="panel">
          <template #header>
            <div class="panel-header">岗位与要求</div>
          </template>
          <div class="job-brief">
            <div class="job-title">{{ currentJob?.label || '未选择岗位' }}</div>
            <div class="job-tags">
              <el-tag size="small" v-for="k in jobKeywords" :key="k" style="margin-right: 6px">{{ k }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 中间对话区 -->
      <div class="chat-panel">
        <div class="chat-container" ref="chatRef">
          <div v-for="(msg, idx) in messages" :key="idx" class="chat-row" :class="msg.role">
            <div class="avatar" :class="msg.role">{{ msg.role === 'ai' ? 'AI' : '我' }}</div>
            <div class="bubble">
              <div class="meta">
                <el-tag size="small" :type="msg.role==='ai' ? 'warning' : 'info'">
                  {{ msg.role === 'ai' ? '面试官' : '候选人' }}
                </el-tag>
                <span class="time">{{ msg.time }}</span>
              </div>
              <div class="content" v-html="msg.html"></div>
              <div v-if="msg.role==='ai' && msg.hint" class="hint">考察点：{{ msg.hint }}</div>
            </div>
          </div>
        </div>

        <!-- 底部输入栏 -->
        <div class="input-bar">
          <div class="tools">
            <el-button size="small" @click="insertTemplate('STAR 模板：情境-任务-行动-结果')">STAR 模板</el-button>
            <el-button size="small" @click="insertTemplate('请给出一个具体案例进行说明')">请求举例</el-button>
            <el-button size="small" @click="insertTemplate('可否提示关键点？')">请求提示</el-button>
          </div>
          <div class="editor">
            <el-input
                v-model="inputText"
                type="textarea"
                :rows="3"
                placeholder="请输入你的回答，或点击上方快捷工具插入模板"
                @keydown.enter.exact.prevent="handleSend"
            />
            <div class="actions">
              <el-checkbox v-model="options.instantFeedback" label="即时反馈" size="small"/>
              <el-button type="primary" :disabled="!canSend" @click="handleSend">发送</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧侧栏 -->
      <div class="right-panel">
        <el-card shadow="never" class="panel">
          <template #header>
            <div class="panel-header">面试进度</div>
          </template>
          <el-steps direction="vertical" :active="activeStep" finish-status="success">
            <el-step title="开场" description="寒暄与背景"/>
            <el-step title="简历导向" description="经历与项目"/>
            <el-step title="技术深挖" description="知识与能力"/>
            <el-step title="行为面试" description="沟通与协作"/>
            <el-step title="收尾" description="反问与总结"/>
          </el-steps>
        </el-card>

        <el-card shadow="never" class="panel">
          <template #header>
            <div class="panel-header">提示建议</div>
          </template>
          <ul class="hints">
            <li v-for="(h, i) in hintList" :key="i">{{ h }}</li>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Loading} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import {getResumeList} from '@/api/resume'

const context = ref({
  resumeId: null,
  jobId: null
})

// 简历相关状态
const loading = ref(false)
const resumes = ref([])
const resumeOptions = ref([])

const jobOptions = ref([
  {label: '前端开发工程师', value: 'j1'},
  {label: '全栈工程师', value: 'j2'}
])

const isRunning = ref(false)
const statusText = computed(() => (isRunning.value ? '进行中' : messages.value.length ? '已结束/暂停' : '未开始'))
const statusTagType = computed(() => (isRunning.value ? 'success' : messages.value.length ? 'warning' : 'info'))

const jobKeywords = ['Vue3', 'TypeScript', '组件化', '性能优化']

const activeStep = ref(1)

const messages = ref([
  {
    role: 'ai',
    time: dayjs().format('HH:mm:ss'),
    html: '你好，我是本次的AI面试官。在开始之前，请简单介绍一下你自己与最近的一份项目经历。',
    hint: '沟通表达 / 总结能力 / 近因效应'
  }
])

const inputText = ref('')
const options = ref({instantFeedback: true})
const canSend = computed(() => !!inputText.value.trim() && isRunning.value)
const chatRef = ref(null)

const currentResume = computed(() => resumes.value.find(r => r.id === context.value.resumeId))
const currentJob = computed(() => jobOptions.value.find(j => j.value === context.value.jobId))

// 获取简历列表
const fetchResumeList = async () => {
  try {
    loading.value = true
    const response = await getResumeList()
    const data = response?.data || response

    if (data.code === 200 && data.data) {
      // 转换简历数据格式
      resumes.value = data.data.map((resume) => {
        // 格式化文件大小：将字节转换为MB
        const formatFileSize = (bytes) => {
          const mb = bytes / (1024 * 1024)
          return `${mb.toFixed(1)}MB`
        }

        // 格式化文件类型
        const formatMimeType = (mimeType) => {
          const typeMap = {
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
          }
          return typeMap[mimeType] || mimeType
        }

        // 格式化时间：YYYY-MM-DD hh:mm:ss
        const formatDateTime = (dateTimeStr) => {
          const date = new Date(dateTimeStr)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        return {
          id: resume.resumeId,
          title: resume.resumeTitle || '未命名简历',
          format: formatMimeType(resume.mimeType),
          size: formatFileSize(resume.fileSize),
          createTime: formatDateTime(resume.createdAt),
          updateTime: formatDateTime(resume.updatedAt),
          score: resume.rate || 0,
          originalData: resume
        }
      })

      // 生成简历选项
      resumeOptions.value = resumes.value.map(resume => ({
        label: `${resume.title}（${resume.createTime.split(' ')[0]}）`,
        value: resume.id
      }))

      // 默认选择第一个简历
      if (resumes.value.length > 0 && !context.value.resumeId) {
        context.value.resumeId = resumes.value[0].id
      }
    } else {
      ElMessage.error(data.message || '获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取简历列表失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 处理简历选择变化
const handleResumeChange = (resumeId) => {
  if (resumeId) {
    ElMessage.success(`已选择简历：${currentResume.value?.title}`)
  }
}

const insertTemplate = (tpl) => {
  inputText.value = inputText.value ? inputText.value + '\n' + tpl : tpl
}

const handleStart = () => {
  if (!context.value.resumeId || !context.value.jobId) {
    return window.alert('请先选择简历与岗位')
  }
  isRunning.value = true
}

const handlePause = () => {
  isRunning.value = false
}

const handleEnd = () => {
  isRunning.value = false
}

const handleSend = async () => {
  if (!canSend.value) return
  const text = inputText.value.trim()
  inputText.value = ''
  messages.value.push({
    role: 'user',
    time: dayjs().format('HH:mm:ss'),
    html: text
  })
  await nextTick()
  scrollToBottom()

  // 占位：模拟AI响应
  setTimeout(async () => {
    messages.value.push({
      role: 'ai',
      time: dayjs().format('HH:mm:ss'),
      html: `你提到"${text.slice(0, 20)}..."。请进一步说明你的角色与具体贡献？`,
      hint: '项目拆解 / 角色澄清 / 结果量化'
    })
    await nextTick()
    scrollToBottom()
  }, 600)
}

const scrollToBottom = () => {
  const el = chatRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const hintList = [
  '回答技术问题时优先给出结论，再给依据',
  '结合 STAR 法则组织你的项目经历',
  '善用数据来量化你的成果与影响'
]

// 页面加载时获取简历列表
onMounted(() => {
  fetchResumeList()
})
</script>

<style scoped>
.mock-interview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

/* 顶部栏样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  height: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left .title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-group {
  display: flex;
  gap: 8px;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 280px;
  flex-shrink: 0;
}

/* 中间聊天面板 */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 右侧面板 */
.right-panel {
  width: 300px;
  flex-shrink: 0;
}

/* 面板样式 */
.panel {
  margin-bottom: 16px;
  border-radius: 8px;
}

.panel-header {
  font-weight: 600;
  color: #303133;
}

/* 简历相关样式 */
.resume-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.resume-empty {
  text-align: center;
  padding: 20px 0;
}

.resume-title {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 16px;
  color: #303133;
}

.resume-info {
  margin: 12px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-item .label {
  color: #909399;
}

.info-item .value {
  color: #606266;
  font-weight: 500;
}

/* 聊天区域样式 */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.chat-row .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.chat-row.ai .avatar {
  background: #f59e0b;
}

.chat-row.user .avatar {
  background: #409eff;
}

.bubble {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.chat-row.user .bubble {
  background: #ecf5ff;
  border-color: #d9ecff;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.meta .time {
  color: #909399;
  font-size: 12px;
}

.hint {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
  font-style: italic;
}

/* 输入栏样式 */
.input-bar {
  border-top: 1px solid #e5e7eb;
  background: #fff;
  padding: 16px;
}

.input-bar .tools {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-bar .editor {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-bar .actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 其他样式 */
.hints {
  padding-left: 18px;
  color: #606266;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .right-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 16px;
    gap: 16px;
  }

  .main-content {
    flex-direction: column;
    padding: 16px;
  }

  .left-panel, .right-panel {
    width: 100%;
  }
}
</style> 