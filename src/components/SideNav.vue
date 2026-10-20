<template>
  <aside class="sidenav">
    <div class="logo">
      <div class="logo-icon">🪶</div>
      <div class="logo-text">
        <h1>壮族文化数字资源库</h1>
        <span>AI · 壮乡 · 数字传承</span>
      </div>
    </div>

    <nav class="nav">
      <router-link
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </router-link>
    </nav>

    <div class="sidenav-footer">
      <p>🟢 本地离线演示版</p>
      <span>v1.0.0 · Mock 数据 · 无后端</span>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const items = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/workflow', label: 'AI智能入库', icon: '🤖' },
  { path: '/material', label: '文化素材入库', icon: '📥' },
  { path: '/model3d', label: '三维模型管理', icon: '🧊' },
  { path: '/dna', label: '文化DNA证书', icon: '🧬' },
  { path: '/ar', label: 'AR教学数据', icon: '🥽' },
  { path: '/vr', label: 'VR游戏资源管理', icon: '🎮' },
  { path: '/stats', label: '数据统计看板', icon: '📊' }
]
</script>

<style scoped>
.sidenav {
  width: 244px; flex: 0 0 244px; height: 100%;
  background: linear-gradient(180deg, #382b6b 0%, #2a2052 100%);
  color: #fff; display: flex; flex-direction: column;
  box-shadow: 4px 0 24px rgba(42,32,82,.35);
}
.logo {
  display: flex; align-items: center; gap: 12px;
  padding: 22px 20px 20px;
  border-bottom: 1px solid rgba(239,216,185,.15);
}
.logo-icon {
  width: 46px; height: 46px; border-radius: 12px; font-size: 24px;
  background: linear-gradient(135deg, #EFD8B9, #dcbf96);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,.3);
}
.logo-text h1 { font-size: 16px; font-weight: 700; line-height: 1.3; }
.logo-text span { font-size: 12px; color: rgba(239,216,185,.75); }
.nav { flex: 1; padding: 14px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 10px; color: rgba(255,255,255,.82);
  font-size: 14px; transition: all .16s ease; position: relative;
}
.nav-item:hover { background: rgba(255,255,255,.08); color: #fff; }
.nav-item.active {
  background: linear-gradient(90deg, rgba(239,216,185,.22), rgba(239,216,185,.06));
  color: #fff;
}
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 4px;
  border-radius: 4px; background: var(--c-gold);
}
.nav-icon { font-size: 18px; width: 24px; text-align: center; }
.nav-label { flex: 1; }
.nav-badge {
  font-size: 11px; padding: 2px 7px; border-radius: 10px;
  background: var(--c-brown); color: #fff;
}
.sidenav-footer {
  padding: 14px 20px; border-top: 1px solid rgba(239,216,185,.15);
  font-size: 12px; color: rgba(239,216,185,.6);
}
.sidenav-footer p { margin-bottom: 4px; color: rgba(239,216,185,.85); }
</style>
