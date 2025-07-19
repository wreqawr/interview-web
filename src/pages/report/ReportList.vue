<template>
  <div>
    <h2>面试报告</h2>
    <el-table :data="[]">
      <el-table-column prop="title" label="报告名称" />
      <el-table-column prop="score" label="总分" />
      <el-table-column label="操作">
        <template #default>
          <el-button type="primary" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// 数据后续补充
</script> 