import { ENV_INFO } from '@/config/env';

// 使用环境配置获取API基础URL
export const WEB_MVC_BASE_URL = ENV_INFO.apiWebMvcBaseUrl;
// 新增：WebFlux 基础URL
export const WEB_FLUX_BASE_URL = ENV_INFO.apiWebFluxBaseUrl;

// 认证接口
export const AUTH_API = `${WEB_MVC_BASE_URL}/auth`;
// 简历接口
export const RESUME_API = `${WEB_MVC_BASE_URL}/resume`;
// ai接口
export const AI_API = `${WEB_MVC_BASE_URL}/ai`;
// 求职者接口
export const CANDIDATE_API = `${WEB_MVC_BASE_URL}/candidate`;

// 登录
export const LOGIN_URL = `${AUTH_API}/login`;
// 注册
export const REGISTER_URL = `${AUTH_API}/register`;
// 退出
export const LOGOUT_URL = `${AUTH_API}/logout`;
// 公钥
export const PUB_KEY_URL = `${AUTH_API}/publicKey`;
// 验证码
export const CAPTCHA_URL = `${AUTH_API}/captcha?t=${Date.now()}`;
// 简历上传
export const RESUME_UPLOAD_URL = `${RESUME_API}/upload`;
// 获取用户简历列表
export const RESUME_METADATA_URL = `${RESUME_API}/getMyResume`;
// 获取用户上传简历后的异步任务状态
export const RESUME_METADATA_ASYNC_URL = `${RESUME_API}/queryResumeAsyncUploadResult`;
// 简历删除
export const RESUME_DELETE_URL = `${RESUME_API}/delete`;
// 简历预览
export const RESUME_PREVIEW_URL = `${RESUME_API}/preview`;
// 简历下载
export const RESUME_DOWNLOAD_URL = `${RESUME_API}/download`;
// 简历分析
export const RESUME_ANALYZE_URL = `${RESUME_API}/analyze`;
// 获取用户上传简历后的异步任务状态
export const RESUME_ANALYZE_ASYNC_URL = `${RESUME_API}/queryResumeAsyncAnalyzeResult`;
// 获取求职者已经申请过的岗位信息
export const CANDIDATE_JOBS_URL = `${CANDIDATE_API}/getJobList`;
// ai聊天助手使用 WebFlux 基础URL
export const ASSISTANT_CHAT_URL = `${WEB_FLUX_BASE_URL}/ai/assistant`;
// ai文字面试接口地址
export const INTERVIEW_CHAT_URL = `${WEB_FLUX_BASE_URL}/interview/chat/prepare`;
// 导出环境信息，方便调试
export { ENV_INFO };
