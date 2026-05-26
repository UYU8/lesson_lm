import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),viteMockServe({
    mockPath:'mock',
    localEnable:true,
  })],
})
