import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // 关键：使用相对路径，保证 Electron 以 file:// 协议加载 dist/index.html 时资源能找到
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500
  },
  server: {
    port: 5173,
    strictPort: true,
    open: false
  }
})
