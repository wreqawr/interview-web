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
              <div class="stat-value">5</div>
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
              <div class="stat-value">12</div>
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
              <div class="stat-value">89</div>
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
              <div class="stat-value">4.8</div>
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
            <div class="resume-cards">
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
                      <span class="label">版本：</span>
                      <span class="value">{{ resume.version }}</span>
                    </div>
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
                  <span class="label">版本：</span>
                  <span class="value">{{ selectedResume.version }}</span>
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadResume } from '@/api/resume'
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
  UploadFilled
} from '@element-plus/icons-vue'

// 响应式数据
const sortBy = ref('createTime')
const searchKeyword = ref('')
const selectedResume = ref(null)
const uploadDialogVisible = ref(false)
const uploadFiles = ref([])
const uploadRef = ref()

// 模拟简历数据
const resumes = ref([
  {
    id: 1,
    title: '前端开发工程师简历',
    version: 'v2.1',
    status: 'active',
    format: 'PDF',
    size: '2.3MB',
    createTime: '2024-01-15',
    updateTime: '2024-01-20',
    viewCount: 25,
    downloadCount: 8,
    score: 4.8
  },
  {
    id: 2,
    title: '前端开发工程师简历',
    version: 'v2.0',
    status: 'history',
    format: 'PDF',
    size: '2.1MB',
    createTime: '2024-01-10',
    updateTime: '2024-01-15',
    viewCount: 18,
    downloadCount: 5,
    score: 4.5
  },
  {
    id: 3,
    title: '前端开发工程师简历',
    version: 'v1.5',
    status: 'history',
    format: 'DOCX',
    size: '1.8MB',
    createTime: '2024-01-05',
    updateTime: '2024-01-10',
    viewCount: 12,
    downloadCount: 3,
    score: 4.2
  },
  {
    id: 4,
    title: '产品经理简历',
    version: 'v1.0',
    status: 'history',
    format: 'PDF',
    size: '3.2MB',
    createTime: '2023-12-20',
    updateTime: '2023-12-25',
    viewCount: 15,
    downloadCount: 4,
    score: 4.6
  },
  {
    id: 5,
    title: 'UI设计师简历',
    version: 'v1.2',
    status: 'history',
    format: 'PDF',
    size: '4.1MB',
    createTime: '2023-12-15',
    updateTime: '2023-12-20',
    viewCount: 19,
    downloadCount: 6,
    score: 4.7
  }
])

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

// 上传相关方法
async function customUpload(option) {
  try {
    const response = await uploadResume(option.file)
    // 兼容axios返回格式
    const data = response?.data || response
    console.log(data)
    if (data.code === 200) {
      ElMessage.success('上传成功，简历正在解析...')
      option.onSuccess()
      // 上传成功后关闭对话框并清空文件列表
      uploadDialogVisible.value = false
      uploadFiles.value = []
      // 这里可以添加刷新简历列表的逻辑
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