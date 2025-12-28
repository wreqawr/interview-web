// Proxy 模式控制器 - 完全按照 React 版本实现
import {AICallErrorCode, AICallState} from 'aliyun-auikit-aicall'
import AUIAICallController from './AUIAICallController'
import AUIAICallAuthTokenHelper from './AUIAICallAuthTokenHelper'

export default class AUIAICallProxyController extends AUIAICallController {
  async start() {
    console.log('ProxyController', 'Start')
    const startTs = Date.now()

    if (this.state === AICallState.Connected ||
        this.state === AICallState.Connecting) {
      return
    }

    this.state = AICallState.Connecting

    // 只添加引擎监听器，不调用 initEngine（与 React 版本完全一致）
    this.addEngineListener()

    try {
      // 监听智能体启动事件
      this.engine.once('agentStarted', () => {
        const instanceInfo = this.engine.agentInfo
        console.log('ProxyController', 'GenerateAIAgentSuccess', { value: Date.now() - startTs })

        this._agentInfo = instanceInfo
        this.emit('AICallAIAgentStarted', instanceInfo, Date.now() - startTs)

        // 不需要等待 describeAIAgent 接口返回
        this.describeAIAgentInstance(instanceInfo.instanceId)
      })

      // 监听通话开始事件
      this.engine.once('callBegin', () => {
        const elapsedTime = Date.now() - startTs
        console.log('ProxyController', 'StartSuccess', { value: elapsedTime })
        this.emit('AICallBegin', elapsedTime)
        this.state = AICallState.Connected
      })

      // 监听数据通道可用事件
      this.engine.once('agentDataChannelAvailable', () => {
        const elapsedTime = Date.now() - startTs
        console.log('ProxyController', 'AgentDataChannelAvailable', { value: elapsedTime })
      })

      // 获取 RTC Token
      const authToken = await AUIAICallAuthTokenHelper.shared.fetchAuthToken(this.userId)
      console.log('AuthToken received:', authToken ? 'yes' : 'no', authToken?.substring(0, 50))
      this.config.userJoinToken = authToken

      // 调试：打印 config 内容
      console.log('Call config:', {
        agentType: this.config.agentType,
        agentId: this.config.agentId,
        region: this.config.region,
        userId: this.config.userId,
        userJoinToken: this.config.userJoinToken ? 'set' : 'empty',
      })

      // 建立通话连接（与 React 版本完全一致）
      console.log('ProxyController', 'Calling callWithConfig with config:', {
        agentId: this.config.agentId,
        agentType: this.config.agentType,
        region: this.config.region,
        userId: this.config.userId,
        hasToken: !!this.config.userJoinToken
      })
      try {
        await this.engine.callWithConfig(this.config)
        console.log('ProxyController', 'callWithConfig promise resolved')
      } catch (error) {
        console.error('ProxyController', 'callWithConfig promise rejected:', error)
      }

      // 为下次通话请求新 Token
      await AUIAICallAuthTokenHelper.shared.requestNewAuthToken()

      if (this.engineConfig.agentElement) {
        this.engine?.setAgentView(this.engineConfig.agentElement)
      }

      if (this.state === AICallState.Over) {
        await this.handup()
      }
    } catch (error) {
      this._errorCode = error.code || error.errorCode || AICallErrorCode.BeginCallFailed
      this.state = AICallState.Error
      await this.handup()
      console.error('StartCallFailed', error)
      throw error
    }
  }
}
