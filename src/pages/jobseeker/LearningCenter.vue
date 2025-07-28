<template>
  <div class="learning-center">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>学习资源</span>
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索学习资源..." 
                style="width: 300px"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="8" v-for="course in filteredCourses" :key="course.id">
              <el-card class="course-card" shadow="hover">
                <div class="course-image">
                  <el-image :src="course.image" fit="cover" />
                  <div class="course-overlay">
                    <el-button type="primary" @click="startLearning(course)">开始学习</el-button>
                  </div>
                </div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="course-meta">
                    <span class="duration">{{ course.duration }}</span>
                    <span class="level">{{ course.level }}</span>
                  </div>
                  <el-progress :percentage="course.progress" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>学习进度</span>
            </div>
          </template>
          
          <div class="learning-progress">
            <div class="progress-item">
              <div class="progress-header">
                <span>总体进度</span>
                <span>{{ overallProgress }}%</span>
              </div>
              <el-progress :percentage="overallProgress" :color="getProgressColor(overallProgress)" />
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <span>本周学习时长</span>
                <span>{{ weeklyHours }}小时</span>
              </div>
              <el-progress :percentage="weeklyProgress" :color="getProgressColor(weeklyProgress)" />
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <span>完成课程</span>
                <span>{{ completedCourses }}/{{ totalCourses }}</span>
              </div>
              <el-progress :percentage="courseProgress" :color="getProgressColor(courseProgress)" />
            </div>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>推荐学习</span>
            </div>
          </template>
          
          <div class="recommended-courses">
            <div v-for="course in recommendedCourses" :key="course.id" class="recommended-item">
              <div class="course-thumbnail">
                <el-image :src="course.image" fit="cover" />
              </div>
              <div class="course-details">
                <h4>{{ course.title }}</h4>
                <p>{{ course.description }}</p>
                <el-button size="small" type="primary" @click="startLearning(course)">
                  立即学习
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')

const courses = ref([
  {
    id: 1,
    title: '前端面试技巧',
    description: '掌握前端面试的核心技巧和常见问题',
    image: 'https://via.placeholder.com/300x200/409EFF/ffffff?text=前端面试',
    duration: '2小时',
    level: '初级',
    progress: 75
  },
  {
    id: 2,
    title: 'Vue.js 深度解析',
    description: '深入学习Vue.js框架的核心原理和最佳实践',
    image: 'https://via.placeholder.com/300x200/67C23A/ffffff?text=Vue.js',
    duration: '4小时',
    level: '中级',
    progress: 45
  },
  {
    id: 3,
    title: '算法与数据结构',
    description: '掌握面试中常见的算法题和数据结构',
    image: 'https://via.placeholder.com/300x200/E6A23C/ffffff?text=算法',
    duration: '6小时',
    level: '高级',
    progress: 30
  },
  {
    id: 4,
    title: '系统设计面试',
    description: '学习系统设计面试的方法和技巧',
    image: 'https://via.placeholder.com/300x200/F56C6C/ffffff?text=系统设计',
    duration: '3小时',
    level: '高级',
    progress: 20
  },
  {
    id: 5,
    title: 'React 实战',
    description: '通过实战项目学习React开发',
    image: 'https://via.placeholder.com/300x200/909399/ffffff?text=React',
    duration: '5小时',
    level: '中级',
    progress: 60
  },
  {
    id: 6,
    title: '面试心理准备',
    description: '做好面试前的心理准备和状态调整',
    image: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=心理准备',
    duration: '1小时',
    level: '初级',
    progress: 90
  }
])

const recommendedCourses = ref([
  {
    id: 7,
    title: 'TypeScript 入门',
    description: '学习TypeScript的基础语法和类型系统',
    image: 'https://via.placeholder.com/100x60/3178C6/ffffff?text=TS'
  },
  {
    id: 8,
    title: 'Node.js 后端开发',
    description: '掌握Node.js后端开发技能',
    image: 'https://via.placeholder.com/100x60/339933/ffffff?text=Node.js'
  }
])

const filteredCourses = computed(() => {
  if (!searchKeyword.value) return courses.value
  return courses.value.filter(course => 
    course.title.includes(searchKeyword.value) || 
    course.description.includes(searchKeyword.value)
  )
})

const overallProgress = ref(65)
const weeklyHours = ref(12)
const weeklyProgress = ref(80)
const completedCourses = ref(3)
const totalCourses = ref(8)
const courseProgress = ref(37.5)

const getProgressColor = (progress) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const startLearning = (course) => {
  ElMessage.success(`开始学习：${course.title}`)
}
</script>

<style scoped>
.learning-center {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  position: relative;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.course-card:hover .course-overlay {
  opacity: 1;
}

.course-info {
  padding: 15px 0;
}

.course-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.course-info p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;
}

.learning-progress {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.recommended-courses {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommended-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.course-thumbnail {
  width: 100px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
}

.course-details h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #303133;
}

.course-details p {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}
</style> 