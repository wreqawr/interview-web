/**
 * API工具函数
 * 用于处理通用的API响应逻辑
 */

/**
 * 处理标准响应格式
 * 响应格式: { code: 200, message: "success", data: ... }
 * @param {Object} response - axios响应对象
 * @returns {*} 返回data字段的内容
 * @throws {Error} 如果code不为200，抛出错误
 */
export function handleStandardResponse(response) {
    const responseData = response.data

    if (responseData.code === 200) {
        // 请求成功，返回data字段的内容
        return responseData.data || ''
    } else {
        // 请求失败，抛出错误，错误信息为message字段
        const error = new Error(responseData.message || '请求失败')
        error.code = responseData.code
        throw error
    }
}

/**
 * 处理API请求错误
 * @param {Error} error - 错误对象
 * @param {string} errorContext - 错误上下文信息，用于日志记录
 * @returns {Error} 返回处理后的错误对象
 */
export function handleApiError(error, errorContext = '请求') {
    console.error(`${errorContext}失败:`, error)

    // 如果是业务错误（code不为200），直接抛出
    if (error.code) {
        throw error
    }

    // 如果是网络错误或其他错误，构造错误信息
    let errorMessage = '网络连接出现问题，请检查网络后重试。'
    if (error.response) {
        // axios错误响应
        const responseData = error.response.data
        if (responseData && responseData.message) {
            errorMessage = responseData.message
        } else if (error.response.status === 401) {
            errorMessage = '认证失败，请重新登录。'
        } else if (error.response.status === 403) {
            errorMessage = '权限不足，无法访问AI助手。'
        } else if (error.response.status === 500) {
            errorMessage = '服务器内部错误，请稍后再试。'
        }
    }

    const finalError = new Error(errorMessage)
    finalError.originalError = error
    throw finalError
}

/**
 * 执行API请求并处理响应
 * 这是一个高阶函数，用于统一处理API请求的响应和错误
 * @param {Function} requestFn - 返回Promise的请求函数
 * @param {string} errorContext - 错误上下文信息，用于日志记录
 * @returns {Promise<*>} 返回处理后的响应数据
 */
export async function executeApiRequest(requestFn, errorContext = '请求') {
    try {
        const response = await requestFn()
        return handleStandardResponse(response)
    } catch (error) {
        handleApiError(error, errorContext)
    }
}

