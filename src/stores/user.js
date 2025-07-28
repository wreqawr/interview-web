import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getUserInfoFromToken,
  getRolesFromToken,
  getPrimaryRole,
  hasRole,
  isTokenExpired,
  getRoleHomePage
} from '@/utils/jwt';
import { getRoleFeatures, getRoleStatistics } from '@/constants/permissions';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref(null);
  const userRoles = ref([]);

  // 计算属性
  const getUserInfo = computed(() => {
    if (token.value) {
      return getUserInfoFromToken(token.value) || userInfo.value;
    }
    return userInfo.value;
  });

  const getUserRoles = computed(() => {
    if (token.value) {
      return getRolesFromToken(token.value) || userRoles.value;
    }
    return userRoles.value;
  });

  const userRole = computed(() => {
    return getPrimaryRole(token.value) || userRoles.value[0] || null;
  });

  const isUserTokenExpired = computed(() => {
    return isTokenExpired(token.value);
  });

  // 根据角色获取用户功能列表
  const userFeatures = computed(() => {
    const role = userRole.value;
    if (role) {
      return getRoleFeatures(role);
    }
    return [];
  });

  // 根据角色获取用户统计配置
  const userStatistics = computed(() => {
    const role = userRole.value;
    if (role) {
      return getRoleStatistics(role);
    }
    return [];
  });

  // 角色检查方法
  const hasUserRole = (role) => {
    if (token.value) {
      return hasRole(token.value, role);
    }
    return userRoles.value.includes(role);
  };

  // 功能检查方法
  const hasFeature = (featureKey) => {
    return userFeatures.value.some(feature => feature.key === featureKey);
  };

  // 获取功能信息
  const getFeature = (featureKey) => {
    return userFeatures.value.find(feature => feature.key === featureKey);
  };

  // 获取角色对应的首页路径
  const getHomePage = () => {
    return getRoleHomePage(token.value);
  };

  // 设置token
  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    
    // 解析并设置用户信息
    const user = getUserInfoFromToken(newToken);
    if (user) {
      userInfo.value = user;
    }
    
    // 解析并设置角色信息
    const roles = getRolesFromToken(newToken);
    if (roles) {
      userRoles.value = roles;
    }
  };

  // 从localStorage恢复token
  const restoreToken = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      return true;
    }
    return false;
  };

  // 清除用户信息
  const clearUserInfo = () => {
    token.value = '';
    userInfo.value = null;
    userRoles.value = [];
    localStorage.removeItem('token');
  };

  // 刷新用户信息
  const refreshUserInfo = () => {
    if (token.value) {
      const user = getUserInfoFromToken(token.value);
      const roles = getRolesFromToken(token.value);
      
      if (user) {
        userInfo.value = user;
      }
      if (roles) {
        userRoles.value = roles;
      }
    }
  };

  return {
    // 状态
    token, userInfo, userRoles,
    
    // 计算属性
    getUserInfo, getUserRoles, userRole, isUserTokenExpired,
    userFeatures, userStatistics,
    
    // 方法
    setToken, restoreToken, clearUserInfo, refreshUserInfo,
    hasUserRole, hasFeature, getFeature, getHomePage
  };
}); 