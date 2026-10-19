<template>
  <div v-if="state.visible" :class="toastClass">
    {{ state.message }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../utils/toast.js'
const { state } = useToast()

const toastClass = computed(() => {
  return [
    'toast',
    `toast-${state.type}`
  ]
})
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 6px;
  color: #fff;
  z-index: 9999;
}
.toast-info {
  background: #409eff;
}
.toast-success {
  background: #67c23a;
}
.toast-warning {
  background: #e6a23c;
}
.toast-error {
  background: #f56c6c;
}
</style>
