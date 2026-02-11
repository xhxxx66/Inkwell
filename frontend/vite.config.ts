import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// node 需要单独添加类型声明文件
import path from 'path' // node 的内置模块
import { viteMockServe } from 'vite-plugin-mock'

// 切换 mock / 真实后端：改这里
const USE_MOCK = false

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    USE_MOCK && viteMockServe({
      mockPath: 'mock'
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      // __dirname node 的超级变量 项目根目录
      "@": path.resolve(__dirname, "src"),
    }
  }
})
