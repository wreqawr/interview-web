<template>
  <div class="voice-controls">
    <div class="controls-buttons">
      <!-- 麦克风按钮 -->
      <button
        v-if="!enablePushToTalk"
        class="control-btn mic-btn"
        :class="{ active: !microphoneMuted, muted: microphoneMuted }"
        @click="toggleMicrophone"
        :title="microphoneMuted ? '取消静音' : '静音'"
      >
        <el-icon v-if="microphoneMuted" class="btn-icon">
          <MicrophoneSlash />
        </el-icon>
        <el-icon v-else class="btn-icon">
          <Microphone />
        </el-icon>
        <span class="btn-label">{{ microphoneMuted ? '已静音' : '静音' }}</span>
      </button>

      <!-- 通话/挂断按钮 -->
      <button
        class="control-btn call-btn"
        :class="{ 'is-calling': isCalling }"
        @click="handleCallClick"
        :title="isCalling ? '挂断' : '开始通话'"
      >
        <el-icon v-if="isCalling" class="btn-icon">
          <PhoneFilled />
        </el-icon>
        <el-icon v-else class="btn-icon">
          <Phone />
        </el-icon>
        <span class="btn-label">{{ isCalling ? '挂断' : '开始' }}</span>
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
        title="按住说话"
      >
        <el-icon class="btn-icon">
          <Microphone />
        </el-icon>
        <span class="btn-label">按住说话</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useVoiceInterviewStore} from '@/stores/voiceInterview'
import {AICallState} from 'aliyun-auikit-aicall'
import {Microphone, MicrophoneSlash, Phone, PhoneFilled} from '@element-plus/icons-vue'

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
  gap: 15px;
  flex-wrap: wrap;
}

.control-btn {
  min-width: 100px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.control-btn:hover::before {
  left: 100%;
}

.control-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.control-btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-label {
  font-size: 14px;
  font-weight: 600;
}

/* 麦克风按钮 */
.mic-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.mic-btn:hover {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.mic-btn.active {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.mic-btn.muted {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.mic-btn.muted:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #b91c1c;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* 通话按钮 */
.call-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  min-width: 110px;
}

.call-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.call-btn.is-calling {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.call-btn.is-calling:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

/* 按住说话按钮 */
.push-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
  min-width: 120px;
}

.push-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  transform: translateY(-2px);
}

.push-btn.active {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
}
</style>

