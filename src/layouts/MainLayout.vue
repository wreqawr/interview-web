<template>
  <div class="main-layout">
    <!-- 全局顶部导航栏 -->
    <GlobalNavigation />
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import GlobalNavigation from '@/components/GlobalNavigation.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f7f8fa;
}

.main-content {
  padding-top: 64px; /* 为固定导航栏留出空间 */
  min-height: calc(100vh - 64px);
}
</style> 