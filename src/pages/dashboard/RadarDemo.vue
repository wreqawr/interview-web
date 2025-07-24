<template>
  <div ref="radarRef" style="width:100%;height:300px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let echarts = null
const radarRef = ref(null)

onMounted(async () => {
  if (!echarts) {
    echarts = await import('echarts')
  }
  const chart = echarts.init(radarRef.value)
  chart.setOption({
    tooltip: {},
    radar: {
      indicator: [
        { name: '技术', max: 100 },
        { name: '沟通', max: 100 },
        { name: '解决问题', max: 100 },
        { name: '文化契合', max: 100 },
        { name: '经验匹配', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [90, 75, 85, 80, 90],
          name: '候选人能力'
        }
      ]
    }]
  })
})
</script> 