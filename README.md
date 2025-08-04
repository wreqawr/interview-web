# AI模拟面试系统 - 前端

## 项目简介

AI模拟面试系统是一个基于Vue 3 + Spring Boot的智能面试平台，旨在为求职者提供AI驱动的模拟面试体验，为企业HR提供智能化的候选人评估工具。

### 核心功能

- 🤖 **AI模拟面试**：支持技术面试、行为面试、压力测试等多种面试场景
- 📄 **智能简历解析**：自动解析PDF/Word简历，提取关键信息并生成评分
- 📊 **综合评估报告**：多维度能力雷达图、岗位匹配度分析、改进建议
- 👥 **多角色管理**：求职者、企业HR、系统管理员三种角色
- 🔐 **安全认证**：JWT + Spring Security，支持RBAC权限控制
- 📱 **响应式设计**：适配PC端和移动端
- ⚡ **异步处理**：支持简历上传后的异步解析和轮询查询

## 技术栈

### 前端技术
- **Vue 3** - 渐进式JavaScript框架
- **Element Plus** - Vue 3 UI组件库
- **Pinia** - Vue 3状态管理
- **Vue Router** - 官方路由管理器
- **Axios** - HTTP客户端
- **ECharts** - 数据可视化图表库

### 后端技术
- **Spring Boot 3.4.6** - 企业级Java框架
- **Spring Security 6** - 安全框架
- **Spring AI 1.2** - AI集成框架
- **MyBatis** - ORM框架
- **Redis** - 缓存数据库
- **MySQL 8** - 关系型数据库
- **MinIO** - 对象存储

### 部署技术
- **Docker** - 容器化部署
- **Nginx** - Web服务器
- **Docker Compose** - 容器编排

## 项目结构

```
interview-web/
├── src/
│   ├── api/                 # API接口封装
│   │   ├── auth.js         # 认证相关接口
│   │   ├── resume.js       # 简历管理接口
│   │   ├── endpoints.js    # 接口地址配置
│   │   └── http.js         # HTTP请求封装
│   ├── assets/              # 静态资源
│   │   ├── function/       # 功能图标
│   │   ├── interview/      # 面试相关图标
│   │   ├── resume/         # 简历相关图标
│   │   └── other/          # 其他图标
│   ├── components/          # 公共组件
│   ├── constants/           # 常量定义
│   │   └── permissions.js  # 权限配置
│   ├── hooks/              # 组合式函数
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面组件
│   │   ├── auth/           # 认证相关页面
│   │   ├── dashboard/      # 数据驾驶舱
│   │   ├── resume/         # 简历管理
│   │   ├── interview/      # 面试相关
│   │   └── report/         # 报告分析
│   ├── router/             # 路由配置
│   ├── stores/             # 状态管理
│   ├── styles/             # 样式文件
│   ├── utils/              # 工具函数
│   └── main.js             # 应用入口
├── public/                 # 公共文件
├── Dockerfile              # Docker构建文件
├── nginx.conf              # Nginx配置
├── docker-compose.yml      # Docker编排文件
└── package.json            # 项目依赖
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Docker >= 20.0.0 (可选)

### 本地开发

1. **克隆项目**
```bash
git clone git@github.com:wreqawr/interview-web.git
cd interview-web
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run serve
```

4. **访问应用**
打开浏览器访问 http://localhost:8080

### 生产部署

#### 方式一：Docker部署（推荐）

1. **构建镜像**
```bash
# 给构建脚本执行权限
chmod +x build.sh

# 执行构建
./build.sh
```

2. **运行容器**
```bash
# 使用docker run
docker run -d -p 8080:8080 --name interview-web interview-web:latest

# 或使用docker-compose
docker-compose up -d
```

3. **访问应用**
http://localhost:8080

#### 方式二：传统部署

1. **构建生产版本**
```bash
npm run build
```

2. **部署到Web服务器**
将 `dist` 目录下的文件部署到Nginx、Apache等Web服务器

## 功能模块

### 1. 认证中心
- 用户注册/登录
- JWT令牌管理
- 验证码校验
- 权限控制

### 2. 数据驾驶舱
- 核心数据总览
- 能力雷达图
- 功能入口导航
- 实时数据展示
- 角色切换测试

### 3. 简历智能解析
- 支持PDF/Word格式上传
- 自动信息提取和解析
- 简历评分系统
- 异步处理支持
- 智能轮询查询（2秒→10秒→5秒策略）
- 实时状态监控

### 4. AI模拟面试
- 多场景面试模式
- 实时音视频交互
- AI面试官问答
- 表情情绪分析

### 5. 评估报告系统
- 多维度能力分析
- 岗位匹配度评分
- 改进建议生成
- 历史记录查看

## 核心特性

### 🔐 权限管理系统
- **RBAC模型**：基于角色的访问控制
- **188个权限点**：细粒度的功能权限控制
- **动态权限**：根据用户角色动态显示功能
- **权限验证**：前后端双重权限验证

### 📄 简历管理功能
- **多格式支持**：PDF、DOC、DOCX格式
- **异步解析**：后端异步处理，前端智能轮询
- **版本管理**：简历版本控制和历史记录
- **智能评分**：基于AI的简历质量评估

### ⚡ 异步处理机制
- **智能轮询**：渐进式轮询策略（2秒→10秒→5秒）
- **状态监控**：实时监控任务执行状态
- **错误处理**：完善的错误处理和用户提示
- **资源清理**：自动清理轮询定时器

### 🎨 用户体验优化
- **响应式设计**：适配各种屏幕尺寸
- **加载状态**：友好的加载和错误提示
- **交互优化**：流畅的页面切换和操作反馈
- **性能优化**：代码分割和懒加载

## 配置说明

### 环境变量

创建 `.env` 文件配置环境变量：

```env
# API基础地址
VUE_APP_BASE_API=http://localhost:8081/api

# 应用标题
VUE_APP_TITLE=AI模拟面试系统

# 是否开启调试模式
VUE_APP_DEBUG=true
```

### 后端接口配置

在 `src/api/endpoints.js` 中配置后端接口地址：

```javascript
export const BASE_URL = "http://localhost:8081/api";

// 简历相关接口
export const RESUME_API = `${BASE_URL}/resume`;
export const RESUME_UPLOAD_URL = `${RESUME_API}/upload`;
export const RESUME_METADATA_URL = `${RESUME_API}/getMyResume`;
export const RESUME_METADATA_ASYNC_URL = `${RESUME_API}/queryResumeAsyncUploadResult`;
```

## 开发指南

### 代码规范

- 使用ESLint进行代码检查
- 遵循Vue 3 Composition API最佳实践
- 组件命名采用PascalCase
- 文件命名采用kebab-case

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 分支管理

- `main`: 主分支，用于生产环境
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

## 部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用      │    │   Nginx代理     │    │   后端服务      │
│  (Vue 3)       │◄──►│   (负载均衡)    │◄──►│  (Spring Boot)  │
│   Port: 8080   │    │   Port: 80      │    │   Port: 8081    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 性能优化

- **代码分割**：路由懒加载
- **资源压缩**：Gzip压缩
- **缓存策略**：静态资源长期缓存
- **CDN加速**：静态资源CDN分发
- **图片优化**：WebP格式支持
- **异步处理**：智能轮询和状态管理

## 安全特性

- **XSS防护**：输入输出过滤
- **CSRF防护**：Token验证
- **安全头**：CSP、HSTS等
- **权限控制**：RBAC模型
- **数据加密**：敏感数据加密存储
- **接口安全**：白名单机制和权限验证

## 监控告警

- **健康检查**：Docker健康检查
- **日志监控**：Nginx访问日志
- **错误追踪**：前端错误监控
- **性能监控**：页面加载性能
- **异步任务监控**：轮询状态和错误处理

## 常见问题

### Q: 如何修改后端API地址？
A: 修改 `src/api/endpoints.js` 中的 `BASE_URL` 配置。

### Q: 如何添加新的页面路由？
A: 在 `src/router/index.js` 中添加路由配置，并在 `src/pages` 下创建对应页面组件。

### Q: 如何自定义主题？
A: 修改 `src/assets/styles/variables.scss` 中的CSS变量。

### Q: 如何配置HTTPS？
A: 在 `nginx.conf` 中添加SSL证书配置。

### Q: 简历上传后为什么没有立即显示？
A: 简历解析是异步处理的，系统会自动轮询查询解析状态，解析完成后会自动显示。

### Q: 如何修改轮询间隔时间？
A: 在 `src/pages/resume/ResumeManagement.vue` 中的 `startPolling` 函数中修改轮询策略。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 GNU GPL v3.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者：minglg
- 邮箱：2820996063@qq.com
- 项目地址：[GitHub Repository](https://github.com/wreqawr/interview-web.git)

## 更新日志

### v1.1.0 (2025-08-04)
- ✨ 实现简历管理页面API集成
- ✨ 添加异步轮询功能（2秒→10秒→5秒策略）
- ✨ 优化Dashboard用户体验
- ✨ 完善权限管理系统
- 🐛 修复API常量引用问题
- 📚 更新项目文档

### v1.0.0 (2025-07-25)
- 🎉 初始版本发布
- ✨ 实现基础认证功能
- ✨ 实现简历上传和解析
- ✨ 实现AI模拟面试核心功能
- ✨ 实现评估报告系统
- 🐛 修复多个已知问题
- 📚 完善项目文档

---

**感谢使用AI模拟面试系统！** 🚀
