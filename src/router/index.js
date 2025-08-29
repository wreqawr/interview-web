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

    // 求职者专用Dashboard页面
    {
        path: '/candidate-dashboard',
        name: 'CandidateDashboard',
        component: () => import('@/pages/dashboard/CandidateDashboard.vue'),
        meta: {requiresAuth: true, role: 'ROLE_JOB_SEEKER'}
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
        redirect: '/interview/preparation'
    },

    // 面试准备页面
    {
        path: '/interview/preparation',
        name: 'InterviewPreparation',
        component: () => import('@/pages/interview/InterviewPreparation.vue'),
        meta: {requiresAuth: true}
    },

    // 面试进行页面
    {
        path: '/interview/live',
        name: 'LiveInterview',
        component: () => import('@/pages/interview/LiveInterview.vue'),
        meta: {requiresAuth: true}
    },

    // 文字聊天面试页面
    {
        path: '/interview/chat',
        name: 'InterviewChat',
        component: () => import('@/pages/interview/InterviewChat.vue'),
        meta: {requiresAuth: true}
    },

    // 面试结果页面
    {
        path: '/interview/results',
        name: 'InterviewResults',
        component: () => import('@/pages/interview/InterviewResults.vue'),
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

        // 如果访问的是通用dashboard且用户是求职者角色，重定向到求职者专用dashboard
        if (to.path === '/dashboard' && userStore.hasUserRole('ROLE_JOB_SEEKER')) {
            next('/candidate-dashboard')
            return
        }
    }

    next()
})

// 全局后置钩子 - 解决页面滚动锁定问题
router.afterEach(() => {
    // 延迟执行，确保DOM完全渲染
    setTimeout(() => {
        try {
            const body = document.body
            const html = document.documentElement
            
            // 移除 Element Plus 弹层可能添加的类名
            body.classList.remove('el-popup-parent--hidden')
            body.classList.remove('el-overflow-hidden')
            
            // 清理可能残留的内联样式导致无法滚动
            if (body.style.overflow) body.style.overflow = ''
            if (body.style.position) body.style.position = ''
            if (html.style.overflow) html.style.overflow = ''
            if (html.style.position) html.style.position = ''
            
            // 强制设置可滚动
            body.style.overflow = 'auto'
            html.style.overflow = 'auto'
            
            // 移除可能影响滚动的其他类
            const elements = document.querySelectorAll('*')
            elements.forEach(el => {
                if (el.style && el.style.overflow === 'hidden') {
                    el.style.overflow = ''
                }
            })
        } catch (e) {
            // 忽略SSR或极端环境下的document不可用
        }
    }, 100)
})

export default router 