import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 示例路由，后续可扩展
  {
    path: '/login',
    component: () => import('../pages/auth/Login.vue')
  },
  {
    path: '/register',
    component: () => import('../pages/auth/Register.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('../pages/dashboard/Dashboard.vue') },
      { path: 'resume', component: () => import('../pages/resume/ResumeUpload.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 