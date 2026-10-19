<template>
  <div class="app">
    <SideNav />
    <div class="main">
      <header class="topbar">
        <div class="crumb">
          <span class="crumb-home">🏠</span>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">{{ route.meta.title || '首页' }}</span>
        </div>
        <div class="topbar-right">
          <span class="offline-badge">🟢 本地离线 · 演示模式</span>
          <span class="clock">{{ now }}</span>
        </div>
      </header>
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from './components/SideNav.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const now = ref('')
let timer = null

function tick() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  now.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.app { display: flex; height: 100vh; }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar {
  height: 56px; flex: 0 0 56px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  background: #fffdf8; border-bottom: 1px solid var(--c-border);
  box-shadow: 0 2px 8px rgba(56,43,107,.06);
}
.crumb { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--c-ink-light); }
.crumb-current { color: var(--c-primary); font-weight: 600; }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.offline-badge {
  font-size: 12px; color: var(--c-success);
  background: rgba(79,138,95,.12); padding: 5px 12px; border-radius: 20px;
}
.clock { font-size: 13px; color: var(--c-ink-light); font-variant-numeric: tabular-nums; }
.content { flex: 1; overflow: hidden; position: relative; }
</style>
