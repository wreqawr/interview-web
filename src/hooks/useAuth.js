import { ref } from 'vue';

export function useAuth() {
  const isAuthenticated = ref(false);
  // 可扩展登录、登出、权限等逻辑
  return { isAuthenticated };
} 