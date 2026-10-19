<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🎮 VR 游戏资源管理</h2>
      <p class="page-sub">壮族文化沉浸式 VR 体验资源的上架、版本与分发管理（演示）</p>
    </div>

    <div class="toolbar">
      <span class="badge badge-primary">🎮 VR 资源库</span>
      <span class="badge badge-success">🖥️ 分发服务正常</span>
      <div class="spacer"></div>
      <button class="btn btn-primary btn-sm" @click="toast('上传新的 VR 资源包（模拟）', 'info')">➕ 上传资源包</button>
    </div>

    <div class="grid vr-grid">
      <div v-for="g in vrResources" :key="g.id" class="zhuang-card vr-card">
        <div class="vr-cover">
          <span class="vr-cover-icon">🎮</span>
          <span class="badge vr-status" :class="g.status === '已发布' ? 'badge-success' : 'badge-warning'">{{ g.status }}</span>
        </div>
        <div class="card-body">
          <h3 class="vr-name">{{ g.name }}</h3>
          <div class="vr-tags">
            <span class="badge badge-primary">{{ g.genre }}</span>
            <span class="badge badge-neutral">{{ g.platform }}</span>
          </div>
          <div class="vr-meta">
            <div><label>时长</label><b>{{ g.duration }}</b></div>
            <div><label>体积</label><b>{{ g.size }}</b></div>
            <div><label>评分</label><b class="rating">⭐ {{ g.rating }}</b></div>
          </div>
          <div class="vr-actions">
            <button class="btn btn-gold btn-sm" @click="launch(g)">🎮 启动体验</button>
            <button class="btn btn-outline btn-sm" @click="toast(`「${g.name}」版本信息已复制（模拟）`, 'info')">📋 详情</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 启动弹窗 -->
    <Modal v-model="launchView.show" :title="`VR 场景 · ${launchView.data?.name || ''}`" width="600px">
      <div v-if="launchView.data" class="vr-body">
        <div class="vr-room">
          <div class="vr-hmd">🥽</div>
          <p class="vr-loading">正在加载 VR 场景…</p>
          <div class="vr-bar"><div class="vr-bar-fill"></div></div>
          <p class="vr-info">{{ launchView.data.genre }} · {{ launchView.data.platform }} · {{ launchView.data.duration }}</p>
        </div>
        <div class="vr-tip">🕹️ 请佩戴 VR 头显，进入沉浸式壮族文化体验（模拟加载动画）</div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="launchView.show = false">取消</button>
        <button class="btn btn-primary" @click="toast('已进入 VR 体验（模拟）', 'success')">🚀 进入场景</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { vrResources } from '../data/mock.js'

const launchView = reactive({ show: false, data: null })

function launch(g) { launchView.data = g; launchView.show = true }
</script>

<style scoped>
.vr-grid { grid-template-columns: repeat(2, 1fr); }
.vr-card { transition: all .18s; }
.vr-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.vr-cover {
  height: 130px; position: relative; display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(circle at 30% 40%, rgba(239,216,185,.25), transparent 55%),
    linear-gradient(135deg, #2a2052, #382b6b 50%, #865F50);
}
.vr-cover-icon { font-size: 56px; filter: drop-shadow(0 4px 10px rgba(0,0,0,.4)); }
.vr-status { position: absolute; top: 12px; right: 12px; }
.vr-name { font-size: 17px; color: var(--c-primary); margin-bottom: 8px; }
.vr-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.vr-meta { display: flex; gap: 20px; margin-bottom: 14px; }
.vr-meta div { display: flex; flex-direction: column; gap: 3px; }
.vr-meta label { font-size: 11px; color: var(--c-ink-light); }
.vr-meta b { font-size: 13px; color: var(--c-ink); }
.vr-meta .rating { color: var(--c-gold); }
.vr-actions { display: flex; gap: 10px; }

.vr-body { text-align: center; }
.vr-room { padding: 20px; background: rgba(56,43,107,.05); border-radius: 12px; }
.vr-hmd { font-size: 64px; animation: ar-float 2.4s ease-in-out infinite; }
.vr-loading { font-size: 14px; color: var(--c-primary); font-weight: 600; margin: 12px 0; }
.vr-bar { height: 8px; background: #e6d6b8; border-radius: 6px; overflow: hidden; width: 70%; margin: 0 auto 14px; }
.vr-bar-fill {
  height: 100%; width: 70%; border-radius: 6px;
  background: linear-gradient(90deg, var(--c-primary), var(--c-brown));
  animation: load 1.8s ease-in-out infinite;
}
@keyframes load { 0% { width: 10%; } 50% { width: 85%; } 100% { width: 10%; } }
.vr-info { font-size: 12px; color: var(--c-ink-light); }
.vr-tip { margin-top: 14px; font-size: 12px; color: var(--c-ink-light); text-align: center; }
</style>
