import { ENV_INFO } from '@/config/env';

// 使用环境配置获取API基础URL
export const GATEWAY_BASE_URL = ENV_INFO.apiGatewayBaseUrl;

// 用户接口
export const USER_API = `${GATEWAY_BASE_URL}/user`;

// 简历接口
export const RESUME_API = `${GATEWAY_BASE_URL}/resume`;
// 求职者接口
// export const CANDIDATE_API = `${WEB_MVC_BASE_URL}/candidate`;

// 登录
export const USER_LOGIN_URL = `${USER_API}/login`;
// 注册
export const USER_REGISTER_URL = `${USER_API}/register`;
// 退出
export const USER_LOGOUT_URL = `${USER_API}/logout`;
// 公钥
export const USER_PUB_KEY_URL = `${USER_API}/publicKey`;
// 验证码
export const USER_CAPTCHA_URL = `${USER_API}/captcha?t=${Date.now()}`;
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
// export const CANDIDATE_JOBS_URL = `${CANDIDATE_API}/getJobList`;
// ai聊天助手使用 WebFlux 基础URL
// export const ASSISTANT_CHAT_URL = `${WEB_FLUX_BASE_URL}/ai/assistant`;
export const ASSISTANT_CHAT_URL = `http://localhost:8081/test/flux`;
// ai文字面试准备接口地址
// export const INTERVIEW_CHAT_PREPARE_URL = `${WEB_FLUX_BASE_URL}/interview/chat/prepare`;
// ai文字面试接口地址
// export const INTERVIEW_CHAT_PROGRESS_URL = `${WEB_FLUX_BASE_URL}/interview/chat/progress`;
// 导出环境信息，方便调试
export { ENV_INFO };
