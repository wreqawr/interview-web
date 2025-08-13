import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from '@/stores/user'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: {requiresAuth: false}
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: {requiresAuth: false}
    },

    // 统一Dashboard页面
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/MainDashboard.vue'),
        meta: {requiresAuth: true}
    },

    // HR专用Dashboard页面
    {
        path: '/hr-dashboard',
        name: 'HRDashboard',
        component: () => import('@/pages/dashboard/HRDashboard.vue'),
        meta: {requiresAuth: true, role: 'ROLE_HR'}
    },


    // 简历管理页面（包含上传功能）
    {
        path: '/resume',
        redirect: '/resume/management'
    },

    // 简历管理页面
    {
        path: '/resume/management',
        name: 'ResumeManagement',
        component: () => import('@/pages/resume/ResumeManagement.vue'),
        meta: {requiresAuth: true}
    },

    // 面试列表页面
    {
        path: '/interview',
        name: 'InterviewList',
        component: () => import('@/pages/interview/InterviewList.vue'),
        meta: {requiresAuth: true}
    },

    // AI模拟面试页面
    {
        path: '/jobseeker/mock-interview',
        name: 'MockInterview',
        component: () => import('@/pages/interview/MockInterview.vue'),
        meta: {requiresAuth: true}
    },

    // 报告列表页面
    {
        path: '/report',
        name: 'ReportList',
        component: () => import('@/pages/report/ReportList.vue'),
        meta: {requiresAuth: true}
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

        // 如果访问的是通用dashboard且用户是HR角色，重定向到HR专用dashboard
        if (to.path === '/dashboard' && userStore.hasUserRole('ROLE_HR')) {
            next('/hr-dashboard')
            return
        }
    }

    next()
})

export default router 