# AI模拟面试系统 - 前端

## 项目简介

AI模拟面试系统是一个基于Vue 3 + Spring
Boot的智能面试平台，旨在为求职者提供AI驱动的模拟面试体验，为企业HR提供智能化的候选人评估工具。系统采用现代化的前端架构，支持多角色权限管理，提供完整的简历管理、面试预约、AI模拟面试等功能。

### 核心功能

- 🤖 **AI模拟面试**：支持技术面试、行为面试、压力测试等多种面试场景
- 📄 **智能简历解析**：自动解析PDF/Word简历，提取关键信息并生成评分
- 📊 **综合评估报告**：多维度能力雷达图、岗位匹配度分析、改进建议
- 👥 **多角色管理**：求职者、企业HR、系统管理员三种角色
- 🔐 **安全认证**：JWT + Spring Security，支持RBAC权限控制
- 📱 **响应式设计**：适配PC端和移动端
- ⚡ **异步处理**：支持简历上传后的异步解析和轮询查询
- 🎯 **防抖机制**：完善的用户操作防抖和加载状态管理
- 🔄 **智能轮询**：渐进式轮询策略，优化用户体验

## 技术栈

### 前端技术

- **Vue 3** - 渐进式JavaScript框架，使用Composition API
- **Element Plus** - Vue 3 UI组件库，提供丰富的组件
- **Pinia** - Vue 3状态管理，替代Vuex
- **Vue Router** - 官方路由管理器，支持懒加载
- **Axios** - HTTP客户端，支持请求/响应拦截
- **ECharts** - 数据可视化图表库
- **Node Forge** - 密码学库，用于RSA加密

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
│   │   ├── captcha.js      # 验证码接口
│   │   ├── endpoints.js    # 接口地址配置
│   │   └── http.js         # HTTP请求封装
│   ├── assets/              # 静态资源
│   │   ├── function/       # 功能图标
│   │   │   ├── admin/      # 管理员功能图标
│   │   │   ├── hr/         # HR功能图标
│   │   │   └── jobseeker/  # 求职者功能图标
│   │   ├── interview/      # 面试相关图标
│   │   ├── resume/         # 简历相关图标
│   │   └── other/          # 其他图标
│   ├── components/          # 公共组件
│   ├── constants/           # 常量定义
│   │   └── permissions.js  # 权限配置（188个权限点）
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
│   │   ├── jwt.js         # JWT解析工具
│   │   └── tools.js       # 通用工具函数
│   └── main.js             # 应用入口
├── public/                 # 公共文件
├── Dockerfile              # Docker构建文件
├── nginx.conf              # Nginx配置
├── docker-compose.yml      # Docker编排文件
├── build.sh               # 构建脚本
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

- **用户注册/登录**：支持用户名密码登录，RSA加密传输
- **JWT令牌管理**：自动解析JWT中的用户信息和角色
- **验证码校验**：数学计算验证码，防止机器人攻击
- **权限控制**：基于角色的访问控制（RBAC）
- **防抖机制**：登录注册按钮防抖，防止重复提交

### 2. 数据驾驶舱

- **核心数据总览**：根据用户角色显示不同的统计信息
- **能力雷达图**：可视化展示用户能力分布
- **功能入口导航**：2D轮播图展示功能模块
- **实时数据展示**：动态更新统计数据
- **角色切换测试**：开发环境下的角色测试功能

### 3. 简历智能解析

- **多格式支持**：PDF、DOC、DOCX格式上传
- **自动信息提取**：解析简历中的关键信息
- **简历评分系统**：基于AI的简历质量评估
- **异步处理支持**：后端异步解析，前端智能轮询
- **智能轮询查询**：渐进式轮询策略（2秒→10秒→5秒）
- **实时状态监控**：显示解析进度和状态
- **预览功能**：支持简历预览，基于previewEnabled字段
- **版本管理**：简历版本控制和历史记录
- **防抖机制**：上传、删除、预览等操作防抖

### 4. 简历分析功能

- **AI深度分析**：整体评分、核心优势、主要短板分析
- **优化建议**：按优先级排序的改进建议
- **提升潜力评估**：分析简历的提升空间和发展方向
- **HTML报告展示**：在iframe中渲染分析结果
- **新窗口查看**：支持在新窗口中打开完整报告

### 5. AI模拟面试

- **多场景面试模式**：技术面试、行为面试、压力测试
- **实时音视频交互**：支持视频通话功能
- **AI面试官问答**：智能问答系统
- **表情情绪分析**：实时情绪识别

### 6. 评估报告系统

- **多维度能力分析**：技能、经验、教育背景分析
- **岗位匹配度评分**：智能匹配算法
- **改进建议生成**：个性化改进建议
- **历史记录查看**：面试历史记录

## 核心特性

### 🔐 权限管理系统

- **RBAC模型**：基于角色的访问控制
- **188个权限点**：细粒度的功能权限控制
- **动态权限**：根据用户角色动态显示功能
- **权限验证**：前后端双重权限验证
- **JWT解析**：自动解析JWT中的用户信息和角色

### 📄 简历管理功能

- **多格式支持**：PDF、DOC、DOCX格式
- **异步解析**：后端异步处理，前端智能轮询
- **版本管理**：简历版本控制和历史记录
- **智能评分**：基于AI的简历质量评估
- **预览支持**：根据previewEnabled字段控制预览功能
- **文件哈希**：SHA256文件完整性校验
- **分页显示**：支持分页浏览简历列表

### ⚡ 异步处理机制

- **智能轮询**：渐进式轮询策略（2秒→10秒→5秒）
- **状态监控**：实时监控任务执行状态
- **错误处理**：完善的错误处理和用户提示
- **资源清理**：自动清理轮询定时器
- **防抖控制**：防止重复操作

### 🎨 用户体验优化

- **响应式设计**：适配各种屏幕尺寸
- **加载状态**：友好的加载和错误提示
- **交互优化**：流畅的页面切换和操作反馈
- **性能优化**：代码分割和懒加载
- **防抖机制**：所有后端交互操作都有防抖保护
- **视觉反馈**：按钮状态变化和加载动画

### 🔒 安全机制

- **RSA加密**：密码传输使用RSA加密
- **JWT认证**：基于JWT的无状态认证
- **验证码校验**：防止机器人攻击
- **权限控制**：细粒度的权限管理
- **XSS防护**：输入输出过滤
- **CSRF防护**：Token验证

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

// 认证相关接口
export const AUTH_API = `${BASE_URL}/auth`;
export const LOGIN_URL = `${AUTH_API}/login`;
export const REGISTER_URL = `${AUTH_API}/register`;
export const PUB_KEY_URL = `${AUTH_API}/publicKey`;

// 验证码接口
export const CAPTCHA_URL = `${AUTH_API}/captcha?t=${Date.now()}`;

// 简历相关接口
export const RESUME_API = `${BASE_URL}/resume`;
export const RESUME_UPLOAD_URL = `${RESUME_API}/upload`;
export const RESUME_METADATA_URL = `${RESUME_API}/getMyResume`;
export const RESUME_METADATA_ASYNC_URL = `${RESUME_API}/queryResumeAsyncUploadResult`;
export const RESUME_DELETE_URL = `${RESUME_API}/delete`;
export const RESUME_PREVIEW_URL = `${RESUME_API}/preview`;
export const RESUME_DOWNLOAD_URL = `${RESUME_API}/download`;
export const RESUME_ANALYZE_URL = `${RESUME_API}/analyze`;
```

## 开发指南

### 代码规范

- 使用ESLint进行代码检查
- 遵循Vue 3 Composition API最佳实践
- 组件命名采用PascalCase
- 文件命名采用kebab-case
- 使用TypeScript类型注解（可选）

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

### Docker部署特性

- **多阶段构建**：优化镜像大小
- **非root用户**：提高安全性
- **健康检查**：自动健康监控
- **镜像优化**：使用Alpine基础镜像
- **缓存优化**：npm缓存和构建缓存

## 性能优化

- **代码分割**：路由懒加载
- **资源压缩**：Gzip压缩
- **缓存策略**：静态资源长期缓存
- **CDN加速**：静态资源CDN分发
- **图片优化**：WebP格式支持
- **异步处理**：智能轮询和状态管理
- **防抖机制**：减少不必要的请求

## 安全特性

- **XSS防护**：输入输出过滤
- **CSRF防护**：Token验证
- **安全头**：CSP、HSTS等
- **权限控制**：RBAC模型
- **数据加密**：敏感数据加密存储
- **接口安全**：白名单机制和权限验证
- **RSA加密**：密码传输加密

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

### Q: 如何添加新的权限点？

A: 在 `src/constants/permissions.js` 中的 `PERMISSION_CODES` 对象中添加新的权限代码。

### Q: 如何实现防抖功能？

A: 使用 `operationLoading` 状态对象管理各个操作的加载状态，在操作函数中添加防抖检查。

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

### v1.2.0 (2025-08-06)

- ✨ 完善系统防抖机制，为登录注册页面添加防抖功能
- ✨ 实现简历预览功能，支持iframe嵌入预览
- ✨ 添加previewEnabled字段支持，控制简历预览权限
- ✨ 优化简历管理界面，添加预览支持状态显示
- 🛡️ 增强用户体验，防止重复操作和误点击
- 🔧 完善错误处理和状态管理

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
