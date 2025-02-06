import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// vite中预先加载 UI 组件库的包
import Components from 'unplugin-vue-components/vite'
// 引入vant组件 编译阶段 
// 命令行而不是在浏览器中启动 自动引入 快
// 这种解决方案所需的包
import { VantResolver} from '@vant/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        VantResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
      '@': path.resolve(__dirname, 'src')
    }
  }
})