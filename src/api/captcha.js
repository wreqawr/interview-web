import http from './http';
import {GET_CAPTCHA_URL} from './endpoints';

export async function getCaptcha() {
    const response = await http.get(GET_CAPTCHA_URL, {
        responseType: 'blob' // 设置响应类型为blob以处理二进制数据
    });

    // 从响应头获取captchaId
    const captchaId = response.headers['captchaid'];

    // 创建图片URL
    const captchaImageUrl = URL.createObjectURL(response.data);

    return {
        captchaId,
        captchaImageUrl
    };
}
