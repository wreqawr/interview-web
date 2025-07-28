<template>
  <div class="hr-analytics">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">156</div>
              <div class="stat-label">候选人总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">23</div>
              <div class="stat-label">今日面试</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <el-icon><Briefcase /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">12</div>
              <div class="stat-label">招聘岗位</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">68%</div>
              <div class="stat-label">面试通过率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>招聘趋势</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="招聘趋势图表开发中..." />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>岗位分布</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="岗位分布图表开发中..." />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>面试统计</span>
            </div>
          </template>
          <el-table :data="interviewStats" style="width: 100%">
            <el-table-column prop="month" label="月份" width="120" />
            <el-table-column prop="totalInterviews" label="面试总数" width="120" />
            <el-table-column prop="passedInterviews" label="通过面试" width="120" />
            <el-table-column prop="passRate" label="通过率" width="120">
              <template #default="scope">
                <el-progress :percentage="scope.row.passRate" />
              </template>
            </el-table-column>
            <el-table-column prop="avgScore" label="平均评分" width="120" />
            <el-table-column prop="topPosition" label="热门岗位" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, VideoPlay, Briefcase, TrendCharts } from '@element-plus/icons-vue'

const interviewStats = ref([
  {
    month: '2025-01',
    totalInterviews: 45,
    passedInterviews: 32,
    passRate: 71,
    avgScore: 4.2,
    topPosition: '前端开发工程师'
  },
  {
    month: '2024-12',
    totalInterviews: 38,
    passedInterviews: 26,
    passRate: 68,
    avgScore: 4.1,
    topPosition: '后端开发工程师'
  },
  {
    month: '2024-11',
    totalInterviews: 42,
    passedInterviews: 29,
    passRate: 69,
    avgScore: 4.3,
    topPosition: '产品经理'
  }
])
</script>

<style scoped>
.hr-analytics {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 