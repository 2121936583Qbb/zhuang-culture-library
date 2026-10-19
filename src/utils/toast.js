import { reactive } from 'vue'

// 极简全局 Toast 状态（无需第三方库）
const state = reactive({
  visible: false,
  message: '',
  type: 'info' // info | success | warning | error
})

let timer = null

export function toast(message, type = 'info') {
  state.message = message
  state.type = type
  state.visible = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    state.visible = false
  }, 2400)
}

export function useToast() {
  return { state, toast }
}
