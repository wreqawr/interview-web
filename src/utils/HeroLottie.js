import lottie from 'lottie-web'
import {AICallAgentState, AICallSpeakingInterruptedReason, AICallState} from 'aliyun-auikit-aicall'

const BASE_PATH = '/hero/'

class HeroLottie {
  constructor(container, controller) {
    this.container = container
    this.controller = controller
    this.destroyed = false
    this.animationsMap = {}
    this.currentStatus = undefined
    this.nextStatus = undefined
    this.waitingStatus = undefined
    this.init()
  }

  destroy() {
    this.destroyed = true
    Object.entries(this.animationsMap).forEach(async ([key, animation]) => {
      const anim = await animation
      anim?.destroy()
      delete this.animationsMap[key]
    })
    if (this.container) {
      this.container.innerHTML = ''
    }
    if (this.controller) {
      this.controller.off('AICallAgentStateChanged', this.onAgentStateChange)
      this.controller.off('AICallAgentEmotionNotify', this.onEmotionChange)
      this.controller.off('AICallSpeakingInterrupted', this.onInterrupted)
      this.controller.off('AICallStateChanged', this.onCallStateChange)
    }
  }

  getAnimiationFromStatus(status) {
    if (status === 'Error') {
      return 'Interrupting'
    }
    return status
  }

  async loadLottie(container, name, pathPrefix = '', loop = true) {
    const lottieItem = lottie.loadAnimation({
      path: `${BASE_PATH}${pathPrefix}${name}/${name}.json`,
      container,
      loop: false,
      autoplay: false
    })

    // hide first
    lottieItem.hide()

    // reverse and play
    lottieItem.addEventListener('complete', () => {
      if (lottieItem.playDirection === 1) {
        lottieItem.setDirection(-1)
      } else {
        // no loop needed
        if (!loop) return
        lottieItem.setDirection(1)
      }

      lottieItem.play()
    })

    return new Promise((resolve, reject) => {
      lottieItem.addEventListener('data_failed', () => {
        reject('load lottie failed')
      })
      lottieItem.addEventListener('loaded_images', () => {
        resolve(lottieItem)
      })
    })
  }

  scheduleNextAnimation = async () => {
    const headLottieItem = await this.animationsMap.Head

    if (headLottieItem?.playDirection === 1) {
      // Error, Stop
      if (this.currentStatus === 'Error') {
        const coveringLottieItem = await this.animationsMap['CoveringEyes']
        coveringLottieItem?.pause()
        return
      }

      if (this.currentStatus === 'Interrupting') {
        this.nextStatus = this.waitingStatus || 'Listening'
        this.waitingStatus = undefined
      }
      this.toNextStatus(true)
    }
  }

  toNextStatus = async (fromEnd = false) => {
    const nextStatus = this.nextStatus
    if (!nextStatus) return

    if (this.nextStatus === nextStatus) {
      const nextAnimation = this.getAnimiationFromStatus(nextStatus)
      const currentAnimation = this.getAnimiationFromStatus(this.currentStatus)
      if (!currentAnimation || !nextAnimation) return

      const nextEyeItem = await this.animationsMap[nextAnimation]

      // 不是 Interrupting 或 Error 直接执行
      if ((currentAnimation !== 'Interrupting' && nextAnimation !== 'Interrupting') || fromEnd) {
        const currentEyeItem = await this.animationsMap[currentAnimation]

        if (currentEyeItem) {
          currentEyeItem.stop()
          currentEyeItem.hide()
        }

        nextEyeItem?.show()
        nextEyeItem?.play()

        if (
          (currentAnimation === 'Interrupting' || nextAnimation === 'Interrupting') &&
          currentAnimation !== nextAnimation
        ) {
          const coveringLottieItem = await this.animationsMap['CoveringEyes']
          const handLottieItem = await this.animationsMap['Hand']

          if (currentAnimation === 'Interrupting') {
            coveringLottieItem?.stop()
            coveringLottieItem?.hide()
            handLottieItem?.show()
            handLottieItem?.play()
          } else {
            coveringLottieItem?.show()
            coveringLottieItem?.play()
            handLottieItem?.stop()
            handLottieItem?.hide()
          }
        }

        this.currentStatus = nextStatus
        this.nextStatus = undefined
        this.waitingStatus = undefined
      }
    }
  }

  setNextStatus = (nextStatus) => {
    if (!nextStatus || this.currentStatus === nextStatus) return
    if (this.nextStatus !== 'Interrupting' && this.nextStatus !== 'Error') {
      this.nextStatus = nextStatus
    } else if (this.nextStatus === 'Interrupting' && nextStatus === 'Error') {
      this.waitingStatus = nextStatus
    }
    this.toNextStatus()
  }

  onAgentStateChange = (state) => {
    let nextStatus
    if (state === AICallAgentState.Listening) {
      nextStatus = 'Listening'
    } else if (state === AICallAgentState.Thinking) {
      nextStatus = 'Thinking'
    } else if (state === AICallAgentState.Speaking) {
      if (this.currentStatus !== 'Happy' && this.currentStatus !== 'Sad') {
        nextStatus = 'Speaking'
      }
    }

    // delay to handle interrupt first
    setTimeout(() => {
      this.setNextStatus(nextStatus)
    }, 100)
  }

  onCallStateChange = (state) => {
    if (state === AICallState.Error) {
      this.setNextStatus('Error')
    }
  }

  onEmotionChange = (emotion) => {
    let nextStatus
    if (emotion === 'sad') {
      nextStatus = 'Sad'
    } else if (emotion === 'happy') {
      nextStatus = 'Happy'
    }

    this.setNextStatus(nextStatus)
  }

  onInterrupted = (reason) => {
    if (reason === AICallSpeakingInterruptedReason.byInterruptSpeaking) {
      this.setNextStatus('Interrupting')
    }
  }

  init() {
    if (!this.container) return
    const enterContainer = document.createElement('div')
    this.container.appendChild(enterContainer)
    const enterLottie = lottie.loadAnimation({
      path: `${BASE_PATH}Enter/Enter.json`,
      container: enterContainer,
      loop: false
    })

    const headContainer = document.createElement('div')
    headContainer.style.position = 'absolute'
    headContainer.style.left = '0'
    headContainer.style.top = '0'
    headContainer.style.width = '540px'
    headContainer.style.height = '540px'
    headContainer.style.zIndex = '1'
    this.container.appendChild(headContainer)
    const handContainer = document.createElement('div')
    handContainer.style.position = 'absolute'
    handContainer.style.left = '0'
    handContainer.style.top = '0'
    handContainer.style.width = '540px'
    handContainer.style.height = '540px'
    handContainer.style.zIndex = '2'
    this.container.appendChild(handContainer)
    const eyeContainer = document.createElement('div')
    eyeContainer.style.position = 'absolute'
    eyeContainer.style.left = '0'
    eyeContainer.style.top = '0'
    eyeContainer.style.width = '540px'
    eyeContainer.style.height = '540px'
    eyeContainer.style.zIndex = '10'
    this.container.appendChild(eyeContainer)
    const eyeCoveringContainer = document.createElement('div')
    eyeCoveringContainer.style.position = 'absolute'
    eyeCoveringContainer.style.left = '0'
    eyeCoveringContainer.style.top = '0'
    eyeCoveringContainer.style.width = '540px'
    eyeCoveringContainer.style.height = '540px'
    eyeCoveringContainer.style.zIndex = '11'
    this.container.appendChild(eyeCoveringContainer)

    let initPromise = []
    enterLottie.addEventListener('loaded_images', () => {
      initPromise = [
        this.loadLottie(headContainer, 'Head'),
        this.loadLottie(handContainer, 'Hand'),
        this.loadLottie(eyeContainer, 'Listening', 'EyeEmotions/')
      ]
      this.animationsMap.Head = initPromise[0]
      this.animationsMap.Hand = initPromise[1]
      this.animationsMap.Listening = initPromise[2]

      // delay to load all animations
      setTimeout(() => {
        this.animationsMap.Happy = this.loadLottie(eyeContainer, 'Happy', 'EyeEmotions/')
        this.animationsMap.Interrupting = this.loadLottie(eyeContainer, 'Interrupting', 'EyeEmotions/')
        this.animationsMap.Sad = this.loadLottie(eyeContainer, 'Sad', 'EyeEmotions/')
        this.animationsMap.Speaking = this.loadLottie(eyeContainer, 'Speaking', 'EyeEmotions/')
        this.animationsMap.Thinking = this.loadLottie(eyeContainer, 'Thinking', 'EyeEmotions/')
        this.animationsMap.CoveringEyes = this.loadLottie(eyeCoveringContainer, 'CoveringEyes')
      }, 1000)
    })

    enterLottie.addEventListener('complete', async () => {
      const items = await Promise.all(initPromise)
      enterLottie.destroy()
      if (this.destroyed) return

      items.forEach((item) => {
        item.show()
        item.play()
      })
      this.currentStatus = 'Listening'
      this.toNextStatus()

      const [headItem] = items
      // sync position of eys with head
      headItem.addEventListener('drawnFrame', () => {
        const currentFrame = headItem.currentFrame

        if (eyeContainer) {
          eyeContainer.style.top = `${((currentFrame / 20) * 12 * 540) / 720}px`
        }
      })

      headItem.addEventListener('complete', this.scheduleNextAnimation)
    })

    this.controller.on('AICallAgentStateChanged', this.onAgentStateChange)
    this.controller.on('AICallAgentEmotionNotify', this.onEmotionChange)
    this.controller.on('AICallSpeakingInterrupted', this.onInterrupted)
    this.controller.on('AICallStateChanged', this.onCallStateChange)
  }
}

export default HeroLottie

