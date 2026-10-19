<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🧊 三维模型管理</h2>
      <p class="page-sub">壮族文化遗存的三维数字化重建与模型资产管理（演示）</p>
    </div>

    <div class="toolbar">
      <button
        v-for="c in [{key:'',label:'全部'}, ...categories]"
        :key="c.key"
        class="chip"
        :class="{ active: filterCat === c.key }"
        @click="filterCat = c.key"
      >{{ c.icon }} {{ c.label }}</button>
      <div class="spacer"></div>
      <span class="muted">共 {{ filtered.length }} 个模型</span>
    </div>

    <div class="grid model-grid">
      <div v-for="m in filtered" :key="m.id" class="zhuang-card model-card" @click="open(m)">
        <div class="model-preview" :style="{ background: `linear-gradient(135deg, ${m.color[0]}, ${m.color[1]})` }">
          <span class="model-preview-icon">{{ catIcon(m.category) }}</span>
          <span class="badge model-status" :class="m.status === '已发布' ? 'badge-success' : 'badge-warning'">{{ m.status }}</span>
        </div>
        <div class="card-body">
          <h3 class="model-name">{{ m.name }}</h3>
          <div class="model-meta">
            <span>{{ catLabel(m.category) }}</span>
            <span class="dot">·</span>
            <span>{{ m.format }}</span>
          </div>
          <div class="model-stats">
            <div><label>三角面</label><b>{{ m.faces }}</b></div>
            <div><label>大小</label><b>{{ m.size }}</b></div>
            <div><label>质量</label><b class="q">{{ m.quality }}%</b></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型查看弹窗 -->
    <Modal v-model="view.show" :title="view.data?.name || '三维模型预览'" width="620px">
      <div v-if="view.data" class="viewer">
        <div class="scene">
          <div class="cube" :class="{ paused: paused }">
            <div class="cube-face" v-for="f in 6" :key="f"><span>{{ catIcon(view.data.category) }}</span></div>
          </div>
        </div>
        <p class="viewer-tip">🖱️ 拖动查看 · 滚轮缩放（模拟 3D 交互）</p>
        <div class="viewer-meta">
          <div><label>格式</label><b>{{ view.data.format }}</b></div>
          <div><label>三角面</label><b>{{ view.data.faces }}</b></div>
          <div><label>大小</label><b>{{ view.data.size }}</b></div>
          <div><label>重建质量</label><b class="q">{{ view.data.quality }}%</b></div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="paused = !paused">{{ paused ? '▶ 继续旋转' : '⏸ 暂停旋转' }}</button>
        <button class="btn btn-primary" @click="toast('模型操作成功（模拟）', 'success')">🔄 旋转视角</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { categories, catLabel, catIcon, models3d } from '../data/mock.js'

const filterCat = ref('')
const view = reactive({ show: false, data: null })
const paused = ref(false)

const filtered = computed(() =>
  filterCat.value ? models3d.filter((m) => m.category === filterCat.value) : models3d
)

function open(m) {
  view.data = m
  paused.value = false
  view.show = true
}
</script>

<style scoped>
.chip {
  padding: 7px 15px; border-radius: 20px; font-size: 13px;
  background: #fffdf8; border: 1px solid var(--c-border); color: var(--c-ink-light);
  transition: all .16s;
}
.chip:hover { border-color: var(--c-gold); color: var(--c-primary); }
.chip.active { background: var(--c-primary); color: #fff; border-color: var(--c-primary); }
.model-grid { grid-template-columns: repeat(3, 1fr); }
.model-card { cursor: pointer; transition: all .18s; }
.model-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.model-preview {
  height: 130px; position: relative; display: flex; align-items: center; justify-content: center;
}
.model-preview-icon { font-size: 52px; filter: drop-shadow(0 4px 8px rgba(0,0,0,.3)); }
.model-status { position: absolute; top: 12px; right: 12px; }
.model-name { font-size: 16px; color: var(--c-primary); margin-bottom: 6px; }
.model-meta { font-size: 13px; color: var(--c-ink-light); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.model-meta .dot { color: var(--c-beige-dark); }
.model-stats { display: flex; gap: 18px; }
.model-stats div { display: flex; flex-direction: column; gap: 3px; }
.model-stats label { font-size: 11px; color: var(--c-ink-light); }
.model-stats b { font-size: 13px; color: var(--c-ink); }
.model-stats .q { color: var(--c-success); }

.viewer { text-align: center; }
.cube.paused { animation-play-state: paused; }
.viewer-tip { font-size: 12px; color: var(--c-ink-light); margin: 8px 0 16px; }
.viewer-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.viewer-meta div { background: rgba(56,43,107,.05); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.viewer-meta label { font-size: 12px; color: var(--c-ink-light); }
.viewer-meta b { font-size: 15px; color: var(--c-primary); }
.viewer-meta .q { color: var(--c-success); }
</style>
