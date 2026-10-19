import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MaterialIntake from '../views/MaterialIntake.vue'
import Model3D from '../views/Model3D.vue'
import DNACertificate from '../views/DNACertificate.vue'
import ARTeaching from '../views/ARTeaching.vue'
import VRGame from '../views/VRGame.vue'
import Statistics from '../views/Statistics.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '首页' } },
  { path: '/material', name: 'material', component: MaterialIntake, meta: { title: '文化素材入库' } },
  { path: '/model3d', name: 'model3d', component: Model3D, meta: { title: '三维模型管理' } },
  { path: '/dna', name: 'dna', component: DNACertificate, meta: { title: '文化DNA证书' } },
  { path: '/ar', name: 'ar', component: ARTeaching, meta: { title: 'AR教学数据' } },
  { path: '/vr', name: 'vr', component: VRGame, meta: { title: 'VR游戏资源管理' } },
  { path: '/stats', name: 'stats', component: Statistics, meta: { title: '数据统计看板' } }
]

// 使用 hash 模式：Electron 以 file:// 加载时路由才能正常工作
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '首页'} · AI驱动的壮族文化数字资源库`
})

export default router
