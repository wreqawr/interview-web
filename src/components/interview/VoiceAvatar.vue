<template>
  <div class="voice-avatar-container">
    <div class="voice-avatar">
      <div v-if="voiceAvatarUrl" class="avatar-image">
        <img :src="voiceAvatarUrl" alt="Avatar"/>
      </div>
      <div v-else class="voice-hero">
        <div class="hero-inner">
          <div class="hero-back"></div>
          <div class="hero-containers" ref="lottieContainerRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import HeroLottie from '@/utils/HeroLottie'

const props = defineProps({
  controller: {
    type: Object,
    default: null
  }
})

const voiceInterviewStore = useVoiceInterviewStore()
const lottieContainerRef = ref(null)
let heroLottie = null

const voiceAvatarUrl = computed(() => voiceInterviewStore.state.voiceAvatarUrl)

const initHeroLottie = () => {
  if (props.controller && lottieContainerRef.value && !voiceAvatarUrl.value && !heroLottie) {
    heroLottie = new HeroLottie(lottieContainerRef.value, props.controller)
    const onCallEnd = () => {
      heroLottie?.destroy()
      heroLottie = null
    }
    props.controller.on('AICallEnd', onCallEnd)
  }
}

watch(() => props.controller, (newController) => {
  if (newController && lottieContainerRef.value && !voiceAvatarUrl.value) {
    initHeroLottie()
  }
}, {immediate: true})

onMounted(() => {
  // 延迟初始化，确保DOM已渲染
  setTimeout(() => {
    initHeroLottie()
  }, 100)
})

onUnmounted(() => {
  if (heroLottie) {
    heroLottie.destroy()
    heroLottie = null
  }
})
</script>

<style scoped>
.voice-avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.voice-avatar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.voice-hero {
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  position: relative;
}

.hero-inner {
  position: relative;
  width: 360px;
  height: 540px;
  overflow: visible;
  margin: -80px -20px;
}

.hero-back {
  position: absolute;
  background-image: url(https://img.alicdn.com/imgextra/i1/O1CN01aeMosP1CcJ3MJinKG_!!6000000000101-2-tps-358-358.png);
  background-size: 179px 179px;
  width: 180px;
  height: 180px;
  left: 90px;
  top: 180px;
  background-repeat: no-repeat;
  z-index: 0;
}

.hero-containers {
  position: absolute;
  left: -90px;
  top: 32px;
  width: 540px;
  height: 540px;
  z-index: 2;
  pointer-events: none;
}

.hero-containers > div {
  position: absolute;
  left: 0;
  top: 0;
  width: 540px;
  height: 540px;
  pointer-events: none;
}

.hero-containers svg {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>

