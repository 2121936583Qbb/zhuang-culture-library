// ============================================================
// 全部 Mock 模拟数据（本地离线演示，无后端、无真实 AI/3D/区块链）
// ============================================================

export const projectName = 'AI驱动的壮族文化数字资源库'
export const slogan = '让千年壮乡文化在数字世界焕发生机'
export const techTag = 'AI · 三维建模 · 区块链存证 · AR/VR 应用'

// 首页四大文化门类
export const heroFeatures = [
  { icon: '🔤', title: '壮族语言', desc: '壮文语料采集与语音标注，AI 识别方言音系变体' },
  { icon: '🎵', title: '壮乡山歌', desc: '山歌音频采集、曲谱数字化与旋律特征分析' },
  { icon: '🧵', title: '服饰纹样', desc: '壮锦纹样矢量提取、色彩谱系与文化语义建模' },
  { icon: '🏯', title: '建筑形制', desc: '干栏式建筑三维扫描、结构解析与形制复原' }
]

// 技术流程：采集 → 分析 → 建模 → 入库 → 应用
export const workflow = [
  { step: '01', icon: '📷', title: '采集', desc: '田野调查、高清扫描、音视频图像采集' },
  { step: '02', icon: '🧠', title: '分析', desc: 'AI 语义理解、纹样识别、语音转写、特征提取' },
  { step: '03', icon: '🧊', title: '建模', desc: '三维重建、知识图谱、文化 DNA 数字化建模' },
  { step: '04', icon: '🗄️', title: '入库', desc: '结构化存储、元数据标注、版本管理溯源' },
  { step: '05', icon: '🚀', title: '应用', desc: 'AR/VR 教学、文创授权、数字展陈传播' }
]

// 首页项目指标
export const metrics = [
  { key: 'materials', label: '文化素材', value: 12846, unit: '件', icon: '📦', trend: '+12.4%' },
  { key: 'models', label: '三维模型', value: 328, unit: '个', icon: '🧊', trend: '+8.1%' },
  { key: 'dna', label: '文化DNA证书', value: 1204, unit: '份', icon: '🧬', trend: '+15.7%' },
  { key: 'ar', label: 'AR教学资源', value: 96, unit: '个', icon: '🥽', trend: '+6.9%' },
  { key: 'vr', label: 'VR游戏资源', value: 24, unit: '个', icon: '🎮', trend: '+4.2%' },
  { key: 'users', label: '累计访问', value: 68520, unit: '次', icon: '👥', trend: '+21.3%' }
]

// 首页海报项目指标（复刻海报原文）
export const posterMetrics = [
  { key: 'national', label: '国家级非遗代表性项目', value: 1, unit: '个', icon: '🏛️' },
  { key: 'youth', label: '青年传承人增长', value: 72, unit: '%', icon: '🌱' },
  { key: 'aging', label: '老龄化危机缓解', value: 68, unit: '%', icon: '🧓' },
  { key: 'engage', label: '互动参与度提升', value: 40, unit: '%', icon: '🤝' },
  { key: 'precision', label: '数字化建模提取精准度提升', value: 50, unit: '%', icon: '🎯' }
]

// 素材分类
export const categories = [
  { key: 'language', label: '壮族语言', icon: '🔤' },
  { key: 'song', label: '壮乡山歌', icon: '🎵' },
  { key: 'pattern', label: '服饰纹样', icon: '🧵' },
  { key: 'architecture', label: '建筑形制', icon: '🏯' },
  { key: 'festival', label: '节庆习俗', icon: '🎉' },
  { key: 'craft', label: '传统技艺', icon: '🛠️' }
]

export function catLabel(key) {
  return categories.find((c) => c.key === key)?.label || key
}
export function catIcon(key) {
  return categories.find((c) => c.key === key)?.icon || '📁'
}

// 文化素材
export const materials = [
  { id: 'M-1001', name: '壮锦·万字纹样样布', category: 'pattern', type: '图像', size: '24.6 MB', author: '李桂芳', location: '广西·靖西', time: '2025-06-18 10:32', status: '已入库', aiScore: 96, tags: ['壮锦', '万字纹', '织锦'] },
  { id: 'M-1002', name: '壮族情歌《壮乡三月好风光》录音', category: 'song', type: '音频', size: '58.2 MB', author: '韦金花', location: '广西·宜州', time: '2025-06-17 15:08', status: '已入库', aiScore: 92, tags: ['山歌', '情歌', '田野录音'] },
  { id: 'M-1003', name: '干栏式民居·梁架结构影像', category: 'architecture', type: '视频', size: '312 MB', author: '黄文标', location: '广西·龙胜', time: '2025-06-16 09:45', status: '已入库', aiScore: 89, tags: ['干栏式', '木构', '影像'] },
  { id: 'M-1004', name: '壮语标准音·问候语发音样本', category: 'language', type: '音频', size: '12.4 MB', author: '覃丽英', location: '广西·武鸣', time: '2025-06-15 14:20', status: '待分析', aiScore: 94, tags: ['壮语', '标准音', '语料'] },
  { id: 'M-1005', name: '铜鼓纹饰·太阳纹拓片', category: 'craft', type: '图像', size: '18.9 MB', author: '农建华', location: '广西·东兰', time: '2025-06-14 11:03', status: '已入库', aiScore: 91, tags: ['铜鼓', '太阳纹', '拓片'] },
  { id: 'M-1006', name: '三月三歌圩·对歌场景航拍', category: 'festival', type: '视频', size: '428 MB', author: '蒙瑞芳', location: '广西·田阳', time: '2025-06-13 16:37', status: '分析中', aiScore: 87, tags: ['三月三', '歌圩', '航拍'] }
]

// 三维模型
export const models3d = [
  { id: '3D-001', name: '干栏式民居（龙胜型）', category: 'architecture', format: '.glb', faces: '128,000', size: '46.8 MB', status: '已发布', quality: 98, color: ['#382b6b', '#865F50'] },
  { id: '3D-002', name: '壮族铜鼓（太阳纹）', category: 'craft', format: '.obj', faces: '86,000', size: '32.1 MB', status: '已发布', quality: 96, color: ['#865F50', '#c8a254'] },
  { id: '3D-003', name: '壮锦织机（竹木结构）', category: 'craft', format: '.fbx', faces: '74,000', size: '28.4 MB', status: '处理中', quality: 90, color: ['#4d3b8a', '#EFD8B9'] },
  { id: '3D-004', name: '绣球（十二瓣）', category: 'festival', format: '.glb', faces: '32,000', size: '9.6 MB', status: '已发布', quality: 95, color: ['#b4533f', '#EFD8B9'] },
  { id: '3D-005', name: '花山岩画·祭祀场景', category: 'architecture', format: '.obj', faces: '210,000', size: '88.7 MB', status: '已发布', quality: 93, color: ['#2a2052', '#865F50'] },
  { id: '3D-006', name: '壮族盛装人偶（女装）', category: 'pattern', format: '.glb', faces: '154,000', size: '52.3 MB', status: '已发布', quality: 97, color: ['#382b6b', '#c8a254'] }
]

// 文化 DNA 证书（模拟区块链存证）
export const dnaCertificates = [
  { id: 'D-2025-001', name: '壮锦·万字纹图案基因', category: 'pattern', hash: '0x9f3a7c2e51b84d60', block: '1284731', time: '2025-06-18 09:12', status: '已存证', issuer: '壮族文化DNA研究院', gene: ['对称布局', '几何连续性', '红黑金配色'] },
  { id: 'D-2025-002', name: '山歌《壮乡三月好风光》旋律基因', category: 'song', hash: '0x4b81cd9a0e72f355', block: '1284705', time: '2025-06-17 20:44', status: '已存证', issuer: '壮族文化DNA研究院', gene: ['五声调式', '拖腔尾韵', '问答对唱结构'] },
  { id: 'D-2025-003', name: '干栏式建筑·穿斗结构形制基因', category: 'architecture', hash: '0xae2f6c10b93d8e77', block: '1284521', time: '2025-06-16 13:30', status: '已存证', issuer: '壮族文化DNA研究院', gene: ['底层架空', '穿斗抬梁', '歇山顶坡面'] },
  { id: 'D-2025-004', name: '壮语·武鸣音系声调基因', category: 'language', hash: '0x71c8e04d25a9b6f2', block: '1284117', time: '2025-06-15 10:18', status: '已存证', issuer: '壮族文化DNA研究院', gene: ['八调声调', '鼻音韵尾', '浊音清化'] },
  { id: 'D-2025-005', name: '铜鼓·太阳纹符号基因', category: 'craft', hash: '0x3d9b7a51c20e86f4', block: '1283993', time: '2025-06-14 08:55', status: '审核中', issuer: '壮族文化DNA研究院', gene: ['中心放射', '芒纹十二', '同心圆带'] }
]

// AR 教学资源
export const arResources = [
  { id: 'AR-001', name: '壮语问候语识字卡', category: 'language', arType: '图像识别', target: '24 张', status: '已发布', subject: '壮语启蒙' },
  { id: 'AR-002', name: '壮锦纹样临摹教学', category: 'pattern', arType: '平面追踪', target: '12 组', status: '已发布', subject: '纹样认知' },
  { id: 'AR-003', name: '干栏式建筑结构拆解', category: 'architecture', arType: '空间锚点', target: '6 个', status: '内测中', subject: '建筑形制' },
  { id: 'AR-004', name: '三月三对歌互动教学', category: 'song', arType: '图像识别', target: '18 张', status: '已发布', subject: '山歌传唱' },
  { id: 'AR-005', name: '铜鼓纹饰探索', category: 'craft', arType: '平面追踪', target: '9 组', status: '已发布', subject: '传统技艺' }
]

// VR 游戏资源
export const vrResources = [
  { id: 'VR-001', name: '壮族村寨漫游', genre: '沉浸漫游', platform: 'PC VR', duration: '15 分钟', size: '2.4 GB', status: '已发布', rating: 4.8 },
  { id: 'VR-002', name: '三月三歌圩节体验', genre: '文化体验', platform: 'PC VR', duration: '10 分钟', size: '1.8 GB', status: '已发布', rating: 4.9 },
  { id: 'VR-003', name: '壮锦织造工坊', genre: '非遗互动', platform: '一体机', duration: '20 分钟', size: '2.1 GB', status: '内测中', rating: 4.6 },
  { id: 'VR-004', name: '花山岩画探秘', genre: '历史教育', platform: 'PC VR', duration: '12 分钟', size: '1.6 GB', status: '已发布', rating: 4.7 }
]

// 统计看板数据
export const categoryDistribution = [
  { name: '壮族语言', key: 'language', value: 2680 },
  { name: '壮乡山歌', key: 'song', value: 3140 },
  { name: '服饰纹样', key: 'pattern', value: 2790 },
  { name: '建筑形制', key: 'architecture', value: 2150 },
  { name: '节庆习俗', key: 'festival', value: 1186 },
  { name: '传统技艺', key: 'craft', value: 900 }
]

export const monthlyTrend = [
  { month: '1月', count: 1420 },
  { month: '2月', count: 1180 },
  { month: '3月', count: 1650 },
  { month: '4月', count: 2100 },
  { month: '5月', count: 2460 },
  { month: '6月', count: 1830 }
]

export const modelStatus = [
  { name: '已发布', value: 260, color: '#4f8a5f' },
  { name: '处理中', value: 45, color: '#c98a3d' },
  { name: '待审核', value: 23, color: '#5a6fae' }
]

export const recentActivities = [
  { time: '2025-06-18 10:32', action: '新增素材「壮锦·万字纹样样布」', user: '李桂芳', type: 'materials' },
  { time: '2025-06-18 09:12', action: '签发文化DNA证书 D-2025-001', user: '系统', type: 'dna' },
  { time: '2025-06-17 20:44', action: 'AI 完成山歌旋律特征分析', user: 'AI引擎', type: 'ai' },
  { time: '2025-06-17 15:08', action: '上传素材「壮乡三月好风光」录音', user: '韦金花', type: 'materials' },
  { time: '2025-06-16 13:30', action: '三维模型「干栏式民居」发布', user: '黄文标', type: 'model' },
  { time: '2025-06-15 10:18', action: 'AR 资源「壮语识字卡」更新至 v2.1', user: '覃丽英', type: 'ar' }
]
