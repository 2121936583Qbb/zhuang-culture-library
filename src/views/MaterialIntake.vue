<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">📥 文化素材入库</h2>
      <p class="page-sub">采集壮族文化原始素材，AI 自动完成语义标注与特征分析（演示）</p>
    </div>

    <!-- 入库表单 -->
    <div class="zhuang-card">
      <div class="card-body">
        <h3 class="form-title">新增素材登记</h3>
        <div class="form-grid">
          <div class="field">
            <label>素材名称 *</label>
            <input v-model="form.name" class="input" placeholder="例如：壮锦·八角花纹样样布" />
          </div>
          <div class="field">
            <label>文化分类 *</label>
            <select v-model="form.category" class="select">
              <option v-for="c in categories" :key="c.key" :value="c.key">{{ c.icon }} {{ c.label }}</option>
            </select>
          </div>
          <div class="field">
            <label>素材类型</label>
            <select v-model="form.type" class="select">
              <option>图像</option><option>音频</option><option>视频</option><option>文本</option><option>三维扫描</option>
            </select>
          </div>
          <div class="field">
            <label>采集地点</label>
            <input v-model="form.location" class="input" placeholder="例如：广西·靖西" />
          </div>
          <div class="field">
            <label>文件大小</label>
            <input v-model="form.size" class="input" placeholder="选文件后自动填写" />
          </div>
          <div class="field">
            <label>采集人</label>
            <input v-model="form.author" class="input" placeholder="姓名" />
          </div>
          <div class="field full">
            <label>素材描述</label>
            <textarea v-model="form.desc" class="textarea" placeholder="简要描述素材内容、文化背景等"></textarea>
          </div>
          <div class="field full">
            <label>素材文件（可真实选择本地图片/音频/视频，仅本地预览）</label>
            <div class="upload-box">
              <input ref="fileInput" type="file" class="hidden-input" accept="image/*,audio/*,video/*" multiple @change="onFileChange" />
              <button type="button" class="btn btn-outline" @click="fileInput.click()">📎 选择文件</button>
              <span class="muted">支持多选；图片会显示缩略图预览</span>
            </div>
            <div v-if="files.length" class="file-list">
              <div v-for="(f, i) in files" :key="i" class="file-chip">
                <img v-if="f.preview" :src="f.preview" class="file-thumb" alt="" />
                <span v-else class="file-ico">{{ f.icon }}</span>
                <div class="file-info">
                  <div class="file-name">{{ f.name }}</div>
                  <div class="file-size">{{ f.sizeText }}</div>
                </div>
                <button class="file-del" @click="removeFile(i)" title="移除">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-brown" @click="mockAnalyze">🧠 AI 智能分析</button>
          <button class="btn btn-primary" @click="submit">✅ 提交入库</button>
        </div>
      </div>
    </div>

    <!-- 素材列表 -->
    <div class="toolbar">
      <input v-model="keyword" class="input search" placeholder="🔍 搜索素材名称 / 编号 / 采集人" />
      <select v-model="filterCat" class="select cat-select">
        <option value="">全部分类</option>
        <option v-for="c in categories" :key="c.key" :value="c.key">{{ c.icon }} {{ c.label }}</option>
      </select>
      <span class="muted count">共 {{ filtered.length }} 条记录</span>
    </div>

    <div class="zhuang-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th><th>素材名称</th><th>分类</th><th>类型</th><th>大小</th><th>采集人</th><th>AI 评分</th><th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in filtered" :key="m.id" @click="openDetail(m)">
              <td class="mono muted">{{ m.id }}</td>
              <td>
                <div class="name-cell">
                  <img v-if="m.cover" :src="m.cover" class="row-thumb" alt="" />
                  <b>{{ m.name }}</b>
                </div>
              </td>
              <td>{{ catIcon(m.category) }} {{ catLabel(m.category) }}</td>
              <td>{{ m.type }}</td>
              <td class="muted">{{ m.size }}</td>
              <td>{{ m.author }}</td>
              <td><span class="score">{{ m.aiScore }}</span></td>
              <td><span class="badge" :class="statusClass(m.status)">{{ m.status }}</span></td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="8" class="empty">没有匹配的素材记录</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <Modal v-model="detail.show" :title="detail.data?.name || '素材详情'" width="620px">
      <div v-if="detail.data" class="detail">
        <div v-if="detail.data.cover" class="detail-cover">
          <img :src="detail.data.cover" alt="素材预览" />
        </div>
        <div class="detail-row"><span>编号</span><b class="mono">{{ detail.data.id }}</b></div>
        <div class="detail-row"><span>分类</span><b>{{ catIcon(detail.data.category) }} {{ catLabel(detail.data.category) }}</b></div>
        <div class="detail-row"><span>类型 / 大小</span><b>{{ detail.data.type }} · {{ detail.data.size }}</b></div>
        <div class="detail-row"><span>采集人</span><b>{{ detail.data.author }}</b></div>
        <div class="detail-row"><span>采集地点</span><b>{{ detail.data.location }}</b></div>
        <div class="detail-row"><span>入库时间</span><b>{{ detail.data.time }}</b></div>
        <div class="detail-row"><span>标签</span>
          <span class="tag-list"><span v-for="t in detail.data.tags" :key="t" class="badge badge-primary">{{ t }}</span></span>
        </div>
        <div class="ai-panel">
          <div class="ai-panel-head">🧠 AI 语义分析结果 <span class="badge badge-success">已完成</span></div>
          <p>{{ aiResultText }}</p>
          <div class="ai-score"><span>文化特征匹配度</span><b>{{ detail.data.aiScore }}%</b></div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="detail.show = false">关闭</button>
        <button class="btn btn-primary" @click="toast('已生成素材归档（演示）', 'success')">📦 生成归档</button>
      </template>
    </Modal>

    <!-- AI 分析弹窗 -->
    <Modal v-model="analyze.show" title="AI 智能分析" width="560px">
      <div class="analyze-body">
        <div class="analyze-anim">🧠</div>
        <p class="analyze-text">{{ analyze.text }}</p>
        <div class="analyze-tags">
          <span v-for="t in analyze.tags" :key="t" class="badge badge-primary">{{ t }}</span>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="analyze.show = false">知道了</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { categories, catLabel, catIcon, materials } from '../data/mock.js'

const list = ref(materials.map((m) => ({ ...m, tags: [...m.tags] })))

const form = reactive({ name: '', category: 'pattern', type: '图像', location: '', size: '', author: '', desc: '' })
const keyword = ref('')
const filterCat = ref('')

const fileInput = ref(null)
const files = ref([])

const detail = reactive({ show: false, data: null })
const analyze = reactive({ show: false, text: '', tags: [] })

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return list.value.filter((m) => {
    const hitCat = !filterCat.value || m.category === filterCat.value
    const hitKw = !kw || m.name.toLowerCase().includes(kw) || m.id.toLowerCase().includes(kw) || m.author.includes(kw)
    return hitCat && hitKw
  })
})

const aiResultText = computed(() => {
  if (!detail.data) return ''
  const d = detail.data
  return `已识别「${catLabel(d.category)}」类素材，自动提取 ${d.tags.length} 个文化特征标签，完成色彩谱系与结构语义标注。建议归入「${catLabel(d.category)}」知识图谱节点。`
})

function statusClass(s) {
  return { '已入库': 'badge-success', '待分析': 'badge-warning', '分析中': 'badge-info' }[s] || 'badge-neutral'
}

function nowStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function iconFor(f) {
  const t = (f.type || '').toLowerCase()
  if (t.startsWith('image/')) return '🖼️'
  if (t.startsWith('audio/')) return '🎵'
  if (t.startsWith('video/')) return '🎬'
  return '📄'
}

function onFileChange(e) {
  const picked = Array.from(e.target.files || [])
  if (!picked.length) return
  picked.forEach((f) => {
    const item = { name: f.name, size: f.size, sizeText: formatSize(f.size), type: f.type, preview: null, icon: iconFor(f) }
    files.value.push(item)
    if ((f.type || '').startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => { item.preview = reader.result }
      reader.readAsDataURL(f)
    }
  })
  if (!form.size) form.size = files.value.map((f) => f.sizeText).join('、')
  const t = (files.value[0] && files.value[0].type) || ''
  if (t.startsWith('image/')) form.type = '图像'
  else if (t.startsWith('audio/')) form.type = '音频'
  else if (t.startsWith('video/')) form.type = '视频'
  toast(`已选择 ${picked.length} 个文件（本地预览，不入库到服务器）`, 'success')
  e.target.value = ''
}

function removeFile(i) {
  files.value.splice(i, 1)
}

function mockAnalyze() {
  const cat = catLabel(form.category)
  analyze.text = `正在对「${form.name || '未命名素材'}」进行 ${cat} 领域 AI 分析：完成语义理解、纹样/语音/结构特征提取与元数据自动标注（模拟）。`
  analyze.tags = ['文化特征提取', '色彩谱系分析', '语义标注', '知识图谱映射']
  analyze.show = true
}

function submit() {
  if (!form.name) return toast('请填写素材名称', 'warning')
  const cat = catLabel(form.category)
  const id = 'M-' + (1100 + list.value.length)
  list.value.unshift({
    id,
    name: form.name,
    category: form.category,
    type: form.type,
    size: form.size || '--',
    author: form.author || '系统录入',
    location: form.location || '广西',
    time: nowStr(),
    status: '已入库',
    aiScore: 85 + Math.floor(Math.random() * 14),
    tags: [cat, '新入库'],
    cover: files.value.find((f) => f.preview)?.preview || null
  })
  toast(`素材「${form.name}」已入库，编号 ${id}`, 'success')
  form.name = ''; form.desc = ''; form.location = ''; form.size = ''; form.author = ''
  files.value = []
}

function openDetail(m) {
  detail.data = m
  detail.show = true
}
</script>

<style scoped>
.form-title { font-size: 16px; color: var(--c-title); margin-bottom: 16px; }
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 16px; }
.form-grid .full { grid-column: 1 / -1; }
.form-actions { display: flex; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
.search { width: 300px; }
.cat-select { width: 180px; }
.count { font-size: 13px; }
.table-wrap { overflow-x: auto; }
.score { color: var(--c-gold); font-weight: 700; }
.empty { text-align: center; color: var(--c-ink-light); padding: 30px 0 !important; }

/* 文件上传 */
.hidden-input { display: none; }
.upload-box { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.file-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
.file-chip {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid var(--c-border); border-radius: 10px; padding: 8px 10px;
}
.file-thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1px solid var(--c-border); }
.file-ico {
  width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  font-size: 22px; background: rgba(56,43,107,.06); border-radius: 8px;
}
.file-info { display: flex; flex-direction: column; gap: 2px; max-width: 200px; }
.file-name { font-size: 13px; color: var(--c-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-size { font-size: 12px; color: var(--c-ink-light); }
.file-del {
  width: 22px; height: 22px; border-radius: 6px; flex: 0 0 22px;
  background: rgba(180,83,63,.1); color: var(--c-danger); font-size: 12px;
}
.file-del:hover { background: rgba(180,83,63,.2); }

.name-cell { display: flex; align-items: center; gap: 8px; }
.row-thumb { width: 30px; height: 30px; object-fit: cover; border-radius: 6px; border: 1px solid var(--c-border); flex: 0 0 30px; }
.detail-cover { margin-bottom: 14px; border-radius: 10px; overflow: hidden; border: 1px solid var(--c-border); }
.detail-cover img { display: block; width: 100%; max-height: 260px; object-fit: cover; }

.detail-row { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px dashed #eee2cc; font-size: 14px; }
.detail-row span { width: 90px; color: var(--c-ink-light); flex: 0 0 90px; }
.detail-row b { font-weight: 600; }
.tag-list { display: flex; gap: 6px; flex-wrap: wrap; }
.ai-panel { margin-top: 14px; background: rgba(56,43,107,.05); border: 1px solid #e4d6fb; border-radius: 10px; padding: 14px; }
.ai-panel-head { font-size: 14px; font-weight: 700; color: var(--c-primary); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.ai-panel p { font-size: 13px; color: var(--c-ink); line-height: 1.7; }
.ai-score { display: flex; justify-content: space-between; margin-top: 10px; font-size: 13px; color: var(--c-ink-light); }
.ai-score b { color: var(--c-gold); font-size: 18px; }

.analyze-body { text-align: center; }
.analyze-anim { font-size: 56px; animation: ar-float 2s ease-in-out infinite; }
.analyze-text { font-size: 14px; color: var(--c-ink); line-height: 1.8; margin: 16px 0; text-align: left; }
.analyze-tags { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
</style>
