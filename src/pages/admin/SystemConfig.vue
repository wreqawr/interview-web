<template>
  <div class="system-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
        </div>
      </template>
      
      <el-form :model="configForm" label-width="120px">
        <el-form-item label="系统名称">
          <el-input v-model="configForm.systemName" />
        </el-form-item>
        
        <el-form-item label="系统版本">
          <el-input v-model="configForm.version" disabled />
        </el-form-item>
        
        <el-form-item label="最大文件大小">
          <el-input-number v-model="configForm.maxFileSize" :min="1" :max="100" />
          <span style="margin-left: 10px;">MB</span>
        </el-form-item>
        
        <el-form-item label="会话超时时间">
          <el-input-number v-model="configForm.sessionTimeout" :min="10" :max="1440" />
          <span style="margin-left: 10px;">分钟</span>
        </el-form-item>
        
        <el-form-item label="邮件服务">
          <el-switch v-model="configForm.emailEnabled" />
        </el-form-item>
        
        <el-form-item label="短信服务">
          <el-switch v-model="configForm.smsEnabled" />
        </el-form-item>
        
        <el-form-item label="AI服务">
          <el-switch v-model="configForm.aiEnabled" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const configForm = ref({
  systemName: 'AI面试系统',
  version: '1.0.0',
  maxFileSize: 10,
  sessionTimeout: 30,
  emailEnabled: true,
  smsEnabled: false,
  aiEnabled: true
})

const handleSave = () => {
  ElMessage.success('配置保存成功')
}

const handleReset = () => {
  configForm.value = {
    systemName: 'AI面试系统',
    version: '1.0.0',
    maxFileSize: 10,
    sessionTimeout: 30,
    emailEnabled: true,
    smsEnabled: false,
    aiEnabled: true
  }
  ElMessage.info('配置已重置')
}
</script>

<style scoped>
.system-config {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  color: #303133;
}
</style> 