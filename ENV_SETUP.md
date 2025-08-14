# 环境配置说明

## 概述
本项目支持开发环境和生产环境的自动切换，无需手动修改代码。

## 环境文件

### .env.development (开发环境)
```
NODE_ENV=development
VUE_APP_API_BASE_URL=http://localhost:8081/api
VUE_APP_ENV=development
```

### .env.production (生产环境)
```
NODE_ENV=production
VUE_APP_API_BASE_URL=/api
VUE_APP_ENV=production
```

## 使用方法

### 开发环境
```bash
# 启动开发服务器
npm run serve

# 构建开发版本
npm run build:dev
```

### 生产环境
```bash
# 构建生产版本
npm run build:prod

# 或者直接构建（默认生产环境）
npm run build
```

## 环境变量说明

- `VUE_APP_ENV`: 环境标识 (development/production)
- `VUE_APP_API_BASE_URL`: API基础URL
  - 开发环境: `http://localhost:8081/api`
  - 生产环境: `/api` (通过nginx反向代理)

## 自动切换原理

1. **开发环境**: 使用完整的服务器地址
2. **生产环境**: 使用相对路径，通过nginx反向代理到后端服务

## 注意事项

- 环境文件以 `.env.` 开头，Vue CLI 会自动加载
- 只有以 `VUE_APP_` 开头的环境变量才会被前端代码访问
- 修改环境文件后需要重启开发服务器

## 调试信息

在开发环境下，控制台会显示当前环境信息：
```javascript
🌍 当前环境: {
  current: "development",
  nodeEnv: "development", 
  apiBaseUrl: "http://localhost:8081/api",
  isDevelopment: true,
  isProduction: false
}
``` 