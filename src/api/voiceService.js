// 标准服务 - 用于调用后端 API
import http from "./http";

class StandardAppService {
    constructor() {
        this.appServer = ''
        this.serverAuth = ''
    }

    setAppServer(appServer) {
        this.appServer = appServer
    }

    // 获取 RTC 认证 Token
    async getRtcAuthToken(userId, channelId) {
        const payload = {
            user_id: userId,
            channel_id: channelId,
        }
        const url = `/api/ai/agent/getRtcAuthToken`

        try {
            const response = await http.post(url, payload)

            const data = response.data

            if (data.code === 200) {
                // 与 React 版本保持一致，访问 data.data.rtc_auth_token
                return data.data?.rtc_auth_token || data.rtc_auth_token
            }
        } catch (error) {
            // 处理 HTTP 错误状态码
            if (error.response) {
                if (error.response.status === 403) {
                    const authError = new Error('token is invalid')
                    authError.name = 'ServiceAuthError'
                    throw authError
                } else if (error.response.status !== 200) {
                    throw new Error(`response status is ${error.response.status}`)
                }
            }
            // 重新抛出其他错误
            throw error
        }
    }

    // 描述智能体实例
    async describeAIAgentInstance(userId, token, region, instanceId) {
        if (!userId || !instanceId) {
            throw new Error('userId or instanceId is empty')
        }

        const payload = {
            user_id: userId,
            ai_agent_instance_id: instanceId,
            region,
        }
        const url = '/api/ai/agent/describeAIAgentInstance'

        try {
            // 如果 appServer 为空，使用相对路径
            const response = await http.post(url, payload)

            const data = response.data

            if (data.code === 200) {
                // 与 React 版本保持一致，访问 data.data.agent_config
                const agentConfig = data.data?.agent_config || data.runtime_config
                return JSON.parse(agentConfig || '{}')
            }

        } catch (error) {
            // 处理 HTTP 错误状态码
            if (error.response) {
                if (error.response.status === 403) {
                    const authError = new Error('token is invalid')
                    authError.name = 'ServiceAuthError'
                    throw authError
                } else if (error.response.status !== 200) {
                    throw new Error(`describeAIAgentInstance error, response status: ${error.response.status}`)
                }
            }
            // 重新抛出其他错误
            throw error
        }
    }
}

export default new StandardAppService()

