import http from './http';
import { RESUME_UPLOAD_URL } from './endpoints';

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