<template>
  <div class="voice-controls">
    <div class="controls-buttons">
      <!-- 麦克风按钮 -->
      <button
        v-if="!enablePushToTalk"
        class="control-btn"
        :class="{ active: !microphoneMuted }"
        @click="toggleMicrophone"
      >
        <span v-if="microphoneMuted">🔇</span>
        <span v-else>🎤</span>
      </button>

      <!-- 通话/挂断按钮 -->
      <button
        class="control-btn call-btn"
        :class="{ 'is-calling': isCalling }"
        @click="handleCallClick"
      >
        <span v-if="isCalling">📞</span>
        <span v-else>☎️</span>
      </button>

      <!-- 按住说话按钮 -->
      <button
        v-if="enablePushToTalk"
        class="control-btn push-btn"
        :class="{ active: pushingToTalk }"
        @mousedown="startPushToTalk"
        @mouseup="stopPushToTalk"
        @touchstart="startPushToTalk"
        @touchend="stopPushToTalk"
      >
        <span>🎙️</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import {AICallState} from 'aliyun-auikit-aicall'

const props = defineProps({
  controller: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['call', 'stop'])

const voiceInterviewStore = useVoiceInterviewStore()

const microphoneMuted = computed(() => voiceInterviewStore.state.microphoneMuted)
const enablePushToTalk = computed(() => voiceInterviewStore.state.enablePushToTalk)
const pushingToTalk = computed(() => voiceInterviewStore.state.pushingToTalk)
const callState = computed(() => voiceInterviewStore.state.callState)

const isCalling = computed(() => {
  return callState.value === AICallState.Connected ||
         callState.value === AICallState.Connecting
})

const toggleMicrophone = () => {
  if (enablePushToTalk.value) return
  const to = !voiceInterviewStore.state.microphoneMuted
  props.controller?.muteMicrophone(to)
  voiceInterviewStore.setState({ microphoneMuted: to })
}

const startPushToTalk = () => {
  if (!enablePushToTalk.value) return
  voiceInterviewStore.setState({ pushingToTalk: true })
  props.controller?.muteMicrophone(false)
}

const stopPushToTalk = () => {
  if (!enablePushToTalk.value) return
  voiceInterviewStore.setState({ pushingToTalk: false })
  props.controller?.muteMicrophone(true)
}

const handleCallClick = () => {
  if (isCalling.value) {
    emit('stop')
  } else {
    emit('call')
  }
}
</script>

<style scoped>
.voice-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.controls-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  transform: scale(1.1);
  background: #e0e0e0;
}

.control-btn.active {
  background: #667eea;
  color: white;
}

.call-btn {
  width: 70px;
  height: 70px;
  background: #4caf50;
  color: white;
}

.call-btn.is-calling {
  background: #f44336;
}

.push-btn {
  background: #ff9800;
  color: white;
}

.push-btn.active {
  background: #f57c00;
  transform: scale(1.1);
}
</style>

