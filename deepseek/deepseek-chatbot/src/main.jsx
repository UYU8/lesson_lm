// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // react StrictMode 严格模式 会执行一遍 检测一遍
    <App />
  // </StrictMode>,
)
