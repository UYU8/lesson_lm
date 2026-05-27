/**
 * 管理员后台布局
 */

import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import './admin-layout.css';

const ADMIN_TABS = [
  { id: 'dashboard', label: '看板', path: '/admin/dashboard', icon: '📊' },
  { id: 'shares', label: '分享管理', path: '/admin/shares', icon: '📋' },
  { id: 'users', label: '用户管理', path: '/admin/users', icon: '👥' },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* 顶部导航 */}
      <header className="admin-topbar">
        <span className="admin-topbar-title">管理后台</span>
        <button className="admin-logout-btn" onClick={handleLogout}>退出</button>
      </header>

      {/* 内容区 */}
      <main className="admin-main">
        <Outlet />
      </main>

      {/* 底部导航 */}
      <nav className="admin-bottom-nav">
        {ADMIN_TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-nav-item ${location.pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="admin-nav-icon">{tab.icon}</span>
            <span className="admin-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
