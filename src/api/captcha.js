import http from './http';
import { GET_CAPTCHA_URL } from './endpoints';

export async function getCaptcha() {
  const { data } = await http.get(GET_CAPTCHA_URL);
  return {
    captchaId: data.captcha_id,
    captchaImageUrl: data.captcha_image.replace(/\s+/g, '')
  };
}
