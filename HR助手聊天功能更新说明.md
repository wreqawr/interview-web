# HR助手聊天功能更新说明

## 更新概述

本次更新将HR助手聊天功能从原有的阻塞式JSON响应改为流式响应，以支持新的服务端接口。

## 主要修改内容

### 1. 接口地址更新 (`src/api/endpoints.js`)

- 将AI聊天接口地址从硬编码的 `http://localhost:8082/api/chat` 改为使用环境配置的 `${BASE_URL}/chat`
- 确保接口地址与后端服务保持一致

### 2. AI API重构 (`src/api/ai.js`)

#### 接口参数结构更新
- 新增 `taskType` 参数，默认值为 `GENERAL_CHAT`
- 新增 `params` 参数，用于传递额外参数（当前HR助手功能中设为空对象）
- 保持 `conversationId` 和 `userMessage` 参数不变

#### 流式响应支持
- 使用 `fetch` API 替代 `axios`，支持流式响应
- 实现 `onData`、`onComplete`、`onError` 回调机制
- 自动携带JWT认证头

#### 新的调用方式
```javascript
await aiApi.chat({
  conversationId: conversationId.value,
  userMessage: userMessageText,
  taskType: 'GENERAL_CHAT',
  params: {},
  onData: (data) => {
    // 实时处理流式数据
  },
  onComplete: () => {
    // 响应完成处理
  },
  onError: (error) => {
    // 错误处理
  }
})
```

### 3. 前端页面更新

#### HRDashboard.vue (`src/pages/dashboard/HRDashboard.vue`)
- 更新聊天消息发送逻辑，支持流式响应
- 实时显示AI回复内容，提供更好的用户体验
- 优化错误处理和状态管理

#### CandidateDashboard.vue (`src/pages/dashboard/CandidateDashboard.vue`)
- 同步更新聊天功能，保持与HR助手一致的用户体验
- 修复变量作用域问题

## 技术特点

### 流式响应优势
1. **实时性**：用户可以看到AI回复的实时生成过程
2. **用户体验**：无需等待完整响应，提供更流畅的交互
3. **性能优化**：减少用户等待时间

### 错误处理
- 网络错误处理
- 认证失败处理
- 服务端错误处理
- 优雅降级显示

### 认证机制
- 自动携带JWT token
- 支持401/403等认证相关错误处理

## 接口规范

### 请求格式
```json
{
  "conversationId": "8888",
  "userMessage": "你会什么",
  "taskType": "GENERAL_CHAT",
  "params": {
    "a": 1,
    "b": "xyz"
  }
}
```

### 响应类型
- 响应类型：`MediaType.TEXT_EVENT_STREAM_VALUE`
- 数据格式：纯文本流式数据
- 不再返回JSON格式的阻塞式响应

## 兼容性说明

- 保持现有的用户界面和交互逻辑
- 向后兼容现有的对话历史功能
- 支持现有的清空聊天功能

## 测试建议

1. **功能测试**：验证聊天消息发送和接收
2. **流式响应测试**：确认AI回复的实时显示
3. **错误处理测试**：测试网络异常、认证失败等场景
4. **性能测试**：验证流式响应的性能表现

## 注意事项

1. 确保后端服务支持新的接口格式
2. 验证JWT认证机制正常工作
3. 测试不同网络环境下的流式响应表现
4. 监控前端错误日志，及时发现问题

## 后续优化建议

1. 添加打字机效果，提升用户体验
2. 实现消息重试机制
3. 添加网络状态指示器
4. 优化移动端适配 