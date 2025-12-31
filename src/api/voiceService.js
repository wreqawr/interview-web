// 标准服务 - 用于调用后端 API
import http from "./http"
import {INTERVIEW_VOICE_URL} from './endpoints'
import {AICallAgentType} from 'aliyun-auikit-aicall'

class StandardAppService {
    // 生成 AI 智能体实例（Standard 模式使用）
    // @param {Object} params 请求参数
    // @param {string} params.resumeId 简历ID
    // @param {string|number} params.jobId 岗位ID
    async generateAIAgent(params) {
        const param = {
            resumeId: params.resumeId,
            jobId: params.jobId
        }

        const response = await http.post(INTERVIEW_VOICE_URL, param)
        const {data} = response

        // 处理响应数据
        if (data.code === 200) {
            const parseData = data.data
            return {
                agentType: AICallAgentType.VoiceAgent,
                instanceId: parseData.ai_agent_instance_id,
                channelId: parseData.channel_id,
                userId: parseData.ai_agent_user_id,
                rtcToken: parseData.rtc_auth_token,
                reqId: parseData.request_id || ''
            }
        }

    }
}

export default new StandardAppService()

