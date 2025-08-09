<template>
  <div class="mock-interview-page">
    <el-container>
      <!-- 顶部栏 -->
      <el-header height="70px" class="mi-header">
        <div class="header-left">
          <div class="title">AI 模拟面试</div>
          <el-tag type="warning" effect="dark">Beta</el-tag>
        </div>
        <div class="header-center">
          <el-select v-model="context.resumeId" placeholder="选择简历" size="small" style="width: 220px">
            <el-option v-for="r in resumeOptions" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
          <el-select v-model="context.jobId" placeholder="选择岗位" size="small" style="width: 220px">
            <el-option v-for="j in jobOptions" :key="j.value" :label="j.label" :value="j.value" />
          </el-select>
          <el-select v-model="context.persona" size="small" style="width: 160px">
            <el-option v-for="p in personaOptions" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
          <el-select v-model="context.difficulty" size="small" style="width: 120px">
            <el-option v-for="d in difficultyOptions" :key="d.value" :label="d.label" :value="d.value" />
          </el-select>
        </div>
        <div class="header-right">
          <el-tag :type="statusTagType">{{ statusText }}</el-tag>
          <el-button-group>
            <el-button size="small" type="success" :disabled="isRunning" @click="handleStart">开始</el-button>
            <el-button size="small" type="warning" :disabled="!isRunning" @click="handlePause">暂停</el-button>
            <el-button size="small" type="danger" :disabled="!isRunning && messages.length===0" @click="handleEnd">结束</el-button>
          </el-button-group>
        </div>
      </el-header>

      <el-container>
        <!-- 左侧上下文 -->
        <el-aside width="280px" class="mi-aside-left">
          <el-card shadow="never" class="panel">
            <template #header>
              <div class="panel-header">简历概览</div>
            </template>
            <div class="resume-brief">
              <div class="resume-title">{{ currentResume?.label || '未选择' }}</div>
              <el-tag size="small" type="success">匹配度 82%</el-tag>
              <div class="resume-snippets">
                <ul>
                  <li>教育：上海交通大学 | 计算机科学</li>
                  <li>技能：Vue、Node.js、MySQL、Docker</li>
                  <li>项目：电商前后端一体化平台</li>
                </ul>
              </div>
              <el-button size="small" text type="primary">查看完整简历</el-button>
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

          <el-card shadow="never" class="panel">
            <template #header>
              <div class="panel-header">便签</div>
            </template>
            <div class="notes">
              <el-input v-model="noteDraft" type="textarea" :rows="3" placeholder="记录你的想法或要点..." />
              <div class="notes-actions">
                <el-button size="small" @click="addNote">添加</el-button>
              </div>
              <el-empty v-if="notes.length===0" description="暂无便签" />
              <el-timeline v-else class="notes-timeline">
                <el-timeline-item v-for="(n, idx) in notes" :key="idx" :timestamp="n.time">
                  <div class="note-item">
                    <span>{{ n.text }}</span>
                    <el-button link type="danger" size="small" @click="removeNote(idx)">删除</el-button>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
        </el-aside>

        <!-- 中间对话区 -->
        <el-main class="mi-main">
          <div class="chat-container" ref="chatRef">
            <div v-for="(msg, idx) in messages" :key="idx" class="chat-row" :class="msg.role">
              <div class="avatar" :class="msg.role">{{ msg.role === 'ai' ? 'AI' : '我' }}</div>
              <div class="bubble">
                <div class="meta">
                  <el-tag size="small" :type="msg.role==='ai' ? 'warning' : 'info'">{{ msg.role === 'ai' ? '面试官' : '候选人' }}</el-tag>
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
                <el-checkbox v-model="options.instantFeedback" label="即时反馈" size="small" />
                <el-button type="primary" :disabled="!canSend" @click="handleSend">发送</el-button>
              </div>
            </div>
          </div>
        </el-main>

        <!-- 右侧侧栏 -->
        <el-aside width="300px" class="mi-aside-right">
          <el-card shadow="never" class="panel">
            <template #header>
              <div class="panel-header">面试进度</div>
            </template>
            <el-steps direction="vertical" :active="activeStep" finish-status="success">
              <el-step title="开场" description="寒暄与背景" />
              <el-step title="简历导向" description="经历与项目" />
              <el-step title="技术深挖" description="知识与能力" />
              <el-step title="行为面试" description="沟通与协作" />
              <el-step title="收尾" description="反问与总结" />
            </el-steps>
          </el-card>

          <el-card shadow="never" class="panel">
            <template #header>
              <div class="panel-header">能力画像</div>
            </template>
            <div class="radar-placeholder">
              <el-empty description="评分画像（预留ECharts）" />
            </div>
          </el-card>

          <el-card shadow="never" class="panel">
            <template #header>
              <div class="panel-header">提示建议</div>
            </template>
            <ul class="hints">
              <li v-for="(h, i) in hintList" :key="i">{{ h }}</li>
            </ul>
          </el-card>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import dayjs from 'dayjs'

const context = ref({
  resumeId: null,
  jobId: null,
  persona: 'tech_strict',
  difficulty: 'mid'
})

const resumeOptions = ref([
  { label: '前端开发简历（2025-08-01）', value: 'r1' },
  { label: '全栈工程师简历（2025-07-15）', value: 'r2' }
])

const jobOptions = ref([
  { label: '前端开发工程师', value: 'j1' },
  { label: '全栈工程师', value: 'j2' }
])

const personaOptions = [
  { label: '技术向-严谨', value: 'tech_strict' },
  { label: '技术向-友好', value: 'tech_friendly' },
  { label: 'HR向-沟通', value: 'hr_communication' }
]

const difficultyOptions = [
  { label: '初级', value: 'junior' },
  { label: '中级', value: 'mid' },
  { label: '高级', value: 'senior' }
]

const isRunning = ref(false)
const statusText = computed(() => (isRunning.value ? '进行中' : messages.value.length ? '已结束/暂停' : '未开始'))
const statusTagType = computed(() => (isRunning.value ? 'success' : messages.value.length ? 'warning' : 'info'))

const jobKeywords = ['Vue3', 'TypeScript', '组件化', '性能优化']

const notes = ref([])
const noteDraft = ref('')
const addNote = () => {
  if (!noteDraft.value.trim()) return
  notes.value.unshift({ text: noteDraft.value.trim(), time: dayjs().format('HH:mm:ss') })
  noteDraft.value = ''
}
const removeNote = (idx) => notes.value.splice(idx, 1)

const messages = ref([
  {
    role: 'ai',
    time: dayjs().format('HH:mm:ss'),
    html: '你好，我是本次的AI面试官。在开始之前，请简单介绍一下你自己与最近的一份项目经历。',
    hint: '沟通表达 / 总结能力 / 近因效应'
  }
])

const inputText = ref('')
const options = ref({ instantFeedback: true })
const canSend = computed(() => !!inputText.value.trim() && isRunning.value)
const chatRef = ref(null)

const currentResume = computed(() => resumeOptions.value.find(r => r.value === context.value.resumeId))
const currentJob = computed(() => jobOptions.value.find(j => j.value === context.value.jobId))

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
      html: `你提到“${text.slice(0, 20)}...”。请进一步说明你的角色与具体贡献？`,
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
</script>

<style scoped>
.mock-interview-page { height: 100vh; display: flex; flex-direction: column; }
.mi-header { display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #f0f0f0; padding: 0 12px; }
.header-left { display: flex; align-items: center; gap: 10px; }
.header-left .title { font-size: 18px; font-weight: 600; }
.header-center { display: flex; align-items: center; gap: 10px; }
.header-right { display: flex; align-items: center; gap: 10px; }

.mi-aside-left, .mi-aside-right { background: transparent; padding: 10px; }
.panel { margin-bottom: 12px; }
.panel-header { font-weight: 600; }
.resume-title { font-weight: 600; margin-bottom: 6px; }
.resume-snippets { color: #606266; font-size: 13px; margin: 6px 0 8px; }

.mi-main { background: #f7f8fa; padding: 0; display: flex; flex-direction: column; }
.chat-container { flex: 1; overflow-y: auto; padding: 16px; }
.chat-row { display: flex; gap: 10px; margin-bottom: 16px; }
.chat-row .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
.chat-row.ai .avatar { background: #f59e0b; }
.chat-row.user .avatar { background: #409eff; }
.bubble { background: #fff; border-radius: 10px; padding: 10px 12px; max-width: 70%; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

.chat-row.user .bubble { background: #ecf5ff; }
.meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.meta .time { color: #909399; font-size: 12px; }
.hint { margin-top: 8px; color: #909399; font-size: 12px; }

.input-bar { border-top: 1px solid #e5e7eb; background: #fff; padding: 10px; }
.input-bar .tools { display: flex; gap: 8px; margin-bottom: 8px; }
.input-bar .editor { display: flex; gap: 10px; align-items: flex-end; }
.input-bar .actions { display: flex; align-items: center; gap: 10px; }

.hints { padding-left: 18px; color: #606266; font-size: 13px; }
.radar-placeholder { height: 180px; display: flex; align-items: center; justify-content: center; }

/* 响应式 */
@media (max-width: 1200px) {
  .mi-aside-right { display: none; }
}
</style> 