// 语音面试状态管理
import {reactive} from 'vue'
import {AICallAgentType, AICallState} from 'aliyun-auikit-aicall'

const state = reactive({
  agentType: AICallAgentType.VoiceAgent,
  callState: AICallState.None,
  agentState: null,
  microphoneMuted: false,
  isSpeaking: false,
  voiceAvatarUrl: null,
  voiceId: null,
  callErrorMessage: null,
  enablePushToTalk: false,
  pushingToTalk: false,
})

export function useVoiceInterviewStore() {
  return {
    state,
    setState(updates) {
      Object.assign(state, updates)
    },
    reset() {
      state.callState = AICallState.None
      state.agentState = null
      state.microphoneMuted = false
      state.isSpeaking = false
      state.callErrorMessage = null
      state.pushingToTalk = false
    }
  }
}

