import http from './http'
import {ASSISTANT_CHAT_URL, INTERVIEW_CHAT_PREPARE_URL, INTERVIEW_CHAT_PROGRESS_URL} from './endpoints'
import {executeApiRequest} from './apiUtils'

/**
 * AI聊天相关API
 */
export const aiApi = {
    /**
     * 发送聊天消息
     * @param {Object} params 请求参数
     * @param {string} params.conversationId 对话ID
     * @param {string} params.userMessage 用户消息
     * @param {string} params.taskType 任务类型，默认为GENERAL_CHAT
     * @param {Object} params.params 额外参数，可选
     * @returns {Promise<string>} 返回AI回复内容，如果请求失败则抛出错误
     */
    chat: async (params) => {
        // 设置默认值
        const chatParams = {
            conversationId: params.conversationId,
            userMessage: params.userMessage,
            taskType: params.taskType || 'GENERAL_CHAT',
            params: params.params || {}
        }

        return await executeApiRequest(
            () => http.post(ASSISTANT_CHAT_URL, chatParams),
            'AI聊天'
        )
    },

    /**
     * 获取对话历史
     * @param {string} conversationId 对话ID
     * @returns {Promise<Object>} 响应结果
     */
    getHistory: async (conversationId) => {
        try {
            return await http.get(`${ASSISTANT_CHAT_URL}/history/${conversationId}`)
        } catch (error) {
            console.error('获取对话历史失败:', error)
            throw error
        }
    },

    /**
     * 清空对话历史
     * @param {string} conversationId 对话ID
     * @returns {Promise<Object>} 响应结果
     */
    clearHistory: async (conversationId) => {
        try {
            return await http.delete(`${ASSISTANT_CHAT_URL}/history/${conversationId}`)
        } catch (error) {
            console.error('清空对话历史失败:', error)
            throw error
        }
    },

    /**
     * 面试聊天准备
     * @param {Object} params 请求参数
     * @param {string} params.conversationId 对话ID
     * @param {string} params.jobId 岗位ID
     * @param {string} params.resumeId 简历ID
     * @returns {Promise<string>} 返回AI回复内容，如果请求失败则抛出错误
     */
    interviewPrepare: async (params) => {
        // 构建请求参数
        const payload = {
            conversationId: params.conversationId,
            jobId: params.jobId,
            resumeId: params.resumeId
        }

        return await executeApiRequest(
            () => http.post(INTERVIEW_CHAT_PREPARE_URL, payload),
            '面试准备'
        )
    },
    /**
     * 面试进度（用户作答）
     * @param {Object} params 请求参数
     * @param {string} params.conversationId 对话ID
     * @param {string} params.userMessage 用户消息
     * @returns {Promise<string>} 返回AI回复内容，如果请求失败则抛出错误
     */
    interviewProgress: async (params) => {
        // 构建请求参数
        const payload = {
            conversationId: params.conversationId,
            userMessage: params.userMessage
        }

        return await executeApiRequest(
            () => http.post(INTERVIEW_CHAT_PROGRESS_URL, payload),
            '面试进度'
        )
    }
}

export default aiApi
