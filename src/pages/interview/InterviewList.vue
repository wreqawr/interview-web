<template>
  <div>
    <h2>面试历史</h2>
    <el-table :data="[]">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default>
          <el-button type="primary" size="small">进入面试</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// 数据后续补充
</script> 