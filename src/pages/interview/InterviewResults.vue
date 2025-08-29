<template>
  <div class="interview-results-page">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">面试结果分析</span>
        </div>
      </div>
      <div class="navbar-right">
        <el-button @click="goHome" size="large">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 表现总结区 -->
      <section class="performance-summary">
        <div class="summary-header">
          <h1>面试结果分析</h1>
          <p class="summary-subtitle">恭喜你完成了本次面试！以下是详细的分析报告</p>
        </div>
        
        <div class="summary-content">
          <div class="overall-score">
            <div class="score-circle">
              <div class="score-value">{{ overallScore }}</div>
              <div class="score-max">/100</div>
            </div>
            <div class="score-grade">{{ scoreGrade }}</div>
          </div>
          
          <div class="score-details">
            <div class="score-breakdown">
              <h3>得分明细</h3>
              <div class="breakdown-items">
                <div class="breakdown-item">
                  <span class="item-label">技术能力</span>
                  <div class="item-score">
                    <span class="score-number">{{ technicalScore }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
                <div class="breakdown-item">
                  <span class="item-label">沟通表达</span>
                  <div class="item-score">
                    <span class="score-number">{{ communicationScore }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
                <div class="breakdown-item">
                  <span class="item-label">逻辑思维</span>
                  <div class="item-score">
                    <span class="score-number">{{ logicScore }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
                <div class="breakdown-item">
                  <span class="item-label">自信度</span>
                  <div class="item-score">
                    <span class="score-number">{{ confidenceScore }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
                <div class="breakdown-item">
                  <span class="item-label">文化匹配</span>
                  <div class="item-score">
                    <span class="score-number">{{ cultureScore }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="ai-feedback">
              <h3>AI总评</h3>
              <div class="feedback-content">
                <p>{{ aiOverallFeedback }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心能力雷达图 -->
      <section class="radar-chart-section">
        <div class="chart-card">
          <div class="card-header">
            <h2>核心能力雷达图</h2>
            <p>直观展示你在各个维度的表现</p>
          </div>
          <div class="chart-container">
            <div ref="radarChart" class="radar-chart"></div>
          </div>
        </div>
      </section>

      <!-- 详细反馈区 -->
      <section class="detailed-feedback">
        <div class="feedback-header">
          <h2>详细反馈分析</h2>
          <p>按题目逐一分析，提供具体改进建议</p>
        </div>
        
        <div class="feedback-list">
          <div 
            v-for="(feedback, index) in questionFeedbacks" 
            :key="index"
            class="feedback-item"
          >
            <div class="question-header">
              <div class="question-info">
                <span class="question-number">Q{{ index + 1 }}</span>
                <h3 class="question-text">{{ feedback.question }}</h3>
              </div>
              <div class="question-score">
                <span class="score">{{ feedback.score }}</span>
                <span class="unit">分</span>
              </div>
            </div>
            
            <div class="feedback-content">
              <div class="feedback-section">
                <h4>内容评价</h4>
                <p>{{ feedback.contentFeedback }}</p>
              </div>
              
              <div class="feedback-section">
                <h4>表达评价</h4>
                <p>{{ feedback.expressionFeedback }}</p>
              </div>
              
              <div class="feedback-section">
                <h4>改进建议</h4>
                <ul class="improvement-list">
                  <li v-for="(suggestion, idx) in feedback.improvements" :key="idx">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="feedback-actions">
              <el-button 
                type="primary" 
                size="small"
                @click="playRecording(index)"
                :disabled="!feedback.hasRecording"
              >
                <el-icon><VideoPlay /></el-icon>
                回听录音
              </el-button>
              
              <el-button 
                type="success" 
                size="small"
                @click="showReferenceAnswer(index)"
              >
                <el-icon><View /></el-icon>
                查看参考回答
              </el-button>
            </div>
          </div>
        </div>
      </section>

      <!-- 行动区 -->
      <section class="action-area">
        <div class="action-card">
          <div class="action-header">
            <h2>下一步行动</h2>
            <p>基于你的表现，我们为你准备了以下建议</p>
          </div>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large"
              class="action-btn download-btn"
              @click="downloadReport"
            >
              <el-icon><Download /></el-icon>
              下载完整报告
            </el-button>
            
            <el-button 
              type="success" 
              size="large"
              class="action-btn retry-btn"
              @click="retryInterview"
            >
              <el-icon><Refresh /></el-icon>
              再练一次
            </el-button>
            
            <el-button 
              type="info" 
              size="large"
              class="action-btn home-btn"
              @click="goHome"
            >
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </section>
    </main>

    <!-- 参考回答对话框 -->
    <el-dialog
      v-model="referenceDialogVisible"
      title="参考回答"
      width="600px"
      center
    >
      <div class="reference-dialog-content">
        <div class="reference-question">
          <h4>问题：{{ currentReferenceQuestion }}</h4>
        </div>
        <div class="reference-answer">
          <h4>参考回答：</h4>
          <div class="answer-content" v-html="currentReferenceAnswer"></div>
        </div>
        <div class="reference-tips">
          <h4>回答要点：</h4>
          <ul class="tips-list">
            <li v-for="(tip, index) in currentReferenceTips" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { House, Download, Refresh, VideoPlay, View } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

// 页面数据
const overallScore = ref(82)
const scoreGrade = ref('B+')
const technicalScore = ref(85)
const communicationScore = ref(78)
const logicScore = ref(82)
const confidenceScore = ref(75)
const cultureScore = ref(80)

// AI总评
const aiOverallFeedback = ref('整体表现良好，沟通清晰，技术基础扎实。在项目细节的深度上可以进一步加强，建议多准备具体的案例和数据来支撑观点。自信度有待提升，可以通过更多的练习来增强面试时的从容感。')

// 题目反馈数据
const questionFeedbacks = ref([
  {
    question: '请简单介绍一下你自己，包括你的教育背景和工作经验。',
    score: 85,
    contentFeedback: '自我介绍结构清晰，涵盖了关键信息。建议可以更突出与目标岗位相关的技能和经验。',
    expressionFeedback: '语速适中，表达流畅，但可以增加一些自信的语气。',
    improvements: [
      '突出与岗位相关的核心技能',
      '用具体数字量化工作成果',
      '展现对目标岗位的理解'
    ],
    hasRecording: true
  },
  {
    question: '请描述一个你遇到的技术难题，以及你是如何解决的？',
    score: 88,
    contentFeedback: '技术问题描述准确，解决思路清晰，体现了良好的问题解决能力。',
    expressionFeedback: '表达逻辑性强，技术术语使用恰当。',
    improvements: [
      '可以补充更多技术细节',
      '说明解决方案的优缺点',
      '分享从中学到的经验'
    ],
    hasRecording: true
  },
  {
    question: '在团队协作中，你是如何处理意见分歧的？',
    score: 75,
    contentFeedback: '回答体现了良好的团队合作意识，但可以给出更具体的处理案例。',
    expressionFeedback: '表达清晰，但语速稍快，可以适当放慢。',
    improvements: [
      '提供具体的冲突处理案例',
      '说明处理结果和影响',
      '展现沟通和协调能力'
    ],
    hasRecording: true
  },
  {
    question: '请谈谈你对这个岗位的理解，以及为什么选择我们公司？',
    score: 78,
    contentFeedback: '对公司有一定了解，但可以更深入地分析岗位要求。',
    expressionFeedback: '表达自然，展现了求职动机。',
    improvements: [
      '深入了解公司文化和价值观',
      '分析岗位的核心要求',
      '结合个人经历说明匹配度'
    ],
    hasRecording: false
  }
])

// 对话框状态
const referenceDialogVisible = ref(false)
const currentReferenceQuestion = ref('')
const currentReferenceAnswer = ref('')
const currentReferenceTips = ref([])

// 雷达图引用
const radarChart = ref(null)
let chartInstance = null

// 雷达图配置
const radarOptions = {
  title: {
    text: '能力评估',
    textStyle: {
      color: '#333',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item'
  },
  radar: {
    indicator: [
      { name: '技术能力', max: 100 },
      { name: '沟通表达', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '自信度', max: 100 },
      { name: '文化匹配', max: 100 }
    ],
    radius: '65%',
    splitNumber: 5,
    axisName: {
      color: '#666',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#ddd'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
      }
    }
  },
  series: [{
    name: '能力评分',
    type: 'radar',
    data: [{
      value: [technicalScore.value, communicationScore.value, logicScore.value, confidenceScore.value, cultureScore.value],
      name: '当前表现',
      areaStyle: {
        color: 'rgba(102, 126, 234, 0.3)'
      },
      lineStyle: {
        color: '#667eea'
      },
      itemStyle: {
        color: '#667eea'
      }
    }]
  }]
}

// 初始化雷达图
const initRadarChart = () => {
  if (radarChart.value) {
    chartInstance = echarts.init(radarChart.value)
    chartInstance.setOption(radarOptions)
    
    // 响应式处理
    window.addEventListener('resize', () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
  }
}

// 播放录音
const playRecording = (index) => {
  ElMessage.info(`正在播放第${index + 1}题的录音...`)
  // 这里可以集成实际的音频播放功能
}

// 显示参考回答
const showReferenceAnswer = (index) => {
  const feedback = questionFeedbacks.value[index]
  currentReferenceQuestion.value = feedback.question
  
  // 根据问题生成参考回答
  const referenceAnswers = {
    0: '我是一名有3年前端开发经验的工程师，毕业于XX大学计算机科学专业。在校期间，我专注于Web技术的学习，参与了多个前端项目的开发。毕业后，我在XX公司担任前端开发工程师，负责公司核心产品的前端架构设计和开发工作。我熟练掌握Vue、React等主流框架，对性能优化和用户体验有深入的理解。',
    1: '我遇到的一个技术难题是在优化一个大型列表组件的渲染性能时，当数据量达到10万条时，页面会出现明显的卡顿。我通过分析发现主要问题是DOM节点过多和频繁的重渲染。我采用了虚拟滚动技术，只渲染可视区域内的DOM节点，同时使用React.memo和useMemo来避免不必要的重渲染。最终将渲染时间从原来的3秒优化到200毫秒以内。',
    2: '在团队协作中，我遇到过一次关于技术选型的分歧。我建议使用新技术栈，而团队其他成员倾向于使用现有的稳定方案。我首先收集了详细的技术对比数据，包括性能、维护成本、学习曲线等，然后组织了一次技术分享会，让团队成员了解新技术的优势。最终我们达成了一个折中方案：在新项目中试用新技术，同时保持现有项目的稳定性。',
    3: '我对这个前端开发岗位的理解是，需要负责公司产品的前端架构设计、核心功能开发和性能优化。我选择贵公司是因为：1）公司产品在行业内具有领先地位，技术挑战性强；2）团队技术氛围浓厚，有完善的培训体系；3）公司重视技术创新，愿意尝试新技术。我相信我的技术能力和学习热情能够为团队带来价值。'
  }
  
  const referenceTips = {
    0: ['突出核心技能和经验', '用具体数字量化成果', '展现对目标岗位的理解'],
    1: ['详细描述问题背景', '说明解决思路和步骤', '量化优化效果'],
    2: ['展现沟通协调能力', '提供具体处理案例', '说明最终结果'],
    3: ['深入了解公司文化', '分析岗位要求', '结合个人经历']
  }
  
  currentReferenceAnswer.value = referenceAnswers[index] || '暂无参考回答'
  currentReferenceTips.value = referenceTips[index] || []
  referenceDialogVisible.value = true
}

// 下载报告
const downloadReport = () => {
  ElMessage.success('正在生成报告，请稍候...')
  // 这里可以集成实际的PDF生成和下载功能
}

// 再练一次
const retryInterview = () => {
  router.push('/interview/preparation')
}

// 返回首页
const goHome = () => {
  router.push('/')
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
    const pageElements = document.querySelectorAll('.interview-results-page *')
    pageElements.forEach(el => {
      if (el.style && el.style.overflow === 'hidden') {
        el.style.overflow = ''
      }
    })
  } catch (e) { /* 忽略 */ }
}

// 页面加载时初始化
onMounted(async () => {
  // 进入页面强制解锁滚动并做多次延迟兜底
  unlockScroll()
  setTimeout(unlockScroll, 50)
  setTimeout(unlockScroll, 200)
  setTimeout(unlockScroll, 500)
  
  // 解析路由参数
  try {
    if (route.query.duration) {
      // 可以在这里处理面试时长等参数
      console.log('面试时长:', route.query.duration)
    }
  } catch (error) {
    console.error('解析参数失败:', error)
  }
  
  // 等待DOM渲染完成后初始化图表
  await nextTick()
  initRadarChart()
})
</script> 

<style scoped>
.interview-results-page {
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

/* 表现总结区样式 */
.performance-summary {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 40px;
}

.summary-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 40px;
  text-align: center;
}

.summary-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.summary-subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

.summary-content {
  padding: 40px;
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.overall-score {
  text-align: center;
  flex-shrink: 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.score-max {
  font-size: 18px;
  opacity: 0.8;
}

.score-grade {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid #667eea;
}

.score-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.score-breakdown h3, .ai-feedback h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.breakdown-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.breakdown-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e9ecef;
}

.item-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.item-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-number {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.score-unit {
  font-size: 14px;
  color: #999;
}

.ai-feedback {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
}

.feedback-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* 雷达图区域样式 */
.radar-chart-section {
  margin-bottom: 40px;
}

.chart-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 30px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.card-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.card-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.chart-container {
  padding: 40px;
}

.radar-chart {
  width: 100%;
  height: 400px;
}

/* 详细反馈区样式 */
.detailed-feedback {
  margin-bottom: 40px;
}

.feedback-header {
  text-align: center;
  margin-bottom: 40px;
}

.feedback-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.feedback-header p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.feedback-item {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.question-header {
  background: #f8f9fa;
  padding: 25px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.question-info {
  flex: 1;
}

.question-number {
  display: inline-block;
  background: #667eea;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 15px;
  margin-bottom: 10px;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.question-score {
  text-align: center;
  flex-shrink: 0;
}

.question-score .score {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
  display: block;
}

.question-score .unit {
  font-size: 14px;
  color: #999;
}

.feedback-content {
  padding: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.feedback-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-section h4::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #667eea;
  border-radius: 2px;
}

.feedback-section p {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.improvement-list {
  padding-left: 20px;
  margin: 0;
}

.improvement-list li {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 8px;
}

.improvement-list li:last-child {
  margin-bottom: 0;
}

.feedback-actions {
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

/* 行动区样式 */
.action-area {
  margin-bottom: 40px;
}

.action-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.action-header {
  background: #f8f9fa;
  padding: 30px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.action-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.action-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.action-buttons {
  padding: 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  min-width: 160px;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.download-btn:hover {
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.4);
}

.retry-btn {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  color: #fff;
  box-shadow: 0 8px 20px rgba(82, 196, 26, 0.3);
}

.retry-btn:hover {
  box-shadow: 0 12px 25px rgba(82, 196, 26, 0.4);
}

.home-btn {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  border: none;
  color: #fff;
  box-shadow: 0 8px 20px rgba(250, 173, 20, 0.3);
}

.home-btn:hover {
  box-shadow: 0 12px 25px rgba(250, 173, 20, 0.4);
}

/* 参考回答对话框样式 */
.reference-dialog-content {
  padding: 20px 0;
}

.reference-question h4, .reference-answer h4, .reference-tips h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.reference-question h4 {
  color: #667eea;
}

.answer-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
}

.tips-list {
  padding-left: 20px;
  margin: 0;
}

.tips-list li {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 8px;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .summary-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-value {
    font-size: 36px;
  }
  
  .breakdown-items {
    grid-template-columns: 1fr;
  }
  
  .feedback-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .question-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .question-score {
    text-align: left;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .summary-header h1 {
    font-size: 28px;
  }
  
  .feedback-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }
  
  .summary-header {
    padding: 30px 20px;
  }
  
  .summary-content {
    padding: 20px;
  }
  
  .chart-container {
    padding: 20px;
  }
  
  .radar-chart {
    height: 300px;
  }
  
  .feedback-item {
    margin: 0 -15px;
    border-radius: 0;
  }
  
  .question-header, .feedback-content, .feedback-actions {
    padding: 20px;
  }
}
</style> 