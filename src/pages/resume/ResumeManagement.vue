<template>
  <div class="resume-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">简历管理</h1>
        <p class="page-subtitle">管理您的所有简历版本，提升求职竞争力</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleUpload">
          <el-icon><Upload /></el-icon>
          上传简历
        </el-button>
        <el-button type="success" size="large" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          创建简历
        </el-button>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="statistics-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon resume-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ resumes.length }}</div>
              <div class="stat-label">简历总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon version-icon">
              <el-icon><Files /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ resumes.length }}</div>
              <div class="stat-label">版本数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon view-icon">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalViews }}</div>
              <div class="stat-label">查看次数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon score-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ averageScore }}</div>
              <div class="stat-label">综合评分</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="24">
        <!-- 左侧：简历列表 -->
        <el-col :span="16">
          <div class="resume-list-section">
            <div class="section-header">
              <h2 class="section-title">我的简历</h2>
              <div class="section-actions">
                <el-select v-model="sortBy" placeholder="排序方式" size="small">
                  <el-option label="最新创建" value="createTime" />
                  <el-option label="最近修改" value="updateTime" />
                  <el-option label="使用频率" value="usage" />
                </el-select>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索简历"
                  size="small"
                  style="width: 200px; margin-left: 10px;"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>

            <!-- 简历卡片列表 -->
            <div v-if="loading" class="loading-container">
              <div class="loading-placeholder">
                <el-icon class="is-loading"><Loading /></el-icon>
                <p>正在加载简历数据...</p>
              </div>
            </div>
            <div v-else-if="resumes.length === 0" class="empty-container">
              <el-empty description="暂无简历数据" />
            </div>
            <div v-else class="resume-cards">
              <div 
                v-for="resume in filteredResumes" 
                :key="resume.id"
                class="resume-card"
                :class="{ active: selectedResume?.id === resume.id }"
                @click="selectResume(resume)"
              >
                <div class="resume-card-header">
                  <div class="resume-title">
                    <h3>{{ resume.title }}</h3>
                    <el-tag 
                      :type="resume.status === 'active' ? 'success' : 'info'" 
                      size="small"
                    >
                      {{ resume.status === 'active' ? '当前使用' : '历史版本' }}
                    </el-tag>
                  </div>
                  <div class="resume-actions">
                    <el-dropdown trigger="click" @command="handleResumeAction">
                      <el-button type="text" size="small">
                        <el-icon><MoreFilled /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{ action: 'preview', resume }">
                            <el-icon><View /></el-icon>预览
                          </el-dropdown-item>
                          <el-dropdown-item :command="{ action: 'edit', resume }">
                            <el-icon><Edit /></el-icon>编辑
                          </el-dropdown-item>
                          <el-dropdown-item :command="{ action: 'download', resume }">
                            <el-icon><Download /></el-icon>下载
                          </el-dropdown-item>
                          <el-dropdown-item :command="{ action: 'analyze', resume }">
                            <el-icon><DataAnalysis /></el-icon>分析
                          </el-dropdown-item>
                          <el-dropdown-item divided :command="{ action: 'delete', resume }">
                            <el-icon><Delete /></el-icon>删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>

                <div class="resume-card-content">
                  <div class="resume-info">
                    <div class="info-item">
                      <span class="label">格式：</span>
                      <span class="value">{{ resume.format }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">大小：</span>
                      <span class="value">{{ resume.size }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">创建时间：</span>
                      <span class="value">{{ resume.createTime }}</span>
                    </div>
                  </div>
                  
                  <div class="resume-preview">
                    <div class="preview-placeholder">
                      <el-icon><Document /></el-icon>
                      <span>点击预览</span>
                    </div>
                  </div>
                </div>

                <div class="resume-card-footer">
                  <div class="resume-stats">
                    <span class="stat">
                      <el-icon><View /></el-icon>
                      {{ resume.viewCount }} 次查看
                    </span>
                    <span class="stat">
                      <el-icon><Download /></el-icon>
                      {{ resume.downloadCount }} 次下载
                    </span>
                  </div>
                  <div class="resume-score">
                    <el-rate 
                      v-model="resume.score" 
                      disabled 
                      show-score 
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：详情面板 -->
        <el-col :span="8">
          <div class="detail-panel">
            <div class="panel-header">
              <h3>简历详情</h3>
            </div>
            
            <div v-if="selectedResume" class="panel-content">
              <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-item">
                  <span class="label">标题：</span>
                  <span class="value">{{ selectedResume.title }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">状态：</span>
                  <el-tag :type="selectedResume.status === 'active' ? 'success' : 'info'">
                    {{ selectedResume.status === 'active' ? '当前使用' : '历史版本' }}
                  </el-tag>
                </div>
              </div>

              <div class="detail-section">
                <h4>文件信息</h4>
                <div class="detail-item">
                  <span class="label">格式：</span>
                  <span class="value">{{ selectedResume.format }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">大小：</span>
                  <span class="value">{{ selectedResume.size }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ selectedResume.createTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">最后修改：</span>
                  <span class="value">{{ selectedResume.updateTime }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4>使用统计</h4>
                <div class="detail-item">
                  <span class="label">查看次数：</span>
                  <span class="value">{{ selectedResume.viewCount }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">下载次数：</span>
                  <span class="value">{{ selectedResume.downloadCount }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">综合评分：</span>
                  <el-rate 
                    v-model="selectedResume.score" 
                    disabled 
                    show-score 
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>

              <div class="detail-section">
                <h4>快速操作</h4>
                <div class="action-buttons">
                  <el-button type="primary" @click="handlePreview">
                    <el-icon><View /></el-icon>预览
                  </el-button>
                  <el-button type="success" @click="handleEdit">
                    <el-icon><Edit /></el-icon>编辑
                  </el-button>
                  <el-button type="warning" @click="handleDownload">
                    <el-icon><Download /></el-icon>下载
                  </el-button>
                  <el-button type="info" @click="handleAnalyze">
                    <el-icon><DataAnalysis /></el-icon>分析
                  </el-button>
                </div>
              </div>
            </div>

            <div v-else class="panel-empty">
              <el-empty description="请选择一个简历查看详情" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传简历" width="500px">
      <el-upload
        ref="uploadRef"
        class="upload-area"
        drag
        :http-request="customUpload"
        :on-remove="handleRemove"
        v-model:file-list="uploadFiles"
        :limit="1"
        :before-upload="beforeUpload"
        :show-file-list="true"
        :auto-upload="false"
        accept=".pdf,.doc,.docx"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将PDF/Word文件拖到此处，或<em>点击选择</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持PDF、Word文件，最大5MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :disabled="uploadFiles.length === 0"
            @click="submitUpload"
          >
            上传简历
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadResume, getResumeList, queryResumeAsyncResult } from '@/api/resume'
import {
  Upload,
  Plus,
  Document,
  Files,
  View,
  Star,
  Search,
  MoreFilled,
  Edit,
  Download,
  DataAnalysis,
  Delete,
  UploadFilled,
  Loading
} from '@element-plus/icons-vue'

// 响应式数据
const sortBy = ref('createTime')
const searchKeyword = ref('')
const selectedResume = ref(null)
const uploadDialogVisible = ref(false)
const uploadFiles = ref([])
const uploadRef = ref()
const loading = ref(false)
const pollingInterval = ref(null) // 轮询定时器

// 简历数据
const resumes = ref([])

// 数据转换函数：将后端数据转换为前端需要的格式
const transformResumeData = (backendData) => {
  return backendData.map((resume, index) => {
    // 格式化文件大小：将字节转换为MB
    const formatFileSize = (bytes) => {
      const mb = bytes / (1024 * 1024)
      return `${mb.toFixed(1)}MB`
    }
    
    // 格式化文件类型
    const formatMimeType = (mimeType) => {
      const typeMap = {
        'application/pdf': 'PDF',
        'application/msword': 'DOC',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
      }
      return typeMap[mimeType] || mimeType
    }
    
    // 格式化时间：YYYY-MM-DD hh:mm:ss
    const formatDateTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    
    return {
      id: resume.resumeId,
      title: resume.resumeTitle || '未命名简历',
      status: index === 0 ? 'active' : 'history', // 第一个为当前使用
      format: formatMimeType(resume.mimeType),
      size: formatFileSize(resume.fileSize),
      createTime: formatDateTime(resume.createdAt),
      updateTime: formatDateTime(resume.updatedAt),
      viewCount: resume.viewCount || 0,
      downloadCount: resume.downloadCount || 0,
      score: resume.rate || 0,
      // 保存原始数据用于详情展示
      originalData: resume
    }
  })
}

// 获取简历列表
const fetchResumeList = async () => {
  try {
    loading.value = true
    const response = await getResumeList()
    const data = response?.data || response
    
    if (data.code === 200 && data.data) {
      resumes.value = transformResumeData(data.data)
      // 默认选择第一个简历
      if (resumes.value.length > 0) {
        selectedResume.value = resumes.value[0]
      }
      ElMessage.success('简历列表加载成功')
    } else {
      ElMessage.error(data.message || '获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取简历列表失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchResumeList()
})

// 组件卸载时清理轮询定时器
onUnmounted(() => {
  stopPolling()
})

// 计算属性
const filteredResumes = computed(() => {
  let result = resumes.value

  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(resume => 
      resume.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 排序
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'createTime':
        return new Date(b.createTime) - new Date(a.createTime)
      case 'updateTime':
        return new Date(b.updateTime) - new Date(a.updateTime)
      case 'usage':
        return b.viewCount - a.viewCount
      default:
        return 0
    }
  })

  return result
})

// 计算总查看次数
const totalViews = computed(() => {
  return resumes.value.reduce((total, resume) => total + resume.viewCount, 0)
})

// 计算平均评分
const averageScore = computed(() => {
  if (resumes.value.length === 0) return '0.0'
  const totalScore = resumes.value.reduce((total, resume) => total + resume.score, 0)
  return (totalScore / resumes.value.length).toFixed(1)
})

// 方法
const selectResume = (resume) => {
  selectedResume.value = resume
}

const handleUpload = () => {
  uploadDialogVisible.value = true
  // 清空之前的文件列表
  uploadFiles.value = []
}

const handleCreate = () => {
  ElMessage.info('创建简历功能开发中...')
}

const handleResumeAction = (command) => {
  const { action, resume } = command
  switch (action) {
    case 'preview':
      handlePreview(resume)
      break
    case 'edit':
      handleEdit(resume)
      break
    case 'download':
      handleDownload(resume)
      break
    case 'analyze':
      handleAnalyze(resume)
      break
    case 'delete':
      handleDelete(resume)
      break
  }
}

const handlePreview = (resume = selectedResume.value) => {
  if (!resume) return
  ElMessage.info(`预览简历：${resume.title}`)
}

const handleEdit = (resume = selectedResume.value) => {
  if (!resume) return
  ElMessage.info(`编辑简历：${resume.title}`)
}

const handleDownload = (resume = selectedResume.value) => {
  if (!resume) return
  ElMessage.success(`下载简历：${resume.title}`)
}

const handleAnalyze = (resume = selectedResume.value) => {
  if (!resume) return
  ElMessage.info(`分析简历：${resume.title}`)
}

const handleDelete = async (resume) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除简历"${resume.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 轮询查询简历异步上传结果
const startPolling = async (taskId, resumeId) => {
  // 清除之前的轮询
  stopPolling()
  
  let pollCount = 0 // 轮询次数计数器
  
  const poll = async () => {
    try {
      const response = await queryResumeAsyncResult(taskId, resumeId)
      const data = response?.data || response
      
      if (data.code === 200) {
        // 异步任务成功结束
        stopPolling()
        ElMessage.success('简历已解析完毕')
        
        // 将新解析的简历添加到列表开头
        const newResume = transformResumeData([data.data])[0]
        resumes.value.unshift(newResume)
        
        // 选择新上传的简历
        selectedResume.value = newResume
        
      } else if (data.code === 900) {
        // 异步任务还在执行中，继续轮询
        pollCount++
        console.log(`简历解析中，第${pollCount}次轮询，继续等待...`)
        
        // 根据轮询次数设置不同的间隔
        if (pollCount === 1) {
          // 第一次轮询后，等待10秒进行第二次轮询
          stopPolling()
          pollingInterval.value = setTimeout(() => {
            poll()
          }, 10000)
        } else {
          // 第二次轮询后，每5秒轮询一次
          stopPolling()
          pollingInterval.value = setInterval(poll, 5000)
        }
        
      } else if (data.code === 901) {
        // 异步任务结束但有错误
        stopPolling()
        ElMessage.error(data.message || '简历解析失败')
        
      } else {
        // 其他错误情况
        stopPolling()
        ElMessage.error(data.message || '查询解析状态失败')
      }
    } catch (error) {
      console.error('轮询查询失败:', error)
      if (!error.isAuth) {
        ElMessage.error('查询解析状态失败，请重试')
      }
      stopPolling()
    }
  }
  
  // 等待2秒后开始第一次轮询
  setTimeout(async () => {
    await poll()
  }, 2000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// 上传相关方法
async function customUpload(option) {
  try {
    const response = await uploadResume(option.file)
    // 兼容axios返回格式
    const data = response?.data || response
    console.log(data)
    if (data.code === 200) {
      ElMessage.success(data.message || '上传成功')
      option.onSuccess()
      // 上传成功后关闭对话框并清空文件列表
      uploadDialogVisible.value = false
      uploadFiles.value = []
      
      // 开始轮询查询解析结果
      if (data.data?.taskId && data.data?.resumeId) {
        await startPolling(data.data.taskId, data.data.resumeId)
      }
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
.resume-management {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.header-content .page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.header-content .page-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.statistics-section {
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.resume-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.version-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.view-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.score-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info .stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-info .stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

/* 主要内容区域 */
.main-content {
  margin-bottom: 32px;
}

/* 简历列表区域 */
.resume-list-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
}

/* 加载和空状态 */
.loading-container {
  padding: 40px 0;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
}

.loading-placeholder p {
  margin: 0;
  font-size: 16px;
}

.empty-container {
  padding: 60px 0;
  text-align: center;
}

/* 简历卡片 */
.resume-cards {
  display: grid;
  gap: 16px;
}

.resume-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.resume-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.resume-card.active {
  border-color: #409eff;
  background: rgba(255, 255, 255, 0.95);
}

.resume-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.resume-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.resume-card-content {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.resume-info {
  flex: 1;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  color: #7f8c8d;
  width: 80px;
  flex-shrink: 0;
}

.info-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.resume-preview {
  width: 120px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #7f8c8d;
  font-size: 12px;
}

.resume-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.resume-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #7f8c8d;
}

/* 详情面板 */
.detail-panel {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  height: fit-content;
  position: sticky;
  top: 24px;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item .label {
  color: #7f8c8d;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.panel-empty {
  text-align: center;
  padding: 40px 0;
}

/* 上传对话框 */
.upload-area {
  width: 100%;
}

.el-upload__tip {
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .resume-card-content {
    flex-direction: column;
  }
  
  .resume-preview {
    width: 100%;
    height: 60px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: space-between;
  }
}
</style> 