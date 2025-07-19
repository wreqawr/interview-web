<template>
  <div class="login-modern-bg">
    <div class="login-modern-wrapper">
      <!-- 左侧注册引导 -->
      <div class="login-modern-left">
        <div class="left-bg"></div>
        <img class="modern-illustration" src="@/assets/welcom.svg" alt="插画" />
        <div class="register-panel">
          <h2>新用户？</h2>
          <p>输入您的信息成为我们的客户</p>
          <el-button class="register-btn" type="primary" plain @click="goRegister">注册</el-button>
        </div>
      </div>
      <!-- 右侧登录表单 -->
      <div class="login-modern-right">
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
                placeholder="密码"
                :prefix-icon="Lock"
                class="modern-input"
                size="large"
                show-password
                clearable
              />
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { getCaptchaUrl } from '@/api/captcha'

const router = useRouter()
const form = ref({
  username: '',
  password: '',
  captcha: ''
})
const rules = {
  username: [{ required: true, message: '请输入账号/手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const captchaUrl = ref(getCaptchaUrl())
function refreshCaptcha() {
  captchaUrl.value = getCaptchaUrl()
}
const loginForm = ref(null)
function onLogin() {
  loginForm.value.validate((valid) => {
    if (valid) {
      // 登录逻辑
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
.login-modern-bg {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-modern-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.login-modern-left {
  position: relative;
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
}
.left-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 120%;
  height: 100%;
  background: linear-gradient(135deg, #409eff 60%, #4f8cff 100%);
  border-bottom-right-radius: 60% 100%;
  border-top-right-radius: 60% 100%;
  z-index: 0;
}
.modern-illustration {
  width: 220px;
  margin-bottom: 32px;
  z-index: 1;
}
.register-panel {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
}
.register-panel h2 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  letter-spacing: 2px;
}
.register-panel p {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.95;
}
.register-btn {
  border-radius: 24px;
  font-size: 18px;
  padding: 8px 36px;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  transition: background 0.2s, color 0.2s;
}
.register-btn:hover {
  background: #fff;
  color: #409eff;
}
.login-modern-right {
  flex: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.login-modern-card {
  width: 350px;
  padding: 48px 32px 32px 32px;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(64,158,255,0.10);
  background: #fff;
  text-align: center;
}
.login-modern-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 32px;
  letter-spacing: 2px;
}

.modern-login-btn {
  width: 100%;
  border-radius: 24px;
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
.captcha-img {
  height: 40px;
  width: 120px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #eee;
  background: #f5f5f5;
  object-fit: cover;
  user-select: none;
  margin-left: 10px;
}
@media (max-width: 900px) {
  .login-modern-wrapper {
    flex-direction: column;
    height: auto;
  }
  .login-modern-left, .login-modern-right {
    flex: none;
    width: 100%;
    min-width: 0;
    border-radius: 0;
    padding: 24px 8px;
  }
  .login-modern-card {
    width: 100%;
    min-width: 0;
    box-shadow: none;
    padding: 24px 8px 16px 8px;
  }
  .left-bg {
    width: 100vw;
    border-radius: 0;
  }
}
</style> 