<template>
  <div class="resume-upload-container">
    <h2>简历上传</h2>
    <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        :http-request="customUpload"
        :on-remove="handleRemove"
        v-model:file-list="fileList"
        :limit="1"
        :before-upload="beforeUpload"
        :show-file-list="true"
        :auto-upload="false"
        accept=".pdf,.doc,.docx"
    >
      <el-icon>
        <i-ep-upload/>
      </el-icon>
      <div class="el-upload__text">将PDF/Word文件拖到此处，或<em>点击选择</em></div>
      <template #tip>
        <div class="el-upload__tip">仅支持PDF、Word文件，最大5MB</div>
      </template>
    </el-upload>
    <el-button
        type="primary"
        style="margin-top: 16px;"
        :disabled="fileList.length === 0"
        @click="submitUpload"
    >上传简历
    </el-button>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {uploadResume} from '@/api/resume'

const fileList = ref([])
const uploadRef = ref()

async function customUpload(option) {
  try {
    const response = await uploadResume(option.file)
    // 兼容axios返回格式
    const data = response?.data || response
    console.log(data)
    if (data.code === 200) {
      ElMessage.success('上传成功，简历正在解析...')
      option.onSuccess()
    } else {
      ElMessage.error(data.message || '上传失败')
      // 不再调用 option.onError，否则会触发 catch
    }
  } catch (e) {
    // 只对非全局登录拦截类错误弹窗
    if (!e.isAuth) {
      ElMessage.error('上传失败，请重试')
    }
    option.onError(e)
  }
}

function handleRemove() {
  // 可选：移除文件时的处理
}

function beforeUpload(file) {
  const isAllowed =
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isAllowed) {
    ElMessage.error('仅支持PDF或Word文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过5MB')
    return false
  }
  return true
}

function submitUpload() {
  uploadRef.value.submit()
}
</script>

<style scoped>
.resume-upload-container {
  max-width: 480px;
  margin: 48px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #e6e6e6;
  padding: 32px 32px 24px 32px;
}

.upload-demo {
  width: 100%;
}

.el-upload__text {
  font-size: 16px;
  color: #666;
}

.el-upload__tip {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}
</style> 