import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { reportApi } from '@services/accounting';
import { formatCurrency } from '@utils/currency';
import './profile.css';

const AVATAR_KEY = (uid: string) => `avatar_${uid}`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [monthlyStats, setMonthlyStats] = useState<{ expense: number; income: number; count: number } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    reportApi.getMonthlyStats(ym).then(res => {
      if (res.code === 0) {
        setMonthlyStats({
          expense: res.data.expense ?? 0,
          income: res.data.income ?? 0,
          count: res.data.transactionCount ?? 0,
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(AVATAR_KEY(user.id));
      if (stored) setAvatarUrl(stored);
    }
  }, [user?.id]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(AVATAR_KEY(user.id), dataUrl);
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuSections = [
    {
      key: 'account',
      items: [
        { icon: '📢', bg: '#5AC8FA', label: '我的分享', action: () => navigate('/my-shares'), toggle: false },
        { icon: '🔑', bg: '#FF9500', label: '修改密码', action: () => navigate('/change-password'), toggle: false },
        { icon: '🎨', bg: '#FF2D55', label: '深色模式', action: toggleTheme, toggle: true },
      ],
    },
  ];

  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <div className="profile-page">
      {/* 黄色 Header */}
      <div className="profile-header">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="profile-avatar-wrap" onClick={handleAvatarClick}>
          {avatarUrl
            ? <img className="profile-avatar-img" src={avatarUrl} alt="avatar" />
            : <div className="profile-avatar">{avatarLetter}</div>
          }
          <div className="profile-avatar-edit">📷</div>
        </div>
        <div className="profile-username">{user?.username || '用户'}</div>

        {/* 本月简报 */}
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">
              {monthlyStats ? formatCurrency(monthlyStats.expense) : '--'}
            </div>
            <div className="profile-stat-label">本月支出</div>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <div className="profile-stat-value">
              {monthlyStats ? formatCurrency(monthlyStats.income) : '--'}
            </div>
            <div className="profile-stat-label">本月收入</div>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <div className="profile-stat-value">
              {monthlyStats ? `${monthlyStats.count}` : '--'}
            </div>
            <div className="profile-stat-label">记账笔数</div>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="profile-body">
        {menuSections.map(section => (
          <div key={section.key} className="profile-section">
            {section.title && (
              <div className="profile-section-title">{section.title}</div>
            )}
            <div className="profile-menu-card">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  className={`profile-menu-item${idx < section.items.length - 1 ? ' has-divider' : ''}`}
                  onClick={item.action}
                >
                  <div className="profile-menu-icon-wrap" style={{ background: item.bg }}>
                    <span className="profile-menu-icon">{item.icon}</span>
                  </div>
                  <span className="profile-menu-label">{item.label}</span>
                  {item.toggle ? (
                    <div className={`profile-toggle${isDark ? ' on' : ''}`}>
                      <div className="profile-toggle-thumb" />
                    </div>
                  ) : (
                    <span className="profile-menu-arrow">›</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="profile-logout-btn" onClick={handleLogout}>
          退出登录
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
