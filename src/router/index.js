import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  
  // 管理员路由
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_ADMIN' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/dashboard/AdminDashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/pages/admin/UserManagement.vue')
      },
      {
        path: 'companies',
        name: 'CompanyManagement',
        component: () => import('@/pages/admin/CompanyManagement.vue')
      },
      {
        path: 'system',
        name: 'SystemConfig',
        component: () => import('@/pages/admin/SystemConfig.vue')
      },
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: () => import('@/pages/admin/SystemMonitor.vue')
      }
    ]
  },
  
  // HR路由
  {
    path: '/hr',
    name: 'HRLayout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_HR' },
    children: [
      {
        path: 'dashboard',
        name: 'HRDashboard',
        component: () => import('@/pages/dashboard/HRDashboard.vue')
      },
      {
        path: 'candidates',
        name: 'CandidateManagement',
        component: () => import('@/pages/hr/CandidateManagement.vue')
      },
      {
        path: 'interviews',
        name: 'InterviewManagement',
        component: () => import('@/pages/hr/InterviewManagement.vue')
      },
      {
        path: 'positions',
        name: 'PositionManagement',
        component: () => import('@/pages/hr/PositionManagement.vue')
      },
      {
        path: 'analytics',
        name: 'HRAnalytics',
        component: () => import('@/pages/hr/HRAnalytics.vue')
      }
    ]
  },
  
  // 求职者路由
  {
    path: '/jobseeker',
    name: 'JobSeekerLayout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_JOB_SEEKER' },
    children: [
      {
        path: 'dashboard',
        name: 'JobSeekerDashboard',
        component: () => import('@/pages/dashboard/JobSeekerDashboard.vue')
      },
      {
        path: 'resume',
        name: 'ResumeManagement',
        component: () => import('@/pages/jobseeker/ResumeManagement.vue')
      },
      {
        path: 'mock-interview',
        name: 'MockInterview',
        component: () => import('@/pages/jobseeker/MockInterview.vue')
      },
      {
        path: 'interview-history',
        name: 'InterviewHistory',
        component: () => import('@/pages/jobseeker/InterviewHistory.vue')
      },
      {
        path: 'learning',
        name: 'LearningCenter',
        component: () => import('@/pages/jobseeker/LearningCenter.vue')
      }
    ]
  },
  
  // 通用路由（兼容旧版本）
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/profile/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resume',
    name: 'ResumeUpload',
    component: () => import('@/pages/resume/ResumeUpload.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查token是否存在且未过期
    if (!userStore.token || userStore.isUserTokenExpired) {
      // 尝试从localStorage恢复token
      if (!userStore.restoreToken()) {
        next('/login')
        return
      }
    }
    
    // 检查角色权限
    if (to.meta.role) {
      if (!userStore.hasUserRole(to.meta.role)) {
        // 没有对应角色权限，重定向到对应角色的首页
        const homePage = userStore.getHomePage()
        next(homePage)
        return
      }
    }
  }
  
  next()
})

export default router 