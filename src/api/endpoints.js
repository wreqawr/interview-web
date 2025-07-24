export const BASE_URL = "http://localhost:8081/api";
// 认证接口
export const AUTH_API = `${BASE_URL}/auth`;
// 简历接口
export const RESUME_API = `${BASE_URL}/resume`;

// 登录
export const LOGIN_URL = `${AUTH_API}/login`;
// 注册
export const REGISTER_URL = `${AUTH_API}/register`;
// 公钥
export const PUB_KEY_URL = `${AUTH_API}/publicKey`;
// 验证码
export const CAPTCHA_URL = `${AUTH_API}/captcha?t=${Date.now()}`;
// 简历上传
export const RESUME_UPLOAD_URL = `${RESUME_API}/upload`;