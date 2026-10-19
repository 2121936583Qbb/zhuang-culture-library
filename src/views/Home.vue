<template>
  <div class="page home">
    <!-- ===== 海报主视觉 ===== -->
    <section class="hero zhuang-pattern">
      <div class="hero-inner">
        <div class="hero-badge">
          <span class="zhuang-diamond"></span>{{ techTag }}
        </div>
        <div class="hero-kicker">技术独特性</div>
        <h1 class="hero-title">AI驱动的壮族文化数字资源库</h1>
        <p class="hero-slogan">{{ slogan }}</p>

        <div class="hero-features">
          <div v-for="f in heroFeatures" :key="f.title" class="hero-feature">
            <span class="hf-icon">{{ f.icon }}</span>
            <div class="hf-text">
              <b>{{ f.title }}</b>
              <span>{{ f.desc }}</span>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn btn-gold" @click="go('/material')">🛰️ 立即体验入库</button>
          <button class="btn btn-ghost hero-ghost" @click="go('/stats')">📊 查看数据看板</button>
        </div>
      </div>
    </section>

    <!-- ===== 技术流程 ===== -->
    <section class="zhuang-card flow-card">
      <div class="card-body">
        <h2 class="section-title"><span class="zhuang-diamond"></span>核心技术流程</h2>
        <p class="section-sub">从田野采集到数字应用的一体化 AI 流水线</p>
        <div class="flow">
          <template v-for="(w, i) in workflow" :key="w.step">
            <div class="flow-node" @click="toast(`「${w.title}」：${w.desc}`, 'info')">
              <div class="flow-icon">{{ w.icon }}</div>
              <div class="flow-step">{{ w.step }}</div>
              <div class="flow-title">{{ w.title }}</div>
              <div class="flow-desc">{{ w.desc }}</div>
            </div>
            <div v-if="i < workflow.length - 1" class="flow-arrow">→</div>
          </template>
        </div>
      </div>
    </section>

    <!-- ===== 项目指标 ===== -->
    <section class="metrics">
      <div v-for="m in posterMetrics" :key="m.key" class="zhuang-card metric" @click="toast(`「${m.label}」为项目核心指标（演示）`, 'info')">
        <div class="card-body metric-body">
          <div class="metric-icon">{{ m.icon }}</div>
          <div class="metric-value">{{ m.value }}<span class="metric-unit">{{ m.unit }}</span></div>
          <div class="metric-label">{{ m.label }}</div>
        </div>
      </div>
    </section>

    <div class="divider-dots">◆ ◆ ◆ ◆ ◆</div>
    <p class="home-foot">本项目为本地离线演示系统 · 所有数据均为 Mock 模拟 · 无需联网 · 无需后端</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { toast } from '../utils/toast.js'
import { techTag, slogan, heroFeatures, workflow, posterMetrics } from '../data/mock.js'

const router = useRouter()
function go(path) { router.push(path) }
function formatNum(n) { return n.toLocaleString('zh-CN') }
</script>

<style scoped>
.home { padding-bottom: 40px; }

/* 海报主视觉 */
.hero {
  border-radius: 18px; overflow: hidden; position: relative;
  background: linear-gradient(135deg, #382b6b 0%, #4d3b8a 42%, #865F50 100%);
  box-shadow: var(--shadow-lg); margin-bottom: 20px;
}
.zhuang-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23EFD8B9' stroke-opacity='0.14' stroke-width='1.4'%3E%3Crect x='14' y='14' width='20' height='20' transform='rotate(45 24 24)'/%3E%3Crect x='21' y='21' width='6' height='6' transform='rotate(45 24 24)'/%3E%3Ccircle cx='24' cy='24' r='2'/%3E%3C/g%3E%3C/svg%3E");
}
.hero-inner { padding: 44px 48px; position: relative; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--c-beige);
  background: rgba(0,0,0,.22); padding: 7px 16px; border-radius: 30px;
  margin-bottom: 20px;
}
.hero-kicker {
  font-size: 15px; font-weight: 700; letter-spacing: 8px; color: var(--c-gold); margin-bottom: 8px;
}
.hero-title {
  font-size: 40px; font-weight: 800; color: #fff; line-height: 1.2;
  letter-spacing: 2px; margin-bottom: 12px;
  text-shadow: 0 2px 12px rgba(0,0,0,.3);
}
.hero-slogan {
  font-size: 18px; color: rgba(239,216,185,.9); margin-bottom: 30px; letter-spacing: 3px;
}
.hero-features {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 30px;
}
.hero-feature {
  background: rgba(255,255,255,.1); border: 1px solid rgba(239,216,185,.25);
  border-radius: 12px; padding: 16px; display: flex; gap: 12px; align-items: flex-start;
  backdrop-filter: blur(4px);
}
.hf-icon { font-size: 26px; }
.hf-text { display: flex; flex-direction: column; gap: 4px; }
.hf-text b { color: #fff; font-size: 15px; }
.hf-text span { color: rgba(239,216,185,.8); font-size: 12px; line-height: 1.5; }
.hero-actions { display: flex; gap: 14px; }
.hero-ghost { color: #fff; border: 1px solid rgba(239,216,185,.5); }
.hero-ghost:hover { background: rgba(255,255,255,.1); }

/* 流程 */
.flow-card { margin-bottom: 20px; }
.section-title { font-size: 18px; color: var(--c-primary); display: flex; align-items: center; margin-bottom: 6px; }
.section-sub { font-size: 13px; color: var(--c-ink-light); margin-bottom: 20px; }
.flow { display: flex; align-items: stretch; }
.flow-node {
  flex: 1; text-align: center; padding: 18px 10px 16px; border-radius: 12px;
  background: #fffdf8; border: 1px solid var(--c-border); cursor: pointer;
  transition: all .18s; position: relative;
}
.flow-node:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--c-gold); }
.flow-icon { font-size: 30px; margin-bottom: 8px; }
.flow-step { font-size: 11px; color: var(--c-gold); font-weight: 700; letter-spacing: 2px; }
.flow-title { font-size: 16px; font-weight: 700; color: var(--c-primary); margin: 4px 0; }
.flow-desc { font-size: 12px; color: var(--c-ink-light); line-height: 1.5; }
.flow-arrow { align-self: center; font-size: 22px; color: var(--c-brown); padding: 0 8px; flex: 0 0 auto; }

/* 指标 */
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
.metric { cursor: pointer; transition: all .18s; }
.metric:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.metric-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.metric-icon {
  width: 56px; height: 56px; border-radius: 50%; font-size: 26px;
  background: linear-gradient(135deg, rgba(56,43,107,.14), rgba(134,95,80,.14));
  display: flex; align-items: center; justify-content: center;
}
.metric-value { font-size: 30px; font-weight: 800; color: var(--c-primary); line-height: 1; }
.metric-unit { font-size: 14px; font-weight: 500; color: var(--c-brown); margin-left: 3px; }
.metric-label { font-size: 13px; color: var(--c-ink-light); line-height: 1.4; }

.home-foot { text-align: center; font-size: 12px; color: var(--c-ink-light); margin-top: 10px; }

@media (max-width: 1100px) {
  .hero-features { grid-template-columns: repeat(2, 1fr); }
  .metrics { grid-template-columns: repeat(2, 1fr); }
  .flow { flex-wrap: wrap; }
  .flow-arrow { display: none; }
  .flow-node { flex: 1 1 30%; margin: 4px; }
}
</style>
