# AI智能面试平台 (Interview Web)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.10.4-409EFF?style=flat-square)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.3-yellow?style=flat-square)](https://pinia.vuejs.org/)
[![ECharts](https://img.shields.io/badge/ECharts-5.6.0-AA344D?style=flat-square)](https://echarts.apache.org/)

> 基于 Vue 3 + Element Plus 的现代化 AI 智能面试平台，为 HR 和求职者提供全方位的面试解决方案

## 🌟 项目特色

- **🎯 多角色支持**: HR、求职者、管理员三种角色，权限精细控制
- **🤖 AI 智能助手**: 集成 AI 聊天助手，提供专业 HR 咨询服务
- **📊 数据可视化**: 丰富的图表展示，直观了解招聘数据
- **📱 响应式设计**: 支持多端访问，用户体验优秀
- **🔐 安全认证**: JWT 认证，角色权限管理
- **🚀 现代化架构**: Vue 3 Composition API + Pinia 状态管理

## 📋 目录结构

```
interview-web/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── auth.js        # 认证相关接口
│   │   ├── resume.js      # 简历管理接口
│   │   ├── ai.js          # AI 聊天接口
│   │   ├── endpoints.js   # 接口地址配置
│   │   └── http.js        # HTTP 请求封装
│   ├── assets/            # 静态资源
│   │   ├── function/      # 功能图标
│   │   ├── interview/     # 面试相关图标
│   │   ├── resume/        # 简历相关图标
│   │   └── other/         # 其他图标
│   ├── components/        # 公共组件
│   ├── constants/         # 常量配置
│   │   └── permissions.js # 权限配置 (188个权限点)
│   ├── hooks/             # 组合式函数
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── auth/          # 认证页面
│   │   ├── dashboard/     # 仪表盘页面
│   │   ├── interview/     # 面试相关页面
│   │   ├── resume/        # 简历管理页面
│   │   └── report/        # 报告页面
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式文件
│   └── utils/             # 工具函数
├── nginx.conf             # Nginx 配置
├── docker-compose.yml     # Docker 编排
└── DEPLOYMENT.md          # 部署说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run serve
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 🏗️ 技术架构

### 前端技术栈

- **框架**: Vue 3.2.13 (Composition API)
- **UI 组件库**: Element Plus 2.10.4
- **状态管理**: Pinia 3.0.3
- **路由**: Vue Router 4.5.1
- **图表**: ECharts 5.6.0
- **HTTP 客户端**: Axios 1.10.0
- **构建工具**: Vue CLI 5.0.0

### 核心特性

- **响应式设计**: 支持桌面端和移动端
- **组件化开发**: 高度可复用的组件设计
- **权限控制**: 基于角色的细粒度权限管理
- **国际化支持**: 多语言界面支持
- **主题定制**: 可自定义的主题系统

## 👥 用户角色

### 🔐 管理员 (ROLE_ADMIN)
- **用户管理**: 用户注册审核、角色分配、权限配置
- **企业管理**: 企业认证审核、套餐管理、服务配置
- **系统配置**: 系统参数、AI 模型、功能开关
- **数据管理**: 数据备份、统计分析、监控日志
- **系统监控**: 服务器状态、性能指标、安全事件

### 👔 HR (ROLE_HR)
- **候选人管理**: 候选人信息、标签管理、状态跟踪
- **简历筛选**: AI 智能筛选、关键词过滤、技能匹配
- **面试管理**: 面试安排、面试官分配、流程管理
- **岗位管理**: 招聘岗位、需求管理、流程设计
- **沟通管理**: 候选人沟通、消息通知、模板管理
- **面试评估**: 评分管理、维度设置、结果汇总
- **数据分析**: 漏斗分析、来源统计、通过率分析
- **企业信息**: 企业设置、部门管理、面试官管理

### 👤 求职者 (ROLE_JOB_SEEKER)
- **简历管理**: 简历上传、编辑、版本管理、AI 解析
- **面试预约**: 时间预约、岗位选择、提醒设置
- **AI 模拟面试**: 技术面试、行为面试、压力面试
- **实时面试**: 视频面试、屏幕共享、代码编辑
- **面试记录**: 历史记录、视频回放、笔记管理
- **面试报告**: 表现分析、技能评估、改进建议
- **学习中心**: 面试技巧、学习资源、进度跟踪
- **个人中心**: 信息管理、头像上传、隐私设置

## 🎯 核心功能

### 🤖 AI 智能助手
- **智能对话**: 基于 AI 的 HR 咨询服务
- **实时响应**: 快速准确的问答服务
- **专业建议**: 招聘流程、面试技巧等专业指导
- **多轮对话**: 支持上下文理解和连续对话

### 📊 数据仪表盘
- **招聘效能矩阵**: 5项核心指标雷达图
- **实时数据卡片**: 今日新增简历、待处理数量等
- **动态任务流水线**: 看板式任务管理
- **趋势分析**: 招聘数据趋势图表

### 📝 简历管理
- **智能解析**: AI 驱动的简历内容解析
- **版本控制**: 简历版本管理和对比
- **技能提取**: 自动识别和提取技能点
- **模板选择**: 多种简历模板可选

### 🎥 面试系统
- **AI 模拟面试**: 多种面试场景模拟
- **实时面试**: 在线视频面试支持
- **面试评估**: 多维度评分体系
- **结果分析**: 详细的面试表现分析

## 🔐 权限系统

### 权限架构
- **188个权限点**: 覆盖所有功能模块
- **角色权限映射**: 基于角色的权限分配
- **功能权限控制**: 细粒度的功能访问控制
- **数据权限管理**: 基于角色的数据访问控制

### 权限代码示例
```javascript
// 简历上传权限
RESUME_UPLOAD: 'ai-interview:resume:upload'

// 候选人查看权限
CANDIDATE_VIEW: 'ai-interview:candidate:view'

// 系统配置权限
ADMIN_SYSTEM_PARAMETER_CONFIGURE: 'ai-interview:admin:system:parameter:configure'
```

## 🚀 部署说明

### Docker 部署

```bash
# 构建前端
npm run build

# 启动服务
docker-compose up -d
```

### Nginx 反向代理

- **前端访问**: http://localhost
- **API 代理**: `/api/*` → 后端服务
- **静态资源**: 自动缓存和压缩

### 环境配置

```javascript
// 开发环境
export const BASE_URL = "http://localhost:8081/api";

// 生产环境
export const BASE_URL = "/api";
```

## 📱 页面路由

### 认证页面
- `/login` - 用户登录
- `/register` - 用户注册

### 仪表盘页面
- `/dashboard` - 通用仪表盘
- `/hr-dashboard` - HR 专用仪表盘

### 功能页面
- `/resume/management` - 简历管理
- `/interview` - 面试列表
- `/jobseeker/mock-interview` - AI 模拟面试
- `/report` - 报告列表

## 🎨 设计特色

### 视觉设计
- **现代化界面**: 简洁美观的用户界面
- **渐变色彩**: 丰富的渐变色彩搭配
- **图标系统**: 统一的功能图标设计
- **响应式布局**: 适配不同屏幕尺寸

### 交互体验
- **流畅动画**: 丰富的交互动画效果
- **即时反馈**: 快速响应用户操作
- **智能提示**: 智能化的操作提示
- **无障碍设计**: 支持键盘导航和屏幕阅读器

## 🔧 开发指南

### 代码规范
- **ESLint**: 代码质量检查
- **Vue 3 最佳实践**: 使用 Composition API
- **组件设计**: 高内聚、低耦合的组件设计
- **类型安全**: 完善的类型定义和检查

### 状态管理
```javascript
// 使用 Pinia 进行状态管理
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.setToken(token)
```

### 权限检查
```javascript
// 检查用户角色
if (userStore.hasUserRole('ROLE_HR')) {
  // HR 角色相关逻辑
}

// 检查功能权限
if (userStore.hasFeature('candidate_management')) {
  // 候选人管理功能
}
```

## 📈 性能优化

### 前端优化
- **代码分割**: 路由级别的代码分割
- **懒加载**: 组件和图片的懒加载
- **缓存策略**: 静态资源的缓存优化
- **压缩优化**: CSS 和 JavaScript 压缩

### 用户体验
- **加载状态**: 完善的加载状态提示
- **错误处理**: 友好的错误提示和处理
- **离线支持**: 支持离线模式访问
- **性能监控**: 页面性能指标监控

## 🛡️ 安全特性

### 认证安全
- **JWT 认证**: 基于 Token 的身份验证
- **密码加密**: 安全的密码存储和传输
- **会话管理**: 安全的会话管理机制
- **权限验证**: 严格的权限验证机制

### 数据安全
- **输入验证**: 严格的前端输入验证
- **XSS 防护**: 防止跨站脚本攻击
- **CSRF 防护**: 防止跨站请求伪造
- **数据加密**: 敏感数据的加密传输

## 🤝 贡献指南

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 创建 Pull Request

### 代码规范
- 遵循 Vue 3 最佳实践
- 使用 ESLint 进行代码检查
- 编写完善的注释和文档
- 保持代码的可读性和可维护性

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 📞 联系我们

- **项目维护者**: minglg
- **项目地址**: [GitHub Repository]
- **问题反馈**: [Issues]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**AI智能面试平台** - 让每一次面试都成为提升的机会 🚀
