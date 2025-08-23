# 求职者仪表板访问指南

## 🚀 如何访问求职者仪表板

### 1. 直接访问
当您以求职者角色登录后，可以通过以下方式访问：

**URL访问：**
```
http://localhost:8080/candidate-dashboard
```

### 2. 自动跳转
系统已配置自动跳转逻辑：

- 当求职者用户访问 `/dashboard` 时，会自动跳转到 `/candidate-dashboard`
- 当HR用户访问 `/dashboard` 时，会自动跳转到 `/hr-dashboard`
- 管理员用户访问 `/dashboard` 时，继续使用通用dashboard

### 3. 权限验证
- 只有拥有 `ROLE_JOB_SEEKER` 角色的用户才能访问求职者仪表板
- 如果没有权限，系统会自动重定向到对应角色的首页

### 4. 测试步骤

#### 方法一：使用MainDashboard的角色切换
1. 启动项目：`npm run serve`
2. 访问：`http://localhost:8080/dashboard`
3. 在页面顶部的测试区域点击"切换为求职者"按钮
4. 页面会自动跳转到求职者仪表板

#### 方法二：直接访问
1. 确保您已登录系统
2. 直接访问：`http://localhost:8080/candidate-dashboard`

#### 方法三：通过登录系统
如果您的系统支持不同角色登录：
1. 使用求职者账号登录
2. 登录成功后会自动跳转到求职者仪表板

## 🔧 路由配置详情

已添加的路由配置：
```javascript
{
    path: '/candidate-dashboard',
    name: 'CandidateDashboard',
    component: () => import('@/pages/dashboard/CandidateDashboard.vue'),
    meta: {requiresAuth: true, role: 'ROLE_JOB_SEEKER'}
}
```

## 🎯 页面功能

访问成功后，您将看到：

1. **个人数据概览**
   - 简历版本、面试次数、综合评分、收到Offer

2. **技能评估雷达图**
   - 五维技能评估展示

3. **最近面试记录**
   - 面试历史和状态

4. **学习进度**
   - 技能学习进度追踪

5. **AI求职助手**
   - 右侧悬浮的智能助手

6. **左侧功能菜单**
   - 包含求职者所有可用功能

## 🐛 故障排除

### 如果无法访问：
1. 检查是否已登录
2. 确认用户角色是否为 `ROLE_JOB_SEEKER`
3. 检查浏览器控制台是否有错误信息
4. 确认项目是否正确启动

### 权限不足：
- 如果显示权限不足，请检查用户的角色配置
- 确保JWT token中包含正确的角色信息

## 📱 移动端支持

求职者仪表板已适配移动端：
- 响应式布局
- 触摸友好的交互
- 自适应屏幕尺寸 