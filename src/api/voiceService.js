// 标准服务 - 用于调用后端 API
import http from "./http";
import {AICallAgentType, AICallErrorCode} from "aliyun-auikit-aicall";

// WorkflowType 枚举
const WorkflowType = {
    VoiceChat: 'VoiceChat',
    AvatarChat3D: 'AvatarChat3D',
    VisionChat: 'VisionChat',
    VideoChat: 'VideoChat'
}

// AgentType 到 WorkflowType 的映射
const AgentTypeWorkflowTypeMap = {
    [AICallAgentType.AvatarAgent]: WorkflowType.AvatarChat3D,
    [AICallAgentType.VoiceAgent]: WorkflowType.VoiceChat,
    [AICallAgentType.VisionAgent]: WorkflowType.VisionChat,
    [AICallAgentType.VideoAgent]: WorkflowType.VideoChat
}

// 获取 WorkflowType
function getWorkflowType(agentType) {
    if (!agentType) return WorkflowType.VoiceChat
    if (AgentTypeWorkflowTypeMap[agentType]) return AgentTypeWorkflowTypeMap[agentType]
    return WorkflowType.VoiceChat
}

class StandardAppService {
    // 生成 AI 智能体实例（Standard 模式使用）
    async generateAIAgent(userId, token, config) {
        if (!userId) {
            throw new Error('userId is empty')
        }

        const param = {
            user_id: userId,
            expire: 24 * 60 * 60,
            template_config: JSON.stringify({})
        }

        // 如果有 agentId，使用 agentId；否则使用 workflow_type
        if (config.agentId) {
            param.ai_agent_id = config.agentId
        } else {
            param.workflow_type = getWorkflowType(config.agentType)
        }

        // 处理 templateConfig
        if (config.templateConfig) {
            param.template_config = config.templateConfig.getJsonString
                ? config.templateConfig.getJsonString(config.agentType)
                : JSON.stringify(config.templateConfig)
        }

        // 处理 agentConfig
        if (config.agentConfig) {
            param.agent_config = config.agentConfig.toJSON
                ? JSON.stringify(config.agentConfig.toJSON())
                : JSON.stringify(config.agentConfig)
        }

        // 处理 userData
        if (config.userData) {
            param.user_data = config.userData
        }

        // 处理 region
        if (config.region) {
            param.region = config.region
        }

        // 处理 chatSyncConfig
        if (config.chatSyncConfig) {
            if (config.chatSyncConfig.sessionId) {
                param.session_id = config.chatSyncConfig.sessionId
            }
            if (config.chatSyncConfig.getConfigString) {
                param.chat_sync_config = config.chatSyncConfig.getConfigString()
            }
        }

        const url = `/api/ai/agent/generateAIAgentCall`

        try {
            const response = await http.post(url, param)
            const data = response.data

            // 处理特殊错误码
            if (data.error_code === 'Forbidden.SubscriptionRequired') {
                const error = new Error('Forbidden.SubscriptionRequired')
                error.code = AICallErrorCode.AgentSubscriptionRequired
            } else if (data.error_code === 'AgentNotFound') {
                const error = new Error('AgentNotFound')
                error.code = AICallErrorCode.AgentNotFound
            }

            // 处理 HTTP 错误状态码
            if (response.status === 403) {
                const error = new Error('token is invalid')
                error.name = 'ServiceAuthError'
            }

            // 处理响应数据
            if (data.code === 200) {
                const parseData = data.data
                return {
                    agentType: config.agentType,
                    instanceId: parseData.ai_agent_instance_id,
                    channelId: parseData.channel_id,
                    userId: parseData.ai_agent_user_id,
                    rtcToken: parseData.rtc_auth_token,
                    reqId: parseData.request_id || ''
                }
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

