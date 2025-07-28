<template>
  <div class="mock-interview">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>AI模拟面试</span>
              <el-button type="primary" @click="startInterview" :disabled="isInterviewing">
                <el-icon><VideoPlay /></el-icon>
                开始面试
              </el-button>
            </div>
          </template>
          
          <div class="interview-area">
            <div v-if="!isInterviewing" class="welcome-screen">
              <el-empty description="点击开始面试按钮开始AI模拟面试">
                <el-button type="primary" @click="startInterview">开始面试</el-button>
              </el-empty>
            </div>
            
            <div v-else class="interview-screen">
              <div class="video-container">
                <div class="video-placeholder">
                  <el-icon><VideoCamera /></el-icon>
                  <p>摄像头预览区域</p>
                </div>
              </div>
              
              <div class="chat-container">
                <div class="chat-messages" ref="chatContainer">
                  <div v-for="message in chatMessages" :key="message.id" 
                       :class="['message', message.type]">
                    <div class="message-content">
                      {{ message.content }}
                    </div>
                    <div class="message-time">{{ message.time }}</div>
                  </div>
                </div>
                
                <div class="chat-input">
                  <el-input 
                    v-model="inputMessage" 
                    placeholder="请输入您的回答..."
                    @keyup.enter="sendMessage"
                    :disabled="!isInterviewing"
                  >
                    <template #append>
                      <el-button @click="sendMessage" :disabled="!inputMessage.trim()">
                        发送
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>面试设置</span>
            </div>
          </template>
          
          <el-form :model="interviewSettings" label-width="100px">
            <el-form-item label="面试岗位">
              <el-select v-model="interviewSettings.position" placeholder="选择岗位">
                <el-option label="前端开发工程师" value="frontend" />
                <el-option label="后端开发工程师" value="backend" />
                <el-option label="产品经理" value="product" />
                <el-option label="UI设计师" value="ui" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="面试时长">
              <el-input-number 
                v-model="interviewSettings.duration" 
                :min="10" 
                :max="60" 
                :step="5"
              />
              <span style="margin-left: 10px;">分钟</span>
            </el-form-item>
            
            <el-form-item label="难度等级">
              <el-rate v-model="interviewSettings.difficulty" :max="5" />
            </el-form-item>
            
            <el-form-item label="面试类型">
              <el-radio-group v-model="interviewSettings.type">
                <el-radio label="technical">技术面试</el-radio>
                <el-radio label="comprehensive">综合面试</el-radio>
                <el-radio label="hr">HR面试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>实时评分</span>
            </div>
          </template>
          
          <div class="score-panel">
            <div class="score-item">
              <span class="score-label">技术能力</span>
              <el-progress :percentage="scores.technical" />
            </div>
            <div class="score-item">
              <span class="score-label">沟通能力</span>
              <el-progress :percentage="scores.communication" />
            </div>
            <div class="score-item">
              <span class="score-label">逻辑思维</span>
              <el-progress :percentage="scores.logic" />
            </div>
            <div class="score-item">
              <span class="score-label">综合评分</span>
              <el-progress :percentage="scores.overall" :color="getScoreColor(scores.overall)" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { VideoPlay, VideoCamera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isInterviewing = ref(false)
const inputMessage = ref('')
const chatContainer = ref(null)

const interviewSettings = ref({
  position: 'frontend',
  duration: 30,
  difficulty: 3,
  type: 'technical'
})

const scores = ref({
  technical: 0,
  communication: 0,
  logic: 0,
  overall: 0
})

const chatMessages = ref([
  {
    id: 1,
    type: 'ai',
    content: '您好！我是AI面试官，很高兴为您进行模拟面试。请简单介绍一下您自己。',
    time: '14:00'
  }
])

const startInterview = () => {
  isInterviewing.value = true
  ElMessage.success('面试开始！')
  
  // 模拟AI提问
  setTimeout(() => {
    addMessage('ai', '请介绍一下您在前端开发方面的经验。')
  }, 2000)
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  // 添加用户消息
  addMessage('user', inputMessage.value)
  
  inputMessage.value = ''
  
  // 模拟AI回复
  setTimeout(() => {
    const responses = [
      '很好！请详细说明一下您使用过的前端框架。',
      '您能解释一下Vue.js的响应式原理吗？',
      '请描述一下您处理过的最复杂的前端项目。',
      '您如何看待前端性能优化？'
    ]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    addMessage('ai', randomResponse)
    
    // 更新评分
    updateScores()
  }, 1000)
}

const addMessage = (type, content) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  chatMessages.value.push({
    id: Date.now(),
    type,
    content,
    time
  })
  
  // 滚动到底部
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const updateScores = () => {
  scores.value.technical = Math.min(100, scores.value.technical + Math.random() * 10)
  scores.value.communication = Math.min(100, scores.value.communication + Math.random() * 8)
  scores.value.logic = Math.min(100, scores.value.logic + Math.random() * 12)
  scores.value.overall = Math.round((scores.value.technical + scores.value.communication + scores.value.logic) / 3)
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}
</script>

<style scoped>
.mock-interview {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interview-area {
  min-height: 500px;
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.interview-screen {
  display: flex;
  gap: 20px;
}

.video-container {
  flex: 1;
}

.video-placeholder {
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 15px;
}

.message-content {
  display: inline-block;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #409EFF;
  color: white;
}

.message.ai .message-content {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.chat-input {
  flex-shrink: 0;
}

.score-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.score-label {
  font-size: 14px;
  color: #606266;
}
</style> 