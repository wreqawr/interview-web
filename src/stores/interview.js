import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

export const useInterviewStore = defineStore('interview', () => {
  // 默认配置
  const defaultConfig = {
    position: '',
    resumeId: '',
    mode: 'chat', // 默认文字面试，避免直接进入 /interview/chat 时校验失败
    resumeInfo: null,
    positionInfo: null
  }

  // 从本地恢复
  const SESSION_KEY = 'interview_config'
  let restored = null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) restored = JSON.parse(raw)
  } catch (_) {
    // ignore JSON parse/localStorage errors
  }

  // 面试配置
  const interviewConfig = ref({ ...defaultConfig, ...(restored || {}) })

  // 面试状态
  const interviewState = ref({
    isStarted: false,
    startTime: null,
    currentQuestionIndex: 0,
    totalQuestions: 5,
    isPaused: false,
    answers: [], // 用户回答记录
    currentAnswer: '' // 当前问题的回答
  })

  // 设置面试配置
  const setInterviewConfig = (config) => {
    interviewConfig.value = { ...interviewConfig.value, ...config }
  }

  // 持久化：监听配置变化，写入 localStorage
  watch(interviewConfig, (val) => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(val))
    } catch (_) {
      // ignore write errors (e.g., private mode)
    }
  }, { deep: true })

  // 设置简历信息
  const setResumeInfo = (resume) => {
    interviewConfig.value.resumeInfo = resume
  }

  // 设置职位信息
  const setPositionInfo = (position) => {
    interviewConfig.value.positionInfo = position
  }

  // 开始面试
  const startInterview = () => {
    interviewState.value.isStarted = true
    interviewState.value.startTime = new Date()
    interviewState.value.currentQuestionIndex = 0
    interviewState.value.answers = []
    interviewState.value.currentAnswer = ''
  }

  // 暂停面试
  const pauseInterview = () => {
    interviewState.value.isPaused = true
  }

  // 继续面试
  const resumeInterview = () => {
    interviewState.value.isPaused = false
  }

  // 结束面试
  const endInterview = () => {
    interviewState.value.isStarted = false
    interviewState.value.startTime = null
    interviewState.value.currentQuestionIndex = 0
    interviewState.value.answers = []
    interviewState.value.currentAnswer = ''
  }

  // 下一题
  const nextQuestion = () => {
    if (interviewState.value.currentQuestionIndex < interviewState.value.totalQuestions - 1) {
      // 保存当前回答
      if (interviewState.value.currentAnswer.trim()) {
        interviewState.value.answers[interviewState.value.currentQuestionIndex] = interviewState.value.currentAnswer
      }

      interviewState.value.currentQuestionIndex++
      interviewState.value.currentAnswer = ''
    }
  }

  // 上一题
  const previousQuestion = () => {
    if (interviewState.value.currentQuestionIndex > 0) {
      // 保存当前回答
      if (interviewState.value.currentAnswer.trim()) {
        interviewState.value.answers[interviewState.value.currentQuestionIndex] = interviewState.value.currentAnswer
      }

      interviewState.value.currentQuestionIndex--
      interviewState.value.currentAnswer = interviewState.value.answers[interviewState.value.currentQuestionIndex] || ''
    }
  }

  // 设置当前回答
  const setCurrentAnswer = (answer) => {
    interviewState.value.currentAnswer = answer
  }

  // 获取面试时长（秒）
  const getInterviewDuration = () => {
    if (!interviewState.value.startTime) return 0
    return Math.floor((new Date() - interviewState.value.startTime) / 1000)
  }

  // 获取剩余时间（秒）
  const getRemainingTime = () => {
    const totalTime = 30 * 60 // 30分钟
    const usedTime = getInterviewDuration()
    return Math.max(0, totalTime - usedTime)
  }

  // 获取进度百分比
  const getProgressPercent = () => {
    return Math.min(((interviewState.value.currentQuestionIndex + 1) / interviewState.value.totalQuestions) * 100, 100)
  }

  // 清空所有数据
  const clearInterviewData = () => {
    interviewConfig.value = { ...defaultConfig }
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch (_) {
      // ignore remove errors
    }
    interviewState.value = {
      isStarted: false,
      startTime: null,
      currentQuestionIndex: 0,
      totalQuestions: 5,
      isPaused: false,
      answers: [],
      currentAnswer: ''
    }
  }

  return {
    // 状态
    interviewConfig,
    interviewState,

    // 方法
    setInterviewConfig,
    setResumeInfo,
    setPositionInfo,
    startInterview,
    pauseInterview,
    resumeInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    setCurrentAnswer,
    getInterviewDuration,
    getRemainingTime,
    getProgressPercent,
    clearInterviewData
  }
})
