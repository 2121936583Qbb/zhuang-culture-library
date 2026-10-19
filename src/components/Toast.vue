<template>
  <Teleport to="body">
    <div v-if="state.visible" class="toast-wrap">
      <div class="toast" :class="`toast-${state.type}`">
        <span>{{ icon }}</span>
        <span>{{ state.message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../utils/toast.js'

const icon = computed(() => {
  switch (state.type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    case 'error': return '❌'
    default: return '💡'
  }
})
</script>
