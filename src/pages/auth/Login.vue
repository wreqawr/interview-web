<template>
  <div class="login-modern-bg">
    <!-- 全屏科技感背景 -->
    <div class="full-bg"></div>

    <!-- 背景图片 -->
    <div class="background-image">
      <img src="@/assets/welcome.svg" alt="背景图片"/>
    </div>

    <!-- 动态背景元素 -->
    <div class="tech-bg-elements">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-circle circle-4"></div>
      <div class="floating-circle circle-5"></div>
      <div class="floating-circle circle-6"></div>
      <div class="floating-circle circle-7"></div>
      <div class="floating-circle circle-8"></div>
      <div class="tech-grid"></div>

      <!-- 新增动态科技元素 -->
      <div class="tech-particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
        <div class="particle particle-6"></div>
        <div class="particle particle-7"></div>
        <div class="particle particle-8"></div>
        <div class="particle particle-9"></div>
        <div class="particle particle-10"></div>
        <div class="particle particle-11"></div>
        <div class="particle particle-12"></div>
        <div class="particle particle-13"></div>
        <div class="particle particle-14"></div>
        <div class="particle particle-15"></div>
        <div class="particle particle-16"></div>
      </div>

      <div class="tech-lines">
        <div class="tech-line line-1"></div>
        <div class="tech-line line-2"></div>
        <div class="tech-line line-3"></div>
        <div class="tech-line line-4"></div>
        <div class="tech-line line-5"></div>
        <div class="tech-line line-6"></div>
        <div class="tech-line line-7"></div>
        <div class="tech-line line-8"></div>
      </div>

      <div class="data-stream">
        <div class="data-bit bit-1"></div>
        <div class="data-bit bit-2"></div>
        <div class="data-bit bit-3"></div>
        <div class="data-bit bit-4"></div>
        <div class="data-bit bit-5"></div>
        <div class="data-bit bit-6"></div>
        <div class="data-bit bit-7"></div>
        <div class="data-bit bit-8"></div>
        <div class="data-bit bit-9"></div>
        <div class="data-bit bit-10"></div>
        <div class="data-bit bit-11"></div>
        <div class="data-bit bit-12"></div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="login-modern-wrapper">
      <!-- 顶部标题 -->
      <div class="top-title">
        <div class="tech-tagline">
          <h2>AI驱动的智能面试平台</h2>
          <p>让每一次面试都成为提升的机会</p>
        </div>
      </div>

      <!-- 中央登录表单 -->
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
                    placeholder="验证码"
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

      <!-- 底部注册和签名 -->
      <div class="bottom-content">
        <div class="register-panel">
          <p>还没有账号？<a class="register-link" @click.prevent="goRegister">立即注册</a></p>
        </div>

        <div class="signature">
          <p>designed by minglg</p>
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

<style scoped>
/* 全局样式确保背景完全覆盖 */
:deep(html), :deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

.login-modern-bg {
  min-height: 100vh;
  height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 高斯模糊背景 */
}

.login-modern-bg::before {
  content: '';
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
}

.login-modern-wrapper {
  position: relative;
  z-index: 1;
}

.login-modern-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 70px 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* 全屏背景 */
.full-bg {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: linear-gradient(135deg,
  rgba(0, 0, 0, 0.8) 0%,
  rgba(20, 20, 40, 0.8) 15%,
  rgba(40, 20, 80, 0.8) 30%,
  rgba(60, 40, 120, 0.8) 45%,
  rgba(80, 60, 160, 0.8) 60%,
  rgba(100, 80, 200, 0.8) 75%,
  rgba(120, 100, 240, 0.8) 90%,
  rgba(140, 120, 255, 0.8) 100%
  ),
  radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 70% 80%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 50% 50%, rgba(0, 255, 128, 0.2) 0%, transparent 50%) !important;
  z-index: 0 !important;
}

.full-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.5) 0%, transparent 60%),
  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.5) 0%, transparent 60%),
  radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.4) 0%, transparent 60%);
  z-index: 1;
}

.top-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
  text-align: center;
  margin-bottom: 12px;
}


/* 背景图片样式 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.2;
  overflow: hidden;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  /* 如果contain效果不理想，可以尝试以下选项之一： */
  /* object-fit: cover; */ /* 填满容器，可能裁剪 */
  /* object-fit: scale-down; */ /* 缩小以适应，不放大 */
}

/* 动态背景元素 */
.tech-bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
}

.floating-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.circle-4 {
  width: 90px;
  height: 90px;
  top: 40%;
  right: 30%;
  animation-delay: 1s;
}

.circle-5 {
  width: 70px;
  height: 70px;
  bottom: 40%;
  right: 25%;
  animation-delay: 3s;
}

.circle-6 {
  width: 50px;
  height: 50px;
  top: 10%;
  left: 60%;
  animation-delay: 2.5s;
  background: rgba(0, 255, 255, 0.18);
}

.circle-7 {
  width: 110px;
  height: 110px;
  bottom: 10%;
  left: 70%;
  animation-delay: 4.2s;
  background: rgba(0, 255, 255, 0.12);
}

.circle-8 {
  width: 60px;
  height: 60px;
  top: 75%;
  left: 80%;
  animation-delay: 5.1s;
  background: rgba(0, 255, 255, 0.15);
}

.tech-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
  radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px;
  opacity: 0.5;
  animation: gridMove 20s linear infinite;
}

.tech-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line-1 {
  top: 30%;
  width: 60%;
  left: 20%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  width: 40%;
  left: 30%;
  animation-delay: 2s;
}

.line-3 {
  top: 70%;
  width: 80%;
  left: 10%;
  animation-delay: 4s;
}

.line-4 {
  top: 15%;
  width: 70%;
  left: 10%;
  animation-delay: 1.5s;
}

.line-5 {
  top: 85%;
  width: 60%;
  left: 20%;
  animation-delay: 2.5s;
}

.line-6 {
  top: 40%;
  width: 80%;
  left: 5%;
  animation-delay: 3.5s;
}

.line-7 {
  top: 60%;
  width: 50%;
  left: 40%;
  animation-delay: 4.5s;
}

.line-8 {
  top: 75%;
  width: 30%;
  left: 60%;
  animation-delay: 5.5s;
}

.bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
  text-align: center;
  color: #fff;
  margin-top: 8px;
}


.tech-tagline {
  text-align: center;
  max-width: 600px;
}

.tech-tagline h2 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff !important;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6), 0 3px 15px rgba(0, 0, 0, 0.4);
}

.tech-tagline p {
  font-size: 22px;
  color: #ffffff !important;
  line-height: 1.6;
  margin: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5), 0 2px 12px rgba(0, 0, 0, 0.3);
}

.register-panel {
  text-align: center;
  color: #ffffff !important;
  margin-bottom: 4px;
}

.register-panel p {
  font-size: 18px;
  margin-bottom: 24px;
  color: #ffffff !important;
  line-height: 1.6;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5), 0 2px 12px rgba(0, 0, 0, 0.3);
}

.signature {
  text-align: center;
  z-index: 5;
}

.signature p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7) !important;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

.center-login {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
  flex: 1;
  margin: 0;
}

.login-modern-card {
  width: 350px;
  padding: 48px 32px 32px 32px;
  border-radius: 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  background: transparent;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

.login-modern-title {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
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

/* 动画关键帧 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes lineFlow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) scale(0.8);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-30px) scale(1.1);
    opacity: 0.9;
  }
}

@keyframes techLineFlow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes dataFlow {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(100px) rotate(360deg);
    opacity: 0;
  }
}

/* 新增动态科技元素样式 */
.tech-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 255, 255, 0.8);
  border-radius: 50%;
  animation: particleFloat 8s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1.5s;
}

.particle-3 {
  bottom: 30%;
  left: 25%;
  animation-delay: 3s;
}

.particle-4 {
  top: 40%;
  right: 35%;
  animation-delay: 4.5s;
}

.particle-5 {
  bottom: 60%;
  right: 15%;
  animation-delay: 6s;
}

.particle-6 {
  top: 10%;
  left: 80%;
  animation-delay: 0.5s;
}

.particle-7 {
  top: 80%;
  left: 10%;
  animation-delay: 1.2s;
}

.particle-8 {
  top: 50%;
  left: 90%;
  animation-delay: 2.1s;
}

.particle-9 {
  top: 90%;
  left: 50%;
  animation-delay: 2.8s;
}

.particle-10 {
  top: 30%;
  left: 70%;
  animation-delay: 3.5s;
}

.particle-11 {
  top: 70%;
  left: 30%;
  animation-delay: 4.2s;
}

.particle-12 {
  top: 60%;
  left: 80%;
  animation-delay: 4.9s;
}

.particle-13 {
  top: 20%;
  left: 60%;
  animation-delay: 5.6s;
}

.particle-14 {
  top: 80%;
  left: 60%;
  animation-delay: 6.3s;
}

.particle-15 {
  top: 60%;
  left: 20%;
  animation-delay: 7.0s;
}

.particle-16 {
  top: 40%;
  left: 80%;
  animation-delay: 7.7s;
}

.tech-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.tech-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.6), transparent);
  height: 1px;
  animation: techLineFlow 6s linear infinite;
}

.line-1 {
  top: 25%;
  width: 40%;
  left: 30%;
  animation-delay: 0s;
}

.line-2 {
  top: 55%;
  width: 60%;
  left: 20%;
  animation-delay: 2s;
}

.line-3 {
  top: 75%;
  width: 50%;
  left: 25%;
  animation-delay: 4s;
}

.line-4 {
  top: 15%;
  width: 70%;
  left: 10%;
  animation-delay: 1.5s;
}

.line-5 {
  top: 85%;
  width: 60%;
  left: 20%;
  animation-delay: 2.5s;
}

.line-6 {
  top: 40%;
  width: 80%;
  left: 5%;
  animation-delay: 3.5s;
}

.line-7 {
  top: 60%;
  width: 50%;
  left: 40%;
  animation-delay: 4.5s;
}

.line-8 {
  top: 75%;
  width: 30%;
  left: 60%;
  animation-delay: 5.5s;
}

.data-stream {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.data-bit {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 0, 255, 0.8);
  border-radius: 2px;
  animation: dataFlow 4s linear infinite;
}

.bit-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bit-2 {
  top: 30%;
  left: 20%;
  animation-delay: 0.8s;
}

.bit-3 {
  top: 50%;
  left: 30%;
  animation-delay: 1.6s;
}

.bit-4 {
  top: 70%;
  left: 40%;
  animation-delay: 2.4s;
}

.bit-5 {
  top: 90%;
  left: 50%;
  animation-delay: 3.2s;
}

.bit-6 {
  top: 15%;
  right: 20%;
  animation-delay: 0.4s;
}

.bit-7 {
  top: 45%;
  right: 30%;
  animation-delay: 1.2s;
}

.bit-8 {
  top: 85%;
  right: 40%;
  animation-delay: 2.8s;
}

.bit-9 {
  top: 10%;
  left: 40%;
  animation-delay: 3.6s;
}

.bit-10 {
  top: 50%;
  left: 10%;
  animation-delay: 4.2s;
}

.bit-11 {
  top: 90%;
  left: 80%;
  animation-delay: 3.0s;
}

.bit-12 {
  top: 10%;
  left: 80%;
  animation-delay: 2.8s;
}

@media (max-width: 900px) {
  .login-modern-wrapper {
    height: 100vh;
    padding: 0 0 40px 0;
    overflow: hidden;
  }

  .top-title, .center-login, .bottom-content {
    width: 100%;
    min-width: 0;
    padding: 10px 8px;
  }

  .login-modern-card {
    width: 100%;
    min-width: 0;
    box-shadow: none;
    padding: 20px 8px 16px 8px;
  }

  .bottom-content {
    margin-top: 8px;
  }

  .tech-tagline h2 {
    font-size: 28px;
  }

  .tech-tagline p {
    font-size: 16px;
  }
}

.register-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 4px;
  transition: color 0.2s;
}

.register-link:hover {
  color: #1867c0;
  text-decoration: underline;
}
</style>