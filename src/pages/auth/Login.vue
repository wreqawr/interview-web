<template>
  <div class="login-container">
    <!-- 左侧：科技感背景和欢迎信息 -->
    <div class="login-left">
      <!-- 渐变背景和光斑 -->
      <div class="gradient-bg"></div>
      <div class="blur-circle blur1"></div>
      <div class="blur-circle blur2"></div>
      <div class="blur-circle blur3"></div>
      <!-- 粒子特效 -->
      <div class="particles">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
        <div class="particle p6"></div>
        <div class="particle p7"></div>
        <div class="particle p8"></div>
        <div class="particle p9"></div>
        <div class="particle p10"></div>
      </div>
      <!-- SVG插画和WELCOME字样 -->
      <div class="welcome-svg-wrap">
        <img src="@/assets/welcome.svg" alt="welcome" class="welcome-svg" />
      </div>
      <!-- 顶部标题、副标题 -->
      <div class="left-header">
        <h2 class="left-title">AI驱动的智能面试平台</h2>
        <p class="left-desc">让每一次面试都成为提升的机会</p>
      </div>
      <!-- 注册和签名 -->
      <div class="left-bottom">
        <div class="register-panel">
          <p>还没有账号？</p>
          <button class="register-btn" @click.prevent="goRegister">立即注册→</button>
        </div>
        <div class="signature">designed by minglg</div>
      </div>
      <!-- 发光圆圈/粒子特效 -->
      <div class="effect-circles">
        <div class="effect-circle ec1"></div>
        <div class="effect-circle ec2"></div>
        <div class="effect-circle ec3"></div>
        <div class="effect-circle ec4"></div>
        <div class="effect-circle ec5"></div>
      </div>
    </div>
    <!-- 右侧：登录表单 -->
    <div class="login-right">
      <div class="center-login">
        <div class="login-modern-card">
          <h2 class="login-modern-title">登录</h2>
          <el-form :model="form" :rules="rules" ref="loginForm" label-width="0" @submit.prevent>
            <el-form-item prop="username">
              <el-input
                  v-model="form.username"
                  placeholder="账号/手机号"
                  :prefix-icon="User"
                  class="modern-input"
                  size="large"
                  clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="密码"
                  :prefix-icon="Lock"
                  class="modern-input"
                  size="large"
                  clearable
              >
                <template #suffix>
                  <el-icon @click="showPassword = !showPassword" style="cursor:pointer;">
                    <component :is="showPassword ? Hide : View"/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <div class="captcha-flex">
                <el-input
                    v-model="form.captcha"
                    placeholder="请输入右侧验证码计算结果"
                    maxlength="6"
                    class="captcha-input modern-input"
                    size="large"
                    clearable
                    :prefix-icon="Key"
                />
                <img
                    :src="captchaUrl"
                    class="captcha-img"
                    @click="refreshCaptcha"
                    title="点击刷新"
                    alt="验证码"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="modern-login-btn" size="large" @click="onLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {Hide, Key, Lock, User, View} from '@element-plus/icons-vue'
import {getCaptcha} from '@/api/captcha'
import {login, getPublicKey, encryptPassword} from '@/api/auth'
import {getTimestamp} from '@/utils/tools'
import {ElMessage} from 'element-plus'

const router = useRouter()
const form = ref({
  username: '',
  password: '',
  captcha: ''
})
const rules = {
  username: [{required: true, message: '请输入账号/手机号', trigger: 'blur'}],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, message: '密码长度至少3位', trigger: 'blur'}
  ],
  captcha: [{required: true, message: '请输入验证码', trigger: 'blur'}]
}
const captchaUrl = ref('')
const captchaId = ref('')
const showPassword = ref(false)

// 初始化验证码
onMounted(async () => {
  await refreshCaptcha()
})

async function refreshCaptcha() {
  try {
    const {captchaId: newCaptchaId, captchaImageUrl} = await getCaptcha()
    captchaUrl.value = captchaImageUrl
    captchaId.value = newCaptchaId
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

const loginForm = ref(null)

async function onLogin() {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      try {
        // 第一步：获取公钥
        const publicKey = await getPublicKey()
        // 第二步：拼接密码和20位时间戳并加密
        const timestamp = getTimestamp()
        const encryptedPwd = encryptPassword(publicKey, form.value.password + timestamp)
        // 构造登录参数
        const loginPayload = {
          username: form.value.username,
          password: encryptedPwd,
          captcha: form.value.captcha
        }
        // 第三步：发送请求
        const result = await login(loginPayload, captchaId.value)
        if (result && result.code === 200) {
          ElMessage.success(result.message || '登录成功')
          // 可跳转页面等后续逻辑
        } else {
          ElMessage.error(result.message || '登录失败')
          await refreshCaptcha()
          form.value.password = ''
        }
      } catch (error) {
        ElMessage.error('登录失败')
        await refreshCaptcha()
        form.value.password = ''
      }
    }
  })
}

function goRegister() {
  router.push('/register')
}
</script>

<script>
export default {
  name: 'AuthLogin'
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}
</style>

<style scoped>
.login-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
}
.login-left {
  position: relative;
  width: 50vw;
  min-width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  z-index: 1;
  background: #fff;
  border-radius: 0 48px 48px 0;
}
.gradient-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background:
    linear-gradient(135deg, #3a3f8f 0%, #7b3ff2 60%, #4fd1c5 100%),
    rgba(255,255,255,0.88);
  z-index: 0;
  border-radius: 0 48px 48px 0;
  overflow: hidden;
}
.blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.35;
  z-index: 1;
}
.blur1 { width: 320px; height: 320px; left: 10%; top: 10%; background: #6c63ff; }
.blur2 { width: 200px; height: 200px; right: 5%; top: 60%; background: #4fd1c5; }
.blur3 { width: 180px; height: 180px; left: 60%; top: 70%; background: #ff6584; }
.welcome-svg-wrap {
  position: absolute;
  left: 0; right: 0; top: 50%;
  transform: translateY(-40%);
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;
}
.welcome-svg {
  width: 80%;
  max-width: 600px;
  opacity: 0.92;
  pointer-events: none;
}
.left-header,
.left-title,
.left-desc,
.left-bottom,
.signature {
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) both !important;
}
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(48px); }
  100% { opacity: 1; transform: translateY(0); }
}
.left-header {
  position: absolute;
  top: 60px;
  left: 0; right: 0;
  text-align: center;
  z-index: 10;
  /* 移除背景、圆角、内边距、阴影 */
  background: none;
  border-radius: 0;
  padding: 0;
  margin: 0 auto;
  max-width: 90%;
  box-shadow: none;
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) both !important;
}
.left-title {
  font-size: 38px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6);
  margin-bottom: 12px;
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) 0.1s both;
}
.left-desc {
  font-size: 20px;
  color: #e0eaff;
  text-shadow: 0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6);
  margin: 0;
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) 0.3s both;
}
.left-bottom {
  position: absolute;
  left: 0; right: 0; bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  /* 移除背景、圆角、内边距、阴影 */
  background: none;
  border-radius: 0;
  padding: 0;
  max-width: 90%;
  margin: 0 auto;
  box-shadow: none;
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) both !important;
}
.register-panel {
  margin-bottom: 12px;
  text-align: center;
  color: #fff;
  font-size: 18px;
}
.register-btn {
  margin-top: 8px;
  padding: 8px 32px;
  border-radius: 24px;
  border: 2px solid #b6aaff;
  background: linear-gradient(90deg, #a18fff 0%, #6c63ff 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0 0 16px 2px #a18fff66, 0 2px 12px rgba(108,99,255,0.12);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  animation: pulseGlow 2.2s infinite alternate cubic-bezier(.4,0,.2,1);
}
.register-btn:hover {
  background: linear-gradient(90deg, #6c63ff 0%, #a18fff 100%);
  box-shadow: 0 4px 24px rgba(108,99,255,0.18);
}
.signature {
  color: #e0eaff;
  font-size: 14px;
  font-style: italic;
  letter-spacing: 1px;
  text-shadow: 0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6);
  margin-top: 8px;
  animation: fadeUp 1.2s cubic-bezier(.23,1.02,.32,1) 0.7s both;
}
.effect-circles {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  z-index: 3;
  pointer-events: none;
}
.effect-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18);
  box-shadow: 0 0 32px 8px rgba(108,99,255,0.12);
  animation: effectCircleAnim 8s linear infinite;
}
.ec1 { width: 120px; height: 120px; left: 8%; top: 18%; animation-delay: 0s; }
.ec2 { width: 80px; height: 80px; right: 12%; top: 30%; animation-delay: 2s; }
.ec3 { width: 60px; height: 60px; left: 20%; bottom: 18%; animation-delay: 4s; }
.ec4 { width: 90px; height: 90px; right: 30%; top: 60%; animation-delay: 1s; }
.ec5 { width: 70px; height: 70px; left: 60%; bottom: 10%; animation-delay: 3s; }
@keyframes effectCircleAnim {
  0%,100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.15) rotate(180deg); }
}
.particles {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  z-index: 4;
  pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.7;
  background: radial-gradient(circle, #fff 0%, #a18fff 80%, transparent 100%);
  animation: particleFloat 8s ease-in-out infinite;
}
.p1 { width: 10px; height: 10px; left: 12%; top: 22%; animation-delay: 0s; }
.p2 { width: 8px; height: 8px; left: 30%; top: 12%; animation-delay: 1.2s; }
.p3 { width: 12px; height: 12px; left: 60%; top: 18%; animation-delay: 2.1s; }
.p4 { width: 7px; height: 7px; left: 80%; top: 30%; animation-delay: 3.3s; }
.p5 { width: 9px; height: 9px; left: 18%; top: 60%; animation-delay: 4.5s; }
.p6 { width: 6px; height: 6px; left: 40%; top: 80%; animation-delay: 5.7s; }
.p7 { width: 11px; height: 11px; left: 70%; top: 70%; animation-delay: 6.2s; }
.p8 { width: 8px; height: 8px; left: 85%; top: 60%; animation-delay: 7.1s; }
.p9 { width: 10px; height: 10px; left: 55%; top: 45%; animation-delay: 2.8s; }
.p10 { width: 7px; height: 7px; left: 25%; top: 80%; animation-delay: 3.9s; }
@keyframes particleFloat {
  0%,100% { opacity: 0.7; transform: translateY(0) scale(1); }
  50% { opacity: 1; transform: translateY(-18px) scale(1.2); }
}
.login-right {
  position: relative;
  width: 50vw;
  min-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 2;
}
.center-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.login-modern-card {
  width: 380px;
  padding: 48px 32px 32px 32px;
  border-radius: 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.13);
  background: #fff;
  text-align: center;
  border: none;
  position: relative;
  z-index: 2;
}
.login-modern-title {
  font-size: 32px;
  font-weight: bold;
  color: #222;
  margin-bottom: 32px;
  letter-spacing: 2px;
}
.modern-login-btn {
  width: 100%;
  border-radius: 16px;
  font-size: 18px;
  padding: 12px 0;
  background: #409eff;
  border: none;
  font-weight: 600;
}
.modern-login-btn:hover {
  background: #66b1ff;
}
.captcha-flex {
  display: flex;
  align-items: center;
  width: 100%;
}
.captcha-input {
  flex: 1 1 0;
}
.modern-input {
  border-radius: 12px !important;
}
.captcha-img {
  height: 40px;
  width: 120px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #eee;
  background: #f5f5f5;
  object-fit: cover;
  user-select: none;
  margin-left: 10px;
}
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }
  .login-left, .login-right {
    width: 100vw;
    min-width: 0;
    height: 50vh;
  }
  .center-login {
    min-height: 200px;
  }
  .login-modern-card {
    width: 100%;
    min-width: 0;
    box-shadow: none;
    padding: 20px 8px 16px 8px;
  }
}
</style>