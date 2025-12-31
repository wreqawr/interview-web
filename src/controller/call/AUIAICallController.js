// AI 通话控制器基类 - 完全按照 React 版本实现
import EventEmitter from 'eventemitter3'
import ARTCAICallEngine, {
  AICallAgentError,
  AICallAgentType,
  AICallConnectionStatus,
  AICallState,
} from 'aliyun-auikit-aicall'

export default class AUIAICallController extends EventEmitter {
  constructor(userId, config = {}) {
    super()
    this._userId = String(userId)
    this._currentEngine = null
    this.engineConfig = config || {}
    this.config = {
      agentType: AICallAgentType.VoiceAgent,
    }
    /** @type {AICallState} */
    this._state = AICallState.None
    this._errorCode = null
    this._agentInfo = null
  }
  get engine() {
    return this._currentEngine
  }

  get userId() {
    return this._userId
  }

  get state() {
    return this._state
  }

  set state(state) {
    this._state = state
    this.emit('AICallStateChanged', state)
  }

  get errorCode() {
    return this._errorCode
  }

  get agentInfo() {
    return this._agentInfo
  }
// 初始化引擎
  async initEngine() {
    // 如果引擎已存在且已初始化，先清理
    if (this._currentEngine) {
      try {
        await this._currentEngine.handup()
        this._currentEngine.removeAllListeners()
      } catch (e) {
        // 忽略清理错误
      }
      this._currentEngine = null
    }

    this._currentEngine = new ARTCAICallEngine()

    try {
      await this._currentEngine.init(this.config.agentType, this.engineConfig)
      console.log('Controller', 'InitEngineSuccess')
    } catch (error) {
      console.error('InitEngineFailed', error)
      this._currentEngine = null
      throw error
    }
  }

  // 添加引擎事件监听 - 完全按照 React 版本
  addEngineListener() {
    // 注意：不在这里创建引擎实例，由 initEngine 统一创建
    if (!this._currentEngine) {
      // 如果引擎不存在，先创建一个实例（但不初始化）
      this._currentEngine = new ARTCAICallEngine()
    }

    // 错误事件
    this._currentEngine.on('errorOccurred', (errorCode, msg) => {
      this._errorCode = errorCode
      this.state = AICallState.Error
      this.engine?.handup()
      console.error('AICallErrorOccurred', new AICallAgentError(msg || `code: ${errorCode}`, errorCode))
    })

    // Agent 状态相关
    this._currentEngine.on('agentStateChange', (newState) => {
      this.emit('AICallAgentStateChanged', newState)
    })

    // 实时字幕相关
    this._currentEngine.on('agentSubtitleNotify', (data) => {
      if (this.state !== AICallState.Connected) return
      this.emit('AICallAgentSubtitleNotify', data)
    })

    this._currentEngine.on('userSubtitleNotify', (data, voiceprintResult) => {
      if (this.state !== AICallState.Connected) return
      this.emit('AICallUserSubtitleNotify', data, voiceprintResult)
    })

    this._currentEngine.on('agentEmotionNotify', (emotion, sentenceId) => {
      this.emit('AICallAgentEmotionNotify', emotion, sentenceId)
    })

    this._currentEngine.on('latencyStats', (stats) => {
      this.emit('AICallLatencyStats', stats)
    })

    // 鉴权相关
    this._currentEngine.on('authInfoWillExpire', async () => {
      const token = await this.requestRTCToken()
      this.engine?.updateToken(token)
    })

    this._currentEngine.on('authInfoExpired', async () => {
      const token = await this.requestRTCToken()
      this.engine?.updateToken(token)
    })

    // 本地说话状态
    this._currentEngine.on('speakingVolumeChanged', (userId, volume) => {
      this.emit('AICallActiveSpeakerVolumeChanged', userId, volume)
    })

    this._currentEngine.on('pushToTalkChanged', (enable) => {
      this.emit('AICallPushToTalkChanged', enable)
    })

    this._currentEngine.on('agentWillLeave', (reason, message) => {
      this.emit('AICallAgentWillLeave', reason, message)
    })

    this._currentEngine.on('receivedAgentCustomMessage', (data) => {
      this.emit('AICallReceivedAgentCustomMessage', data)
    })

    this._currentEngine.on('audioSubscribed', (userId, audioElement) => {
      this.emit('AICallAgentAudioSubscribed', audioElement)
    })

    // 真人接管相关
    this._currentEngine.on('humanTakeoverWillStart', (uid, mode) => {
      this.emit('AICallHumanTakeoverWillStart', uid, mode)
    })

    this._currentEngine.on('humanTakeoverConnected', (uid) => {
      this.emit('AICallHumanTakeoverConnected', uid)
    })

    this._currentEngine.on('visionCustomCaptureChanged', (enable) => {
      this.emit('AICallVisionCustomCaptureChanged', enable)
    })

    this._currentEngine.on('speakingInterrupted', (reason) => {
      this.emit('AICallSpeakingInterrupted', reason)
    })

    this._currentEngine.on('callEnd', () => {
      this.emit('AICallEnd')
    })

    this._currentEngine.on('llmReplyCompleted', (text, sentenceId) => {
      console.log('llmReplyCompleted', text, sentenceId)
    })

    this._currentEngine.on('agentDataChannelAvailable', () => {
      console.log('agentDataChannelAvailable')
    })

    this._currentEngine.on('autoPlayFailed', () => {
      this.emit('AICallAgentAutoPlayFailed')
    })

    this._currentEngine.on('receivedAgentVcrResult', (result) => {
      this.emit('AICallReceivedAgentVcrResult', result)
    })

    this._currentEngine.on('connectionStatusChange', (status) => {
      if (this.state === AICallState.Connected && status === AICallConnectionStatus.Connected) {
        // 重连成功，请求当前智能体状态
        setTimeout(() => {
          this._currentEngine?.queryCurrentAgentState()
        }, 500)
      }
    })
  }


  // 请求 RTC Token - 完全按照 React 版本
  async requestRTCToken() {
    console.log('Controller', 'RequestRTCToken')
    if (this.state === AICallState.Connected) {
      this.engine?.requestRTCToken()

      // 等待返回新的 RTC token
      return new Promise((resolve) => {
        this.engine?.once('newRTCToken', (token) => {
          resolve(token)
        })
      })
    }
    return ''
  }

  // 静音/取消静音 - 完全按照 React 版本
  muteMicrophone(mute) {
    console.log('Controller', 'MuteMicrophone', { mute: mute ? 'off' : 'on' })
    if (this.state === AICallState.Connected) {
      this.engine?.mute(mute)
      return true
    }
    return false
  }

  // 挂断
  async handup() {
    console.log('Controller', 'Handup')
    const currentState = this.state
    if (this.state === AICallState.Over || this.state === AICallState.Error) {
      // 即使状态已经是 Over 或 Error，也要清理引擎
      if (this._currentEngine) {
        try {
          await this._currentEngine.handup()
          this._currentEngine.removeAllListeners()
        } catch (e) {
          // 忽略清理错误
        }
        this._currentEngine = null
      }
      return
    }
    this.state = AICallState.Over
    const agent = this.engine?.agentInfo
    if (agent && currentState === AICallState.Connected) {
      await this.stopAIAgent()
    }
    if (this._currentEngine) {
      try {
        await this._currentEngine.handup()
        this._currentEngine.removeAllListeners()
      } catch (e) {
        // 忽略清理错误
      }
      this._currentEngine = null
    }
    this.removeAllListeners()
  }

  async stopAIAgent() {
    console.log('Controller', 'StopAIAgent')
    await this.engine?.stopAgent()
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    })
  }

  // 抽象方法，子类实现
  async start() {
    throw new Error('start method must be implemented by subclass')
  }

  destroy() {
    // 子类可以重写此方法
  }
}
