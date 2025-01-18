import { createRoot } from 'react-dom/client'
import AppRouter from './router'

// vue.use 插入路由配置
// web 应用离不开react-router-dom 此库中提供了丰富路由组件
createRoot(document.getElementById('root')).render(
  <AppRouter></AppRouter>
)
