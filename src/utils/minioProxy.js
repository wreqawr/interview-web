/**
 * MinIO 代理工具
 * 用于将 HTTP 的 MinIO URL 转换为通过 nginx 代理的 HTTPS URL
 * 解决 HTTPS 页面加载 HTTP 资源的混合内容问题
 */

/**
 * 将 MinIO 的 HTTP URL 转换为通过 nginx 代理的 HTTPS URL
 * @param {string} minioUrl - MinIO 的原始 URL（HTTP）
 * @returns {string} - 转换后的 HTTPS 代理 URL
 *
 * @example
 * // 输入: http://minio:9000/resume-upload-4/1767445596189.pdf?X-Amz-Algorithm=...
 * // 输出: /minio/resume-upload-4/1767445596189.pdf?X-Amz-Algorithm=...
 */
export function convertMinioUrlToProxy(minioUrl) {
  if (!minioUrl || typeof minioUrl !== 'string') {
    return minioUrl
  }

  // 如果已经是 HTTPS 或相对路径，直接返回
  if (minioUrl.startsWith('https://') || minioUrl.startsWith('/')) {
    return minioUrl
  }

    // 解析 MinIO URL
    try {
      const url = new URL(minioUrl)

      // 检查是否是 MinIO 服务器（仅支持容器主机名）
      // 容器内部主机名: minio:9000
      // 注意：不检查公网 IP，避免安全风险
      const isMinioUrl =
        url.host === 'minio:9000' ||
        (url.hostname === 'minio' && url.port === '9000')

      if (!isMinioUrl) {
        // 不是 MinIO URL，直接返回
        return minioUrl
      }

      // 提取路径和查询参数
      const path = url.pathname
      const search = url.search

      // 构建代理 URL
      // 使用当前页面的协议和域名，通过 /minio/ 路径代理
      // 这样浏览器可以通过 HTTPS 访问，nginx 会代理到容器内的 MinIO
      return `/minio${path}${search}`
  } catch (error) {
    console.error('转换 MinIO URL 失败:', error, minioUrl)
    // 解析失败，返回原 URL
    return minioUrl
  }
}
