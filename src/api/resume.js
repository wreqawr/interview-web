import http from './http';
import {
  RESUME_ANALYZE_ASYNC_URL,
  RESUME_ANALYZE_URL,
  RESUME_DELETE_URL,
  RESUME_DOWNLOAD_URL,
  RESUME_METADATA_ASYNC_URL,
  RESUME_METADATA_URL,
  RESUME_PREVIEW_URL,
  RESUME_UPLOAD_URL
} from './endpoints';

/**
 * 简历上传接口
 * @param {File} file - 需要上传的简历文件
 * @returns {Promise}
 */
export async function uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return await http.post(RESUME_UPLOAD_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 获取用户简历列表接口
 * @returns {Promise}
 */
export async function getResumeList() {
    return await http.get(RESUME_METADATA_URL);
}

/**
 * 查询简历异步上传结果接口
 * @param {string} taskId - 任务ID
 * @param {string} resumeId - 简历ID
 * @returns {Promise}
 */
export async function queryResumeAsyncResult(taskId, resumeId) {
    return await http.get(`${RESUME_METADATA_ASYNC_URL}/${taskId}/${resumeId}`);
}

/**
 * 删除简历接口
 * @param {Array<string>} resumeIds - 简历ID数组
 * @returns {Promise}
 */
export async function deleteResumes(resumeIds) {
    return await http.delete(RESUME_DELETE_URL, {
        data: resumeIds
    });
}

/**
 * 获取简历预览地址接口
 * @param {string} resumeId - 简历ID
 * @returns {Promise}
 */
export async function getResumePreviewUrl(resumeId) {
    return await http.get(`${RESUME_PREVIEW_URL}/${resumeId}`);
}

/**
 * 获取简历下载链接接口
 * @param {Array<string>} resumeIds - 简历ID数组
 * @returns {Promise}
 */
export async function getResumeDownloadUrls(resumeIds) {
    const params = new URLSearchParams();
    resumeIds.forEach(id => params.append('resumeIds', id));
    return await http.get(`${RESUME_DOWNLOAD_URL}?${params.toString()}`);
}

/**
 * 简历分析接口
 * @param {string} resumeId - 简历ID
 * @returns {Promise}
 */
export async function analyzeResume(resumeId) {
    return await http.get(`${RESUME_ANALYZE_URL}/${resumeId}`);
}

/**
 * 查询简历异步分析结果接口
 * @param {string} taskId - 任务ID
 * @param {string} resumeId - 简历ID
 * @returns {Promise}
 */
export async function queryResumeAnalyzeAsyncResult(taskId, resumeId) {
    return await http.get(`${RESUME_ANALYZE_ASYNC_URL}/${taskId}/${resumeId}`);
} 