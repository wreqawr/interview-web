import http from './http'
import { AI_CHAT_URL } from './endpoints'

/**
 * AI聊天助手API
 */
export const aiApi = {
  /**
   * 发送聊天消息（流式响应）
   * @param {Object} params - 聊天参数
   * @param {string} params.conversationId - 对话ID
   * @param {string} params.userMessage - 用户消息
   * @returns {Promise<Response>} 流式响应
   */
  chatStream(params) {
    const token = sessionStorage.getItem('Authorization')
    console.log('AI聊天请求参数:', params)
    console.log('使用的token:', token ? '已设置' : '未设置')
    
    // 构建GET请求URL（适配后端 @GetMapping("/chat/{conversationId}/{userMessage}"）
    const url = `${AI_CHAT_URL}/${encodeURIComponent(params.conversationId)}/${encodeURIComponent(params.userMessage)}`
    
    console.log('AI聊天请求URL:', url)
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token || ''
      }
    })
  },

  /**
   * 发送聊天消息（普通响应）
   * @param {Object} params - 聊天参数
   * @param {string} params.conversationId - 对话ID
   * @param {string} params.userMessage - 用户消息
   * @returns {Promise<Object>} 响应数据
   */
  chat(params) {
    return http.post(AI_CHAT_URL, params)
  }
}

export default aiApi 