import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@hooks/useTheme';
import './styles/index.css';

// 启动前立即同步主题，防止白屏闪烁
(function () {
  const t = localStorage.getItem('shark_theme') ?? 'light';
  document.documentElement.setAttribute('data-theme', t);
})();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
