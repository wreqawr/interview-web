<template>
  <div class="voice-avatar-container">
    <div class="voice-avatar">
      <div v-if="voiceAvatarUrl" class="avatar-image">
        <img :src="voiceAvatarUrl" alt="Avatar" />
      </div>
      <div v-else class="voice-hero">
        <div class="hero-icon">🎤</div>
        <div class="sound-waves" v-if="isSpeaking">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'

const voiceInterviewStore = useVoiceInterviewStore()

const voiceAvatarUrl = computed(() => voiceInterviewStore.state.voiceAvatarUrl)
const isSpeaking = computed(() => voiceInterviewStore.state.isSpeaking)
</script>

<style scoped>
.voice-avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.voice-avatar {
  position: relative;
  width: 200px;
  height: 200px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.voice-hero {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  position: relative;
}

.hero-icon {
  font-size: 80px;
  z-index: 1;
}

.sound-waves {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sound-waves span {
  width: 4px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}

.sound-waves span:nth-child(1) {
  animation-delay: 0s;
}

.sound-waves span:nth-child(2) {
  animation-delay: 0.2s;
}

.sound-waves span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>

