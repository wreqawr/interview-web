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
  width: 180px;
  height: 180px;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.voice-hero:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
}

.hero-icon {
  font-size: 80px;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.sound-waves {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
}

.sound-waves span {
  width: 4px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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
    opacity: 0.6;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>

