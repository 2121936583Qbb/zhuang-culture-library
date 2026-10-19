<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🧬 文化DNA证书</h2>
      <p class="page-sub">对壮族文化基因进行数字化提取与区块链存证（演示）</p>
    </div>

    <div class="toolbar">
      <span class="badge badge-primary">🧬 基因提取算法 v3.2</span>
      <span class="badge badge-success">⛓️ 链上存证正常</span>
      <div class="spacer"></div>
      <button class="btn btn-primary btn-sm" @click="toast('发起新基因提取任务（模拟）', 'info')">➕ 新建基因提取</button>
    </div>

    <div class="grid cert-grid">
      <div v-for="c in dnaCertificates" :key="c.id" class="zhuang-card cert-card" @click="open(c)">
        <div class="cert-top">
          <div class="cert-icon">{{ catIcon(c.category) }}</div>
          <div class="cert-title">
            <h3>{{ c.name }}</h3>
            <span class="mono muted">{{ c.id }}</span>
          </div>
        </div>
        <div class="cert-genes">
          <span v-for="g in c.gene" :key="g" class="gene">{{ g }}</span>
        </div>
        <div class="cert-bottom">
          <div class="hash mono">0x{{ short(c.hash) }}</div>
          <span class="badge" :class="c.status === '已存证' ? 'badge-success' : 'badge-warning'">{{ c.status }}</span>
        </div>
        <div class="seal">{{ c.category === 'pattern' ? '锦' : c.category === 'song' ? '歌' : c.category === 'architecture' ? '筑' : c.category === 'language' ? '语' : '匠' }}</div>
      </div>
    </div>

    <!-- 证书详情弹窗 -->
    <Modal v-model="view.show" :title="view.data?.name || '文化DNA证书'" width="600px">
      <div v-if="view.data" class="cert-detail">
        <div class="cert-detail-head">
          <div class="big-seal">壮族文化DNA<br />数字存证</div>
          <div class="cert-detail-info">
            <h3>{{ view.data.name }}</h3>
            <p class="mono muted">{{ view.data.id }}</p>
            <p class="issuer">签发机构：{{ view.data.issuer }}</p>
          </div>
        </div>
        <div class="gene-block">
          <label>文化基因特征</label>
          <div class="gene-list"><span v-for="g in view.data.gene" :key="g" class="badge badge-primary">{{ g }}</span></div>
        </div>
        <div class="kv-grid">
          <div class="kv"><span>存证哈希</span><b class="mono">{{ view.data.hash }}</b></div>
          <div class="kv"><span>区块高度</span><b class="mono">#{{ view.data.block }}</b></div>
          <div class="kv"><span>存证时间</span><b>{{ view.data.time }}</b></div>
          <div class="kv"><span>存证状态</span><b class="ok">{{ view.data.status }}</b></div>
        </div>
        <div class="verify-note">⛓️ 存证信息已写入联盟链节点（模拟），证书不可篡改、全程可溯源</div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="view.show = false">关闭</button>
        <button class="btn btn-primary" @click="verify">🔍 链上验证证书</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { catIcon, dnaCertificates } from '../data/mock.js'

const view = reactive({ show: false, data: null })

function open(c) { view.data = c; view.show = true }
function short(h) { return h.replace('0x', '').slice(0, 14) }
function verify() {
  if (!view.data) return
  toast(`证书 ${view.data.id} 链上验证通过 · 与存证哈希一致（模拟）`, 'success')
}
</script>

<style scoped>
.cert-grid { grid-template-columns: repeat(3, 1fr); }
.cert-card { cursor: pointer; position: relative; transition: all .18s; }
.cert-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.cert-top { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
.cert-icon {
  width: 46px; height: 46px; border-radius: 12px; font-size: 24px;
  background: linear-gradient(135deg, rgba(56,43,107,.14), rgba(134,95,80,.14));
  display: flex; align-items: center; justify-content: center;
}
.cert-title h3 { font-size: 15px; color: var(--c-primary); margin-bottom: 3px; }
.cert-title span { font-size: 12px; color: var(--c-ink-light); }
.cert-genes { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.gene { font-size: 12px; padding: 3px 9px; border-radius: 6px; background: rgba(239,216,185,.5); color: var(--c-brown-dark); }
.cert-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #e6d6b8; padding-top: 12px; }
.hash { font-size: 12px; color: var(--c-ink-light); }
.seal {
  position: absolute; right: 16px; bottom: 48px; width: 46px; height: 46px;
  border-radius: 50%; background: var(--c-danger); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; border: 2px solid rgba(255,255,255,.6);
  box-shadow: 0 2px 8px rgba(180,83,63,.4); opacity: .9;
}

.cert-detail-head { display: flex; gap: 18px; align-items: center; margin-bottom: 18px; }
.big-seal {
  width: 110px; height: 110px; border-radius: 50%; flex: 0 0 110px;
  background: var(--c-danger); color: #fff; text-align: center;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; line-height: 1.5; font-weight: 700;
  border: 3px double rgba(255,255,255,.7); box-shadow: 0 4px 16px rgba(180,83,63,.4);
}
.cert-detail-info h3 { font-size: 18px; color: var(--c-primary); margin-bottom: 4px; }
.cert-detail-info p { font-size: 13px; color: var(--c-ink-light); margin-bottom: 4px; }
.cert-detail-info .issuer { color: var(--c-brown); }
.gene-block { margin-bottom: 16px; }
.gene-block label { display: block; font-size: 13px; color: var(--c-ink-light); margin-bottom: 8px; font-weight: 600; }
.gene-list { display: flex; flex-wrap: wrap; gap: 8px; }
.kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.kv { background: rgba(56,43,107,.05); border-radius: 10px; padding: 12px; }
.kv span { display: block; font-size: 12px; color: var(--c-ink-light); margin-bottom: 5px; }
.kv b { font-size: 13px; color: var(--c-primary); word-break: break-all; }
.kv .ok { color: var(--c-success); }
.verify-note { font-size: 12px; color: var(--c-ink-light); background: rgba(79,138,95,.08); border-radius: 8px; padding: 10px 12px; }
</style>
