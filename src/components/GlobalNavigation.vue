<template>
  <nav class="global-navigation">
    <div class="nav-container">
      <!-- 左侧Logo和系统名称 -->
      <div class="nav-left">
        <el-button class="back-btn" text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>

      <!-- 中间功能菜单 -->
      <div class="nav-center">
        <div class="nav-menu">
          <div 
            v-for="feature in userFeatures" 
            :key="feature.key"
            :class="['nav-menu-item', { 'active': isCurrentPage(feature.path) }]"
            @click="handleMenuSelect(feature.key)"
          >
            <span>{{ feature.name }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧用户信息和操作 -->
      <div class="nav-right">
        <div class="user-info">
          <el-dropdown @command="handleUserCommand">
            <div class="user-avatar">
              <el-avatar :size="32" :src="userAvatar">
                {{ userInitials }}
              </el-avatar>
              <span class="username">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Setting, SwitchButton, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 移除activeMenu，因为我们现在使用自定义div布局

// 用户功能列表
const userFeatures = computed(() => userStore.userFeatures)

// 用户信息
const userName = computed(() => {
  const user = userStore.getUserInfo
  return user?.username || user?.name || '用户'
})

const userAvatar = computed(() => {
  const user = userStore.getUserInfo
  return user?.avatar || ''
})

const userInitials = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

// Dashboard主页现在通过用户功能列表处理，无需特殊处理函数

// 处理菜单选择
const handleMenuSelect = (key) => {
  const feature = userFeatures.value.find(f => f.key === key)
  if (feature && feature.path) {
    // 未实现功能提示
    const devKeys = ['appointment', 'real_interview', 'interview_history', 'interview_reports']
    if (devKeys.includes(key)) {
      ElMessage({ message: '功能正在开发中', type: 'info', duration: 500 })
      return
    }
    router.push(feature.path)
  }
}

// 判断是否为当前页面
const isCurrentPage = (path) => {
  return route.path.startsWith(path) || route.path === path
}

// 全局返回：优先 history 返回；若无历史，则返回到上一层级或首页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    // 简单兜底：若当前路径包含多级，则回到上级，否则回到首页
    const segments = route.path.split('/').filter(Boolean)
    if (segments.length > 1) {
      const parent = '/' + segments.slice(0, -1).join('/')
      router.push(parent || '/')
    } else {
      router.push('/')
    }
  }
}

// 处理用户操作
const handleUserCommand = async (command) => {
  switch (command) {
    case 'settings':
      ElMessage.info('设置功能暂未开放')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 执行退出登录
        userStore.clearUserInfo()
        router.push('/login')
        ElMessage.success('已退出登录')
      } catch {
        // 用户取消退出
      }
      break
  }
}
</script>

<style scoped>
.global-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
}

.nav-left {
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
}

.back-btn:hover {
  color: #409eff;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0; /* 允许flex项目收缩 */
}

.nav-menu {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0;
}

.nav-menu-item {
  height: 64px;
  line-height: 64px;
  padding: 0 16px; /* 减少padding，让更多菜单项能够显示 */
  font-size: 14px;
  color: #606266;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap; /* 防止文字换行 */
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
}

.nav-menu-item:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

/* Dashboard主页样式已移除，现在使用标准导航菜单样式 */

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  background: rgba(64, 158, 255, 0.1);
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-menu-item {
    padding: 0 14px; /* 进一步减少padding */
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 12px;
  }

  .nav-menu-item {
    padding: 0 12px;
    font-size: 12px;
  }
  
  .username {
    display: none;
  }
}
</style> 