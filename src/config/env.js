// 环境配置文件
export const ENV_CONFIG = {
  // 开发环境
  development: {
    API_BASE_URL: 'http://localhost:8081/api',
    ENV_NAME: '开发环境',
    DEBUG: true
  },
  // 生产环境
  production: {
    API_BASE_URL: '/api',
    ENV_NAME: '生产环境',
    DEBUG: false
  }
};

// 获取当前环境配置
export const getCurrentEnv = () => {
  const env = process.env.VUE_APP_ENV || 'development';
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// 获取API基础URL
export const getApiBaseUrl = () => {
  return process.env.VUE_APP_API_BASE_URL || getCurrentEnv().API_BASE_URL;
};

// 环境信息
export const ENV_INFO = {
  current: process.env.VUE_APP_ENV || 'development',
  nodeEnv: process.env.NODE_ENV,
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment: process.env.VUE_APP_ENV === 'development',
  isProduction: process.env.VUE_APP_ENV === 'production'
};

// 开发环境下在控制台显示环境信息
if (ENV_INFO.isDevelopment) {
  console.log('🌍 当前环境:', ENV_INFO);
} 