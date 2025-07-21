export const BASE_URL = "http://localhost:8081";

export const LOGIN_URL = `${BASE_URL}/api/auth/login`;
export const REGISTER_URL = `${BASE_URL}/api/auth/register`;
export const GET_PUB_KEY_URL = `${BASE_URL}/api/auth/publicKey`;
export const GET_CAPTCHA_URL = `${BASE_URL}/api/auth/captcha?t=${Date.now()}`; 