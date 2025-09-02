import http from './http'
import {ASSISTANT_CHAT_URL, INTERVIEW_CHAT_URL} from './endpoints'

/**
 * AI聊天相关API
 */
export const aiApi = {
  /**
   * 发送聊天消息（流式响应）
   * @param {Object} params 请求参数
   * @param {string} params.conversationId 对话ID
   * @param {string} params.userMessage 用户消息
   * @param {string} params.taskType 任务类型，默认为GENERAL_CHAT
   * @param {Object} params.params 额外参数，可选
   * @param {Function} params.onData 流式数据回调函数
   * @param {Function} params.onComplete 完成回调函数
   * @param {Function} params.onError 错误回调函数
   * @returns {Promise<void>} 无返回值，通过回调函数处理数据
   */
  chat: async (params) => {
    try {
      const { onData, onComplete, onError, ...requestParams } = params
      
      // 设置默认值
      const chatParams = {
        conversationId: requestParams.conversationId,
        userMessage: requestParams.userMessage,
        taskType: requestParams.taskType || 'GENERAL_CHAT',
        params: requestParams.params || {}
      }

      // 创建fetch请求，支持流式响应
      const token = sessionStorage.getItem('Authorization')
      const response = await fetch(ASSISTANT_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(chatParams)
      })

      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        let reading = true
        while (reading) {
          const { done, value } = await reader.read()
          
          if (done) {
            // 处理缓冲区中剩余的数据
            if (buffer.trim() && onData) {
              // 处理最后的数据块
              const lines = buffer.split('\n')
              for (const line of lines) {
                const trimmedLine = line.trim()
                if (trimmedLine.startsWith('data:')) {
                  const content = trimmedLine.substring(5).trim()
                  if (content) {
                    onData(content)
                  }
                }
              }
            }
            if (onComplete) {
              onComplete()
            }
            reading = false
            break
          }

          // 解码数据并添加到缓冲区
          buffer += decoder.decode(value, { stream: true })
          
          // 处理完整的数据块
          if (onData && buffer.trim()) {
            // 按行分割数据，只处理以 "data:" 开头的行
            const lines = buffer.split('\n')
            
            for (const line of lines) {
              const trimmedLine = line.trim()
              if (trimmedLine.startsWith('data:')) {
                // 提取 "data:" 后面的内容
                const content = trimmedLine.substring(5).trim()
                if (content) {
                  onData(content)
                }
              }
            }
            
            buffer = ''
          }
        }
      } catch (streamError) {
        if (onError) {
          onError(streamError)
        }
      }
    } catch (error) {
      console.error('AI聊天请求失败:', error)
      if (params.onError) {
        params.onError(error)
      } else {
        throw error
      }
    }
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
   * 面试聊天准备（流式响应）
   * @param {Object} params { conversationId, jobId, resumeId, onData, onComplete, onError }
   */
  interviewPrepare: async (params) => {
    try {
      const { onData, onComplete, onError, ...requestParams } = params
      const payload = {
        conversationId: requestParams.conversationId,
        jobId: requestParams.jobId,
        resumeId: requestParams.resumeId
      }

      const token = sessionStorage.getItem('Authorization')
      const response = await fetch(INTERVIEW_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(payload)
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        let reading = true
        while (reading) {
          const { done, value } = await reader.read()
          if (done) {
            if (buffer.trim() && onData) {
              const lines = buffer.split('\n')
              for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed.startsWith('data:')) {
                  const content = trimmed.substring(5).trim()
                  if (content) onData(content)
                }
              }
            }
            if (onComplete) onComplete()
            reading = false
            break
          }

          buffer += decoder.decode(value, { stream: true })
          if (onData && buffer.trim()) {
            const lines = buffer.split('\n')
            for (const line of lines) {
              const trimmed = line.trim()
              if (trimmed.startsWith('data:')) {
                const content = trimmed.substring(5).trim()
                if (content) onData(content)
              }
            }
            buffer = ''
          }
        }
      } catch (streamErr) {
        if (onError) onError(streamErr);
      }
    } catch (error) {
      console.error('面试准备流式请求失败:', error)
      if (params.onError) params.onError(error); else throw error
    }
  }
}

export default aiApi 