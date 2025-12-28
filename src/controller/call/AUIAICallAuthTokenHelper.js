// RTC Token 助手类 - 完全按照 React 版本实现

import {v4 as uuidv4} from 'uuid'
import VoiceService from '@/api/voiceService'

export default class AUIAICallAuthTokenHelper {
  static shared = new AUIAICallAuthTokenHelper()

  constructor() {
    this.authToken = ''
    this.requestTime = 0
    this.userId = ''
    this.requestPromise = null
  }

  isAuthTokenValid() {
    // Token 24小时有效，超过23小时则需要重新获取，避免在使用过程中失效
    return this.authToken.length > 0 && Date.now() - this.requestTime < 23 * 60 * 60 * 1000
  }

  async fetchAuthToken(userId) {
    if (this.isAuthTokenValid() && this.userId === userId) {
      return this.authToken
    }
    if (this.requestPromise && this.userId === userId) {
      return this.requestPromise
    }
    this.userId = userId
    this.requestPromise = this.requestNewAuthToken()
    return this.requestPromise
  }

  async requestNewAuthToken() {
    this.authToken = ''
    this.authToken = await VoiceService.getRtcAuthToken(this.userId, uuidv4())
    this.requestTime = Date.now()
    this.requestPromise = null
    return this.authToken
  }
}
