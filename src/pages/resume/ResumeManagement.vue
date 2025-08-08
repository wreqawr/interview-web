<template>
  <div class="resume-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">简历管理</h1>
        <p class="page-subtitle">管理您的所有简历版本，提升求职竞争力</p>
      </div>
      <div class="header-stats">
        <div class="stat-cards-row">
          <div class="stat-card">
            <div class="stat-icon resume-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ resumes.length }}</div>
              <div class="stat-label">简历总数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon version-icon">
              <el-icon><Files /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ resumes.length }}</div>
              <div class="stat-label">版本数量</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon view-icon">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalViews }}</div>
              <div class="stat-label">查看次数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon score-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ averageScore }}</div>
              <div class="stat-label">综合评分</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="24">
        <!-- 简历列表 -->
        <el-col :span="24">
          <div class="resume-list-section">
            <div class="section-header">
              <div class="section-title-area">
                <h2 class="section-title">我的简历</h2>
              </div>
              <div class="section-center">
                <div class="select-all-area">
                  <el-checkbox 
                    v-model="selectAll"
                    :indeterminate="isIndeterminate"
                    @change="handleSelectAll"
                  >
                    全选
                  </el-checkbox>
                </div>
                <el-select v-model="sortBy" placeholder="排序方式" size="small">
                  <el-option label="最新创建" value="createTime" />
                  <el-option label="最近修改" value="updateTime" />
                  <el-option label="使用频率" value="usage" />
                </el-select>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索简历"
                  size="small"
                  style="width: 200px;"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
              <div class="action-buttons-section">
                <el-button type="primary" size="small" @click="handleUpload">
                  <el-icon><Upload /></el-icon>
                  上传简历
                </el-button>
                <el-button type="success" size="small" @click="handleCreate">
                  <el-icon><Plus /></el-icon>
                  创建简历
                </el-button>
                <el-button 
                  type="warning" 
                  size="small" 
                  @click="handleBatchDownload"
                  :disabled="selectedResumes.length === 0 || operationLoading.download"
                  :loading="operationLoading.download"
                >
                  <el-icon><Download /></el-icon>
                  {{ operationLoading.download ? '下载中...' : `批量下载 (${selectedResumes.length})` }}
                </el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="handleBatchDelete"
                  :disabled="selectedResumes.length === 0 || operationLoading.delete"
                  :loading="operationLoading.delete"
                >
                  <el-icon><Delete /></el-icon>
                  {{ operationLoading.delete ? '删除中...' : `批量删除 (${selectedResumes.length})` }}
                </el-button>
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
                v-for="resume in paginatedResumes" 
                :key="resume.id"
                class="resume-card"
                :class="{ active: selectedResume?.id === resume.id }"
              >
                <div class="resume-card-header">
                  <div class="resume-selection">
                    <el-checkbox 
                      v-model="resume.selected" 
                      @change="updateSelectedResumes"
                      @click.stop
                    />
                  </div>
                  <div class="resume-title" @click="selectResume(resume)">
                    <h3>{{ resume.title }}</h3>
                    <el-tag 
                      :type="resume.status === 'active' ? 'success' : 'info'" 
                      size="small"
                    >
                      {{ resume.status === 'active' ? '当前使用' : '历史版本' }}
                    </el-tag>
                  </div>
                </div>

                <div class="resume-card-body">
                  <div class="resume-content">
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
                      <div class="info-item">
                        <span class="label">最后修改：</span>
                        <span class="value">{{ resume.updateTime }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">文件哈希：</span>
                        <span class="value sha256-value">{{ resume.sha256 }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">预览支持：</span>
                        <span class="value">
                          <el-tag 
                            :type="resume.previewEnabled ? 'success' : 'info'" 
                            size="small"
                          >
                            {{ resume.previewEnabled ? '支持预览' : '不支持预览' }}
                          </el-tag>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="resume-actions">
                    <div class="action-items">
                      <div 
                        class="action-item preview"
                        @click="handlePreview(resume)"
                        :class="{ disabled: !resume.previewEnabled || operationLoading.preview, 'no-preview': !resume.previewEnabled }"
                      >
                        <el-icon>
                          <View v-if="resume.previewEnabled && !operationLoading.preview" />
                          <Lock v-else-if="!resume.previewEnabled" />
                          <Loading v-else class="is-loading" />
                        </el-icon>
                        <span>{{ 
                          operationLoading.preview ? '预览中...' : '预览' 
                        }}</span>
                      </div>
                      <div 
                        class="action-item edit"
                        @click="handleEdit(resume)"
                        :class="{ disabled: true, 'dev-in-progress': true }"
                      >
                        <el-icon><Edit /></el-icon>
                        <span>编辑</span>
                      </div>
                      <div 
                        class="action-item download"
                        @click="handleDownload(resume)"
                        :class="{ disabled: operationLoading.download }"
                      >
                        <el-icon>
                          <Download v-if="!operationLoading.download" />
                          <Loading v-else class="is-loading" />
                        </el-icon>
                        <span>{{ operationLoading.download ? '下载中...' : '下载' }}</span>
                      </div>
                      <div 
                        class="action-item analyze"
                        @click="handleAnalyze(resume)"
                        :class="{ disabled: operationLoading.analyze && analyzingResumeId === resume.id }"
                      >
                        <el-icon>
                          <DataAnalysis v-if="!(operationLoading.analyze && analyzingResumeId === resume.id)" />
                          <Loading v-else class="is-loading" />
                        </el-icon>
                        <span>{{ 
                          operationLoading.analyze && analyzingResumeId === resume.id ? '分析中' : '分析' 
                        }}</span>
                      </div>
                      <div 
                        class="action-item delete"
                        @click="handleDelete(resume)"
                        :class="{ disabled: operationLoading.delete }"
                      >
                        <el-icon>
                          <Delete v-if="!operationLoading.delete" />
                          <Loading v-else class="is-loading" />
                        </el-icon>
                        <span>{{ operationLoading.delete ? '删除中...' : '删除' }}</span>
                      </div>
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
              
              <!-- 分页组件 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[2, 4, 6]"
                  :total="filteredResumes.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
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
            :disabled="uploadFiles.length === 0 || operationLoading.upload"
            :loading="operationLoading.upload"
            @click="submitUpload"
          >
            {{ operationLoading.upload ? '上传中...' : '上传简历' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog 
      v-model="previewDialogVisible" 
      title="简历预览" 
      width="80%" 
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="preview-dialog"
    >
      <div v-if="previewLoading" class="preview-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在加载预览...</p>
      </div>
      <div v-else-if="previewUrl" class="preview-container">
        <iframe 
          :src="previewUrl" 
          class="preview-iframe"
          allowfullscreen
        ></iframe>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="openInNewTab"
          >
            在新窗口打开
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分析对话框 -->
    <el-dialog 
      v-model="analyzeDialogVisible" 
      title="简历分析" 
      width="90%" 
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="analyze-dialog"
    >
      <div v-if="analyzeLoading" class="analyze-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在分析简历...</p>
      </div>
      <div v-else-if="analyzeHtml" class="analyze-container">
        <iframe 
          :srcdoc="analyzeHtml" 
          class="analyze-iframe"
          allowfullscreen
        ></iframe>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="analyzeDialogVisible = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="openAnalyzeInNewTab"
          >
            在新窗口打开
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 全局加载遮罩 -->
    <div 
      v-if="isAnyOperationLoading" 
      class="global-loading-overlay"
    >
      <div class="loading-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>操作进行中，请稍候...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadResume, getResumeList, queryResumeAsyncResult, deleteResumes, getResumePreviewUrl, getResumeDownloadUrls, analyzeResume } from '@/api/resume'
import {
  Upload,
  Plus,
  Document,
  Files,
  View,
  Star,
  Search,

  Edit,
  Download,
  DataAnalysis,
  Delete,
  UploadFilled,
  Loading,
  Lock
} from '@element-plus/icons-vue'

// 响应式数据
const sortBy = ref('createTime')
const searchKeyword = ref('')
const selectedResume = ref(null)
const uploadDialogVisible = ref(false)
const uploadFiles = ref([])
const uploadRef = ref()
const loading = ref(false)
// 轮询任务管理：使用Map存储每个任务的轮询定时器
const pollingTasks = ref(new Map()) // 存储 {taskId: {interval, pollCount, resumeId}}


// 预览相关
const previewDialogVisible = ref(false)
const previewUrl = ref('')
const previewLoading = ref(false)

// 分析相关
const analyzeDialogVisible = ref(false)
const analyzeHtml = ref('')
const analyzeLoading = ref(false)
const analyzingResumeId = ref(null) // 当前正在分析的简历ID

// 操作状态控制
const operationLoading = ref({
  preview: false,
  delete: false,
  upload: false,
  refresh: false,
  download: false,
  analyze: false
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(2)

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
      sha256: resume.sha256 || '',
      viewCount: resume.viewCount || 0,
      downloadCount: resume.downloadCount || 0,
      score: resume.rate || 0,
      previewEnabled: resume.previewEnabled || false,
      selected: false, // 添加选择状态
      // 保存原始数据用于详情展示
      originalData: resume
    }
  })
}

// 获取简历列表
const fetchResumeList = async () => {
  try {
    loading.value = true
    operationLoading.value.refresh = true
    const response = await getResumeList()
    const data = response?.data || response
    
    if (data.code === 200 && data.data) {
      resumes.value = transformResumeData(data.data)
      // 默认选择第一个简历
      if (resumes.value.length > 0) {
        selectedResume.value = resumes.value[0]
      }
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
    operationLoading.value.refresh = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchResumeList()
})

// 组件卸载时清理所有轮询定时器
onUnmounted(() => {
  stopAllPolling()
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

// 分页后的简历列表
const paginatedResumes = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredResumes.value.slice(startIndex, endIndex)
})

// 检查是否有任何操作正在进行
const isAnyOperationLoading = computed(() => {
  return Object.values(operationLoading.value).some(loading => loading)
})

// 选中的简历列表
const selectedResumes = computed(() => {
  return resumes.value.filter(resume => resume.selected)
})

// 全选状态
const selectAll = computed({
  get() {
    return paginatedResumes.value.length > 0 && paginatedResumes.value.every(resume => resume.selected)
  },
  set(value) {
    paginatedResumes.value.forEach(resume => {
      resume.selected = value
    })
  }
})

// 半选状态（部分选中）
const isIndeterminate = computed(() => {
  const selectedCount = paginatedResumes.value.filter(resume => resume.selected).length
  return selectedCount > 0 && selectedCount < paginatedResumes.value.length
})

// 方法
const selectResume = (resume) => {
  selectedResume.value = resume
}

const updateSelectedResumes = () => {
  // 这个方法会在复选框状态改变时被调用
  // 主要用于触发响应式更新
}

const handleSelectAll = (value) => {
  // 全选/取消全选当前页面的简历
  paginatedResumes.value.forEach(resume => {
    resume.selected = value
  })
}

const handleBatchDownload = async () => {
  if (selectedResumes.value.length === 0) {
    ElMessage.warning('请先选择要下载的简历')
    return
  }
  
  // 防抖：如果正在下载，直接返回
  if (operationLoading.value.download) return
  
  try {
    operationLoading.value.download = true
    
    // 获取选中的简历ID列表
    const resumeIds = selectedResumes.value.map(resume => resume.id)
    
    // 获取下载链接
    const response = await getResumeDownloadUrls(resumeIds)
    const data = response?.data || response
    
    if (data.code === 200 && data.data && data.data.length > 0) {
      // 限制同时下载的文件数量为3个
      const maxConcurrentDownloads = 3
      const downloadInfos = data.data
      
      // 分批下载，每批最多3个文件
      for (let i = 0; i < downloadInfos.length; i += maxConcurrentDownloads) {
        const batch = downloadInfos.slice(i, i + maxConcurrentDownloads)
        
        // 并发下载当前批次
        const downloadPromises = batch.map(downloadInfo => {
          return new Promise((resolve) => {
            const { downloadUrl, downloadFileName } = downloadInfo
            
            // 使用fetch下载文件并设置正确的文件名
            fetch(downloadUrl)
              .then(fileResponse => {
                if (fileResponse.ok) {
                  return fileResponse.blob()
                } else {
                  throw new Error('文件下载失败')
                }
              })
              .then(blob => {
                // 创建下载链接
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = downloadFileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                
                // 清理URL对象
                window.URL.revokeObjectURL(url)
                
                // 显示下载成功消息
                ElMessage.success(`${downloadFileName}下载成功！`)
                resolve()
              })
              .catch(error => {
                console.error(`下载文件失败: ${downloadFileName}`, error)
                ElMessage.error(`${downloadFileName}下载失败`)
                resolve()
              })
          })
        })
        
        // 等待当前批次完成
        await Promise.all(downloadPromises)
        
        // 如果不是最后一批，等待一小段时间再下载下一批
        if (i + maxConcurrentDownloads < downloadInfos.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
      ElMessage.success(`批量下载完成，共下载 ${downloadInfos.length} 个文件`)
    } else {
      ElMessage.error(data.message || '获取下载链接失败')
    }
  } catch (error) {
    console.error('批量下载简历失败:', error)
    if (!error.isAuth) {
      ElMessage.error('批量下载失败，请重试')
    }
  } finally {
    operationLoading.value.download = false
  }
}

const handleBatchDelete = async () => {
  if (selectedResumes.value.length === 0) {
    ElMessage.warning('请先选择要删除的简历')
    return
  }
  
  // 防抖：如果正在删除，直接返回
  if (operationLoading.value.delete) return
  
  try {
    // 确认删除
    const resumeNames = selectedResumes.value.map(resume => resume.title).join('、')
    await ElMessageBox.confirm(
      `确定要删除以下简历吗？\n${resumeNames}`,
      '确认批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false,
        customClass: 'batch-delete-dialog'
      }
    )
    
    // 调用删除API
    operationLoading.value.delete = true
    const resumeIds = selectedResumes.value.map(resume => resume.id)
    const response = await deleteResumes(resumeIds)
    const data = response?.data || response
    
    if (data.code === 200) {
      ElMessage.success(`批量删除成功，共删除 ${selectedResumes.value.length} 个简历`)
      // 重新加载简历列表
      await fetchResumeList()
    } else {
      ElMessage.error(data.message || '批量删除失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消批量删除')
    } else {
      console.error('批量删除简历失败:', error)
      if (!error.isAuth) {
        ElMessage.error('批量删除失败，请重试')
      }
    }
  } finally {
    operationLoading.value.delete = false
  }
}

const handleUpload = () => {
  uploadDialogVisible.value = true
  // 清空之前的文件列表
  uploadFiles.value = []
}

const handleCreate = () => {
  ElMessage.info('创建简历功能开发中...')
}



const handlePreview = async (resume = selectedResume.value) => {
  if (!resume) return
  
  // 防抖：如果正在加载，直接返回
  if (operationLoading.value.preview) return
  
  try {
    operationLoading.value.preview = true
    previewLoading.value = true
    const response = await getResumePreviewUrl(resume.id)
    const data = response?.data || response
    
    if (data.code === 200 && data.data?.previewUrl) {
      previewUrl.value = data.data.previewUrl
      previewDialogVisible.value = true
    } else {
      ElMessage.error(data.message || '获取预览地址失败')
    }
  } catch (error) {
    console.error('获取预览地址失败:', error)
    if (!error.isAuth) {
      ElMessage.error('获取预览地址失败，请重试')
    }
  } finally {
    operationLoading.value.preview = false
    previewLoading.value = false
  }
}

const handleEdit = (resume = selectedResume.value) => {
  if (!resume) return
  ElMessage.info(`编辑简历：${resume.title}`)
}

const handleDownload = async (resume = selectedResume.value) => {
  if (!resume) return
  
  // 防抖：如果正在下载，直接返回
  if (operationLoading.value.download) return
  
  try {
    operationLoading.value.download = true
    
    // 获取下载链接
    const response = await getResumeDownloadUrls([resume.id])
    const data = response?.data || response
    
    if (data.code === 200 && data.data && data.data.length > 0) {
      // 获取下载信息
      const downloadInfo = data.data[0]
      const { downloadUrl, downloadFileName } = downloadInfo
      
      // 使用fetch下载文件并设置正确的文件名
      const fileResponse = await fetch(downloadUrl)
      if (fileResponse.ok) {
        const blob = await fileResponse.blob()
        
        // 创建下载链接
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = downloadFileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // 清理URL对象
        window.URL.revokeObjectURL(url)
        
        ElMessage.success(`${downloadFileName}下载成功！`)
      } else {
        ElMessage.error('文件下载失败')
      }
    } else {
      ElMessage.error(data.message || '获取下载链接失败')
    }
  } catch (error) {
    console.error('下载简历失败:', error)
    if (!error.isAuth) {
      ElMessage.error('下载失败，请重试')
    }
  } finally {
    operationLoading.value.download = false
  }
}

const handleAnalyze = async (resume = selectedResume.value) => {
  if (!resume) return
  
  // 防抖：如果正在分析，直接返回
  if (operationLoading.value.analyze) return
  
  try {
    operationLoading.value.analyze = true
    analyzingResumeId.value = resume.id
    analyzeLoading.value = true
    
    const response = await analyzeResume(resume.id)
    const data = response?.data || response
    
    if (data.code === 200) {
      // 分析成功，显示结果
      ElMessage.success(data.message || '简历分析成功')
      analyzeHtml.value = data.data
      analyzeDialogVisible.value = true
    } else if (data.code === 900) {
      // 异步任务正在执行中
      ElMessage.info(data.message || '正在后台分析中，请稍后！')
    } else {
      // 其他错误情况
      ElMessage.error(data.message || '简历分析失败')
    }
  } catch (error) {
    console.error('简历分析失败:', error)
    if (!error.isAuth) {
      ElMessage.error('简历分析失败，请重试')
    }
  } finally {
    operationLoading.value.analyze = false
    analyzingResumeId.value = null
    analyzeLoading.value = false
  }
}

const openInNewTab = () => {
  if (previewUrl.value) {
    window.open(previewUrl.value, '_blank')
  }
}

const openAnalyzeInNewTab = () => {
  if (analyzeHtml.value) {
    const newWindow = window.open('', '_blank')
    newWindow.document.write(analyzeHtml.value)
    newWindow.document.close()
  }
}

const handleDelete = async (resume) => {
  // 防抖：如果正在删除，直接返回
  if (operationLoading.value.delete) return
  
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
    
    // 调用删除API
    operationLoading.value.delete = true
    const response = await deleteResumes([resume.id])
    const data = response?.data || response
    
    if (data.code === 200) {
      ElMessage.success('删除成功')
      // 重新加载简历列表
      await fetchResumeList()
    } else {
      ElMessage.error(data.message || '删除失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除')
    } else {
      console.error('删除简历失败:', error)
      if (!error.isAuth) {
        ElMessage.error('删除失败，请重试')
      }
    }
  } finally {
    operationLoading.value.delete = false
  }
}

// 分页相关方法
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 轮询查询简历异步上传结果
const startPolling = async (taskId, resumeId) => {
  // 如果该任务已经在轮询中，先停止
  stopPolling(taskId)
  
  // 创建新的轮询任务
  const taskInfo = {
    interval: null,
    pollCount: 0,
    resumeId: resumeId
  }
  pollingTasks.value.set(taskId, taskInfo)
  
  const poll = async () => {
    try {
      const response = await queryResumeAsyncResult(taskId, resumeId)
      const data = response?.data || response
      
      if (data.code === 200) {
        // 异步任务成功结束
        stopPolling(taskId)
        ElMessage.success('简历已解析完毕')
        
        // 将新解析的简历添加到列表开头
        const newResume = transformResumeData([data.data])[0]
        resumes.value.unshift(newResume)
        
        // 选择新上传的简历
        selectedResume.value = newResume
        
      } else if (data.code === 900) {
        // 异步任务还在执行中，继续轮询
        taskInfo.pollCount++
        console.log(`任务 ${taskId} 解析中，第${taskInfo.pollCount}次轮询，继续等待...`)
        
        // 根据轮询次数设置不同的间隔
        if (taskInfo.pollCount === 1) {
          // 第一次轮询后，等待10秒进行第二次轮询
          taskInfo.interval = setTimeout(() => {
            poll()
          }, 10000)
        } else {
          // 第二次轮询后，每5秒轮询一次
          taskInfo.interval = setInterval(poll, 5000)
        }
        
      } else if (data.code === 901) {
        // 异步任务结束但有错误
        stopPolling(taskId)
        ElMessage.error(data.message || '简历解析失败')
        
      } else {
        // 其他错误情况
        stopPolling(taskId)
        ElMessage.error(data.message || '查询解析状态失败')
      }
    } catch (error) {
      console.error(`任务 ${taskId} 轮询查询失败:`, error)
      if (!error.isAuth) {
        ElMessage.error('查询解析状态失败，请重试')
      }
      stopPolling(taskId)
    }
  }
  
  // 等待2秒后开始第一次轮询
  setTimeout(async () => {
    await poll()
  }, 2000)
}

// 停止指定任务的轮询
const stopPolling = (taskId) => {
  const taskInfo = pollingTasks.value.get(taskId)
  if (taskInfo && taskInfo.interval) {
    if (taskInfo.interval._destroyed) {
      clearTimeout(taskInfo.interval)
    } else {
      clearInterval(taskInfo.interval)
    }
    pollingTasks.value.delete(taskId)
  }
}

// 停止所有轮询
const stopAllPolling = () => {
  pollingTasks.value.forEach((taskInfo) => {
    if (taskInfo.interval) {
      if (taskInfo.interval._destroyed) {
        clearTimeout(taskInfo.interval)
      } else {
        clearInterval(taskInfo.interval)
      }
    }
  })
  pollingTasks.value.clear()
}



// 上传相关方法
async function customUpload(option) {
  // 防抖：如果正在上传，直接返回
  if (operationLoading.value.upload) return
  
  try {
    operationLoading.value.upload = true
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
    // 只对非全局登录类错误弹窗
    if (!e.isAuth) {
      ElMessage.error('上传失败，请重试')
    }
    option.onError(e)
  } finally {
    operationLoading.value.upload = false
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
  padding: 0 20px 20px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  gap: 70px;
  position: fixed;
  top: 0;
  left: 20px;
  right: 20px;
  z-index: 1000;
}

.header-content {
  min-width: 0;
}

.header-stats {
  display: flex;
  align-items: center;
  margin-left: 150px;
  margin-right: 20px;
}

.stat-cards-row {
  display: flex;
  gap: 20px;
}

.header-content .page-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 6px 0;
}

.header-content .page-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  white-space: nowrap;
}

/* 统计卡片样式已在页面头部中定义 */

.stat-card {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  transition: transform 0.3s ease;
  min-width: 150px;
}

.stat-card:hover {
  transform: scale(1.05);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
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
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-info .stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

/* 主要内容区域 */
.main-content {
  margin-bottom: 20px;
  margin-top: 140px;
}

/* 简历列表区域 */
.resume-list-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.section-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.select-all-area {
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* 加载和空状态 */
.loading-container {
  padding: 30px 0;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #7f8c8d;
}

.loading-placeholder p {
  margin: 0;
  font-size: 16px;
}

.empty-container {
  padding: 40px 0;
  text-align: center;
}

/* 简历卡片 */
.resume-cards {
  display: grid;
  gap: 12px;
}

.resume-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
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
  margin-bottom: 12px;
}

.resume-card-body {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.resume-content {
  flex: 1;
}

.resume-title h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 6px 0;
}

.resume-info {
  width: 100%;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  color: #64748b;
  width: 80px;
  flex-shrink: 0;
  font-weight: 400;
}

.info-item .value {
  color: #334155;
  font-weight: 400;
}

.sha256-value {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #475569;
  white-space: nowrap;
  font-weight: 400 !important;
}



.resume-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.resume-stats {
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
}

/* 详情面板 */

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.detail-item .label {
  color: #7f8c8d;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 500;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 上传对话框 */
.upload-area {
  width: 100%;
}

.el-upload__tip {
  color: #7f8c8d;
}

/* 禁用状态样式 */

/* 预览对话框样式 */
.preview-dialog {
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
}

/* 中间区域样式 */
.section-center {
  display: flex;
  align-items: center;
  gap: 16px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* 操作按钮区域样式 */
.action-buttons-section {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

/* 简历选择样式 */
.resume-selection {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.resume-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.resume-title {
  flex: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
}

.resume-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.action-item {
  width: 80px;
  height: 28px;
  font-size: 12px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  white-space: nowrap;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-item:hover {
  opacity: 0.8;
}

.action-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 预览按钮 - 蓝色 */
.action-item.preview {
  background: #409eff;
}

/* 编辑按钮 - 绿色 */
.action-item.edit {
  background: #67c23a;
}

/* 下载按钮 - 橙色 */
.action-item.download {
  background: #e6a23c;
}

/* 分析按钮 - 灰色 */
.action-item.analyze {
  background: #909399;
}

/* 删除按钮 - 红色 */
.action-item.delete {
  background: #f56c6c;
}

/* 预览按钮悬停提示 */
.action-item.preview.no-preview {
  position: relative;
}

.action-item.preview.no-preview::before {
  content: '不支持预览';
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.action-item.preview.no-preview::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.action-item.preview.no-preview:hover::before,
.action-item.preview.no-preview:hover::after {
  opacity: 1;
  visibility: visible;
}

/* 编辑按钮悬停提示 */
.action-item.edit.dev-in-progress {
  position: relative;
}

.action-item.edit.dev-in-progress::before {
  content: '该功能正在开发中';
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.action-item.edit.dev-in-progress::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.action-item.edit.dev-in-progress:hover::before,
.action-item.edit.dev-in-progress:hover::after {
  opacity: 1;
  visibility: visible;
}

.preview-container {
  height: 600px;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 分析对话框样式 */
.analyze-dialog {
}

.analyze-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
}

.analyze-container {
  height: 700px;
  overflow: hidden;
}

.analyze-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 全局加载遮罩 */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.loading-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {

}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

}
</style> 