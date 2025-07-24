/* eslint-disable vue/multi-word-component-names */
<template>
  <div class="dashboard-container">
    <el-row :gutter="24" class="dashboard-header">
      <el-col :span="24">
        <h2>欢迎来到AI模拟面试系统数据驾驶舱</h2>
        <p class="subtitle">智能驱动，助力高效面试与人才管理</p>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="dashboard-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-title">今日面试</div>
          <div class="card-value">12</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-title">待评估报告</div>
          <div class="card-value">5</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-title">简历解析量</div>
          <div class="card-value">37</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-title">岗位匹配分析</div>
          <div class="card-value">8</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="dashboard-main">
      <el-col :span="16">
        <el-card shadow="always" class="radar-card">
          <template #header>
            <span>能力雷达图（示意）</span>
          </template>
          <RadarDemo />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          <template #header>
            <span>常用功能入口</span>
          </template>
          <el-menu class="dashboard-menu" router>
            <el-menu-item index="/resume">简历智能解析</el-menu-item>
            <el-menu-item index="/interview">AI模拟面试</el-menu-item>
            <el-menu-item index="/report">面试报告分析</el-menu-item>
            <el-menu-item index="/job">岗位智能匹配</el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ElRow, ElCol, ElCard, ElMenu, ElMenuItem } from 'element-plus'
import RadarDemo from './RadarDemo.vue'
</script>

<script>
export default {
  name: 'DashboardPage'
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f5f7fa;
}
.dashboard-header {
  margin-bottom: 24px;
}
.subtitle {
  color: #888;
  font-size: 16px;
  margin-top: 4px;
}
.dashboard-cards {
  margin-bottom: 32px;
}
.card-title {
  font-size: 16px;
  color: #666;
}
.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-top: 8px;
}
.dashboard-main {
  margin-top: 8px;
}
.radar-card {
  min-height: 340px;
}
.dashboard-menu {
  border: none;
}
</style> 