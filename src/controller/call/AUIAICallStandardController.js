// Standard 模式控制器 - 完全按照 vue-voice 实现
import { AICallAgentError, AICallErrorCode, AICallState } from 'aliyun-auikit-aicall'
import AUIAICallController from './AUIAICallController'
import standardService from '@/api/voiceService'

export default class AUIAICallStandardController extends AUIAICallController {
  constructor(userId, token, config = {}) {
    super(userId, token, config)
  }

  async start() {
    const startTs = Date.now()
    if (this.state === AICallState.Connected || this.state === AICallState.Connecting) return
    this.state = AICallState.Connecting

    this.addEngineListener()
    let instanceInfo = undefined
    try {
      [instanceInfo] = await Promise.all([this.startAIAgent(), this.initEngine()])
    } catch (error) {
      this._errorCode = error.code || error.errorCode || AICallErrorCode.BeginCallFailed
      if (error.name === 'ServiceAuthError') {
        this.emit('AICallUserTokenExpired')
      }
      this.state = AICallState.Error
      throw error
    }

    // 可能通话已经结束，不再继续
    if (this.state !== AICallState.Connecting) return

    this._agentInfo = instanceInfo
    this.emit('AICallAIAgentStarted', instanceInfo, Date.now() - startTs)

    if (!this._currentEngine) {
      throw new AICallAgentError('engine not init')
    }

    try {
      let callBeginTriggered = false

      this.engine.once('callBegin', () => {
        callBeginTriggered = true
        const elapsedTime = Date.now() - startTs
        this.emit('AICallBegin', elapsedTime)
        this.state = AICallState.Connected
      })

      await this.engine.call(this.userId, instanceInfo)

      if (this.engineConfig?.agentElement) {
        this.engine?.setAgentView(this.engineConfig.agentElement)
      }

      // 如果 callBegin 事件没有触发，延迟检查并更新状态
      if (!callBeginTriggered && this.state === AICallState.Connecting) {
        setTimeout(() => {
          if (this.state === AICallState.Connecting && this.engine) {
            // 检查引擎是否有 agentInfo，如果有说明连接成功
            if (this.engine.agentInfo) {
              this.emit('AICallBegin', Date.now() - startTs)
              this.state = AICallState.Connected
            }
          }
        }, 1000) // 延迟 1 秒检查
      }

      if (this.state === AICallState.Over) {
        await this.handup()
      }
    } catch (error) {
      this._errorCode = error.errorCode || error.code || AICallErrorCode.BeginCallFailed
      this.state = AICallState.Error
      await this.handup()
      throw error
    }
  }

  async startAIAgent() {
    let agentInfo = null
    Date.now();
    try {
      if (this.shareConfig) {
        agentInfo = await this.engine?.generateShareAgentCall(this.shareConfig, this.userId)
      } else {
        agentInfo = await standardService.generateAIAgent(this.userId, this.token, this.config)
      }
    } catch (error) {
      throw error
    }

    if (!agentInfo) {
      throw new AICallAgentError('generate ai agent failed')
    }

    // 不需要等待 describeAIAgentInstance 接口返回
    await this.describeAIAgentInstance(agentInfo.instanceId)

    return agentInfo
  }

  destroy() {
    super.destroy()
  }
}
