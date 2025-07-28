<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div class="profile-header">
        <el-avatar :size="80" :src="user.avatar || defaultAvatar" />
        <div class="profile-info">
          <h2>{{ user.nickname || '未设置昵称' }}</h2>
          <el-tag type="success" v-if="user.role">{{ roleMap[user.role] || user.role }}</el-tag>
          <p class="profile-email"><el-icon><Message /></el-icon> {{ user.email || '未绑定邮箱' }}</p>
          <p class="profile-date"><el-icon><Calendar /></el-icon> 注册时间：{{ user.registerDate || '-' }}</p>
        </div>
      </div>
      <el-divider>快捷入口</el-divider>
      <div class="profile-actions">
        <el-button type="primary" icon="User" @click="goEdit">编辑资料</el-button>
        <el-button type="info" icon="Document" @click="goResume">我的简历</el-button>
        <el-button type="warning" icon="ChatDotRound" @click="goInterview">我的面试</el-button>
        <el-button type="danger" icon="SwitchButton" @click="logout">退出登录</el-button>
      </div>
      <el-divider>最近活动</el-divider>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in recentActivities"
          :key="idx"
          :timestamp="item.time"
          :type="item.type"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserProfile'
}
</script>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Calendar } from '@element-plus/icons-vue'

const router = useRouter()
const defaultAvatar = 'https://cdn.jsdelivr.net/gh/element-plus/element-plus@latest/docs/public/images/element-plus-logo.svg'

// 假数据，实际可从store或API获取
const user = ref({
  avatar: '',
  nickname: 'AI面试者',
  email: 'user@example.com',
  role: 'candidate',
  registerDate: '2025-07-25',
})
const roleMap = {
  candidate: '求职者',
  hr: '企业HR',
  admin: '管理员',
}
const recentActivities = ref([
  { time: '2025-07-25 10:00', content: '完成AI技术面试', type: 'success' },
  { time: '2025-07-24 15:30', content: '上传新简历', type: 'info' },
  { time: '2025-07-23 09:20', content: '注册账号', type: 'primary' },
])

function goEdit() {
  ElMessage.info('编辑资料功能开发中...')
}
function goResume() {
  router.push('/resume')
}
function goInterview() {
  router.push('/interview')
}
function logout() {
  // 清理token等，跳转到登录页
  ElMessage.success('已退出登录')
  router.push('/auth/login')
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background: #f5f7fa;
  padding: 40px 0;
}
.profile-card {
  width: 520px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 36px 24px 36px;
}
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.profile-info {
  margin-left: 24px;
}
.profile-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 600;
}
.profile-email, .profile-date {
  color: #888;
  font-size: 14px;
  margin: 4px 0;
  display: flex;
  align-items: center;
}
.profile-email el-icon, .profile-date el-icon {
  margin-right: 4px;
}
.profile-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
</style> 