import http from './http'
import {AI_CHAT_URL} from './endpoints'

/**
 * AI聊天相关API
 */
export const aiApi = {
  /**
   * 发送聊天消息
   * @param {Object} params 请求参数
   * @param {string} params.conversationId 对话ID
   * @param {string} params.userMessage 用户消息
   * @returns {Promise<Object>} 响应结果
   */
  chat: async (params) => {
    try {
      const response = await http.post(AI_CHAT_URL, params)
      return response.data
    } catch (error) {
      console.error('AI聊天请求失败:', error)
      throw error
    }
  },

  /**
   * 获取对话历史
   * @param {string} conversationId 对话ID
   * @returns {Promise<Object>} 响应结果
   */
  getHistory: async (conversationId) => {
    try {
      return await http.get(`${AI_CHAT_URL}/history/${conversationId}`)
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
      return await http.delete(`${AI_CHAT_URL}/history/${conversationId}`)
    } catch (error) {
      console.error('清空对话历史失败:', error)
      throw error
    }
  }
}

export default aiApi 