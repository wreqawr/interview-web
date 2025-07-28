<template>
  <div class="system-monitor">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>CPU使用率</span>
            </div>
          </template>
          <div class="monitor-item">
            <el-progress 
              :percentage="cpuUsage" 
              :color="getCpuColor(cpuUsage)"
              :stroke-width="20"
            />
            <div class="monitor-value">{{ cpuUsage }}%</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>内存使用率</span>
            </div>
          </template>
          <div class="monitor-item">
            <el-progress 
              :percentage="memoryUsage" 
              :color="getMemoryColor(memoryUsage)"
              :stroke-width="20"
            />
            <div class="monitor-value">{{ memoryUsage }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>磁盘使用率</span>
            </div>
          </template>
          <div class="monitor-item">
            <el-progress 
              :percentage="diskUsage" 
              :color="getDiskColor(diskUsage)"
              :stroke-width="20"
            />
            <div class="monitor-value">{{ diskUsage }}%</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>网络状态</span>
            </div>
          </template>
          <div class="network-status">
            <div class="status-item">
              <span class="status-label">在线用户</span>
              <el-tag type="success">{{ onlineUsers }}</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">系统运行时间</span>
              <span>{{ uptime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统日志</span>
            </div>
          </template>
          <el-table :data="systemLogs" style="width: 100%">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="level" label="级别" width="100">
              <template #default="scope">
                <el-tag :type="getLogLevelType(scope.row.level)">
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="消息" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cpuUsage = ref(45)
const memoryUsage = ref(68)
const diskUsage = ref(75)
const onlineUsers = ref(156)
const uptime = ref('15天 8小时 32分钟')

const systemLogs = ref([
  {
    time: '2025-01-28 16:30:00',
    level: 'INFO',
    message: '系统启动成功'
  },
  {
    time: '2025-01-28 16:25:00',
    level: 'WARN',
    message: '内存使用率超过60%'
  },
  {
    time: '2025-01-28 16:20:00',
    level: 'INFO',
    message: '用户登录: admin'
  },
  {
    time: '2025-01-28 16:15:00',
    level: 'ERROR',
    message: '数据库连接超时'
  }
])

const getCpuColor = (usage) => {
  if (usage < 50) return '#67C23A'
  if (usage < 80) return '#E6A23C'
  return '#F56C6C'
}

const getMemoryColor = (usage) => {
  if (usage < 60) return '#67C23A'
  if (usage < 80) return '#E6A23C'
  return '#F56C6C'
}

const getDiskColor = (usage) => {
  if (usage < 70) return '#67C23A'
  if (usage < 90) return '#E6A23C'
  return '#F56C6C'
}

const getLogLevelType = (level) => {
  const levelMap = {
    'INFO': 'info',
    'WARN': 'warning',
    'ERROR': 'danger'
  }
  return levelMap[level] || 'info'
}

let timer = null

onMounted(() => {
  // 模拟实时数据更新
  timer = setInterval(() => {
    cpuUsage.value = Math.floor(Math.random() * 30) + 40
    memoryUsage.value = Math.floor(Math.random() * 20) + 60
    diskUsage.value = Math.floor(Math.random() * 10) + 70
    onlineUsers.value = Math.floor(Math.random() * 50) + 140
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.system-monitor {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.monitor-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.monitor-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  min-width: 60px;
}

.network-status {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #606266;
  font-size: 14px;
}
</style> 