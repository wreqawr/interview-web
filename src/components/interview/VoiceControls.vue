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
  width: 100%;
  padding: 0;
  background: transparent;
}

.controls-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.active {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}

.call-btn {
  width: 70px;
  height: 70px;
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  color: white;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.call-btn:hover {
  background: rgba(76, 175, 80, 0.4);
  box-shadow: 0 0 25px rgba(76, 175, 80, 0.5);
}

.call-btn.is-calling {
  background: rgba(244, 67, 54, 0.3);
  border-color: rgba(244, 67, 54, 0.5);
  box-shadow: 0 0 20px rgba(244, 67, 54, 0.3);
}

.call-btn.is-calling:hover {
  background: rgba(244, 67, 54, 0.4);
  box-shadow: 0 0 25px rgba(244, 67, 54, 0.5);
}

.push-btn {
  background: rgba(255, 152, 0, 0.3);
  border-color: rgba(255, 152, 0, 0.5);
  color: white;
}

.push-btn:hover {
  background: rgba(255, 152, 0, 0.4);
}

.push-btn.active {
  background: rgba(245, 124, 0, 0.4);
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(245, 124, 0, 0.5);
}
</style>

