<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">📊 数据统计看板</h2>
      <p class="page-sub">壮族文化数字资源库运营全景概览（演示数据）</p>
    </div>

    <!-- KPI -->
    <div class="kpi-row">
      <div v-for="m in kpis" :key="m.key" class="zhuang-card kpi" @click="toast(`查看「${m.label}」详情（演示）`, 'info')">
        <div class="card-body kpi-body">
          <div class="kpi-icon">{{ m.icon }}</div>
          <div>
            <div class="kpi-value">{{ formatNum(m.value) }}<span class="kpi-unit">{{ m.unit }}</span></div>
            <div class="kpi-label">{{ m.label }}</div>
          </div>
          <span class="kpi-trend">{{ m.trend }}</span>
        </div>
      </div>
    </div>

    <div class="grid dash-grid">
      <!-- 柱状图：月度新增 -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="dash-title">📈 月度素材新增趋势</h3>
          <div class="bar-chart">
            <div v-for="d in monthlyTrend" :key="d.month" class="bar-col">
              <div class="bar-value">{{ d.count }}</div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: barH(d.count) }"></div>
              </div>
              <div class="bar-label">{{ d.month }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 环形图：分类分布 -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="dash-title">🍩 素材分类分布</h3>
          <div class="donut-wrap">
            <div class="donut" :style="{ background: donutGradient }">
              <div class="donut-hole">
                <b>{{ formatNum(totalCount) }}</b>
                <span>件素材</span>
              </div>
            </div>
            <ul class="legend">
              <li v-for="c in categoryDistribution" :key="c.key">
                <span class="legend-dot" :style="{ background: colorMap[c.key] }"></span>
                <span class="legend-name">{{ c.name }}</span>
                <span class="legend-val">{{ c.value }}</span>
                <span class="legend-pct">{{ pct(c.value) }}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 模型状态进度 -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="dash-title">🧊 三维模型处理状态</h3>
          <div class="progress-list">
            <div v-for="s in modelStatus" :key="s.name" class="progress-item">
              <div class="progress-head">
                <span>{{ s.name }}</span>
                <b>{{ s.value }}</b>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: statusPct(s.value), background: s.color }"></div>
              </div>
            </div>
          </div>
          <div class="progress-note">已发布模型占全部三维资产的 {{ publishedPct }}%</div>
        </div>
      </div>

      <!-- 最近动态 -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="dash-title">🕒 最近动态</h3>
          <ul class="activity">
            <li v-for="(a, i) in recentActivities" :key="i">
              <span class="activity-dot" :style="{ background: activityColor(a.type) }"></span>
              <div class="activity-body">
                <p>{{ a.action }}</p>
                <span>{{ a.time }} · {{ a.user }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 资源库成果（应用环节） -->
      <div class="zhuang-card span2">
        <div class="card-body">
          <h3 class="dash-title">📦 资源库成果</h3>
          <div class="lib-count-row">
            <div class="lib-count"><b>{{ library.length }}</b><span>本会话入库</span></div>
            <div class="lib-count"><b>{{ library.filter(i => i.category === 'pattern').length }}</b><span>纹样素材</span></div>
            <div class="lib-count"><b>{{ library.filter(i => i.category === 'architecture').length }}</b><span>建筑数据</span></div>
          </div>
          <ul v-if="library.length" class="activity">
            <li v-for="it in library.slice(0, 5)" :key="it.id">
              <span class="activity-dot" style="background:#c8a254"></span>
              <div class="activity-body">
                <p>{{ it.name }}（{{ libraryCatLabel(it.category) }}）</p>
                <span>{{ it.time }} · {{ it.typeLabel }} · 建模精准度 +50%</span>
              </div>
            </li>
          </ul>
          <p v-else class="progress-note">暂无入库资源，前往「AI智能入库」完成采集→建模→入库</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { metrics, categoryDistribution, monthlyTrend, modelStatus, recentActivities } from '../data/mock.js'
import { library, libraryCatLabel } from '../data/store.js'
import { toast } from '../utils/toast.js'

const kpis = metrics

const colorMap = {
  language: '#382b6b', song: '#865F50', pattern: '#c8a254',
  architecture: '#6a58a8', festival: '#b4533f', craft: '#4f8a5f'
}

const totalCount = categoryDistribution.reduce((s, c) => s + c.value, 0)
const maxCount = Math.max(...monthlyTrend.map((d) => d.count))
const maxStatus = Math.max(...modelStatus.map((s) => s.value))

const donutGradient = computed(() => {
  let acc = 0
  const segs = categoryDistribution.map((c) => {
    const from = (acc / totalCount) * 360
    acc += c.value
    const to = (acc / totalCount) * 360
    return `${colorMap[c.key]} ${from}deg ${to}deg`
  })
  return `conic-gradient(${segs.join(', ')})`
})

const publishedPct = computed(() => {
  const pub = modelStatus.find((s) => s.name === '已发布')
  return pub ? Math.round((pub.value / modelStatus.reduce((a, s) => a + s.value, 0)) * 100) : 0
})

function formatNum(n) { return n.toLocaleString('zh-CN') }
function barH(v) { return Math.round((v / maxCount) * 100) + '%' }
function pct(v) { return Math.round((v / totalCount) * 100) }
function statusPct(v) { return Math.round((v / maxStatus) * 100) + '%' }
function activityColor(t) {
  return { materials: '#382b6b', dna: '#b4533f', ai: '#c8a254', model: '#865F50', ar: '#5a6fae' }[t] || '#6d6584'
}
</script>

<style scoped>
.kpi-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 18px; }
.kpi { cursor: pointer; }
.kpi-body { display: flex; align-items: center; gap: 10px; position: relative; }
.kpi-icon { font-size: 24px; width: 42px; height: 42px; border-radius: 10px; background: rgba(56,43,107,.1); display: flex; align-items: center; justify-content: center; }
.kpi-value { font-size: 20px; font-weight: 800; color: var(--c-primary); line-height: 1; }
.kpi-unit { font-size: 12px; font-weight: 500; color: var(--c-ink-light); }
.kpi-label { font-size: 12px; color: var(--c-ink-light); margin-top: 5px; }
.kpi-trend { position: absolute; top: 6px; right: 10px; font-size: 11px; font-weight: 700; color: var(--c-success); }

.dash-grid { grid-template-columns: 3fr 2fr; }
.span2 { grid-column: 1 / -1; }
.dash-title { font-size: 15px; color: var(--c-title); margin-bottom: 16px; }

/* 柱状图 */
.bar-chart { display: flex; align-items: flex-end; gap: 18px; height: 240px; padding: 10px 6px 0; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
.bar-value { font-size: 12px; color: var(--c-ink-light); }
.bar-track { flex: 1; width: 100%; max-width: 46px; background: rgba(239,216,185,.35); border-radius: 8px 8px 0 0; display: flex; align-items: flex-end; overflow: hidden; }
.bar-fill {
  width: 100%; border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, var(--c-primary-light), var(--c-brown));
  transition: height .6s ease;
}
.bar-label { font-size: 12px; color: var(--c-ink-light); }

/* 环形图 */
.donut-wrap { display: flex; align-items: center; gap: 22px; }
.donut { width: 150px; height: 150px; border-radius: 50%; flex: 0 0 150px; display: flex; align-items: center; justify-content: center; }
.donut-hole {
  width: 92px; height: 92px; border-radius: 50%; background: #fffdf8;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.donut-hole b { font-size: 20px; color: var(--c-primary); }
.donut-hole span { font-size: 11px; color: var(--c-ink-light); }
.legend { list-style: none; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.legend li { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex: 0 0 10px; }
.legend-name { flex: 1; color: var(--c-ink); }
.legend-val { color: var(--c-ink-light); }
.legend-pct { width: 40px; text-align: right; color: var(--c-primary); font-weight: 600; }

/* 进度条 */
.progress-list { display: flex; flex-direction: column; gap: 18px; }
.progress-head { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 7px; }
.progress-head span { color: var(--c-ink); }
.progress-head b { color: var(--c-primary); }
.progress-track { height: 10px; background: rgba(239,216,185,.4); border-radius: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 6px; transition: width .6s ease; }
.progress-note { margin-top: 18px; font-size: 12px; color: var(--c-ink-light); text-align: center; }

/* 动态 */
.activity { list-style: none; }
.activity li { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #efe3cd; }
.activity li:last-child { border-bottom: none; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 5px; flex: 0 0 10px; }
.activity-body p { font-size: 13px; color: var(--c-ink); }
.activity-body span { font-size: 12px; color: var(--c-ink-light); }

.lib-count-row { display: flex; gap: 12px; margin-bottom: 16px; }
.lib-count { flex: 1; background: rgba(56,43,107,.05); border-radius: 10px; padding: 12px; text-align: center; }
.lib-count b { font-size: 22px; color: var(--c-brown-dark); display: block; }
.lib-count span { font-size: 12px; color: var(--c-ink-light); }

@media (max-width: 1200px) {
  .kpi-row { grid-template-columns: repeat(3, 1fr); }
  .dash-grid { grid-template-columns: 1fr; }
}
</style>
