import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/index';
import './auth.css';

interface LoginFormData {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const res = await login(formData.username, formData.password);
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '登录失败');
    }
  };

  return (
    <div className="auth-page">
      {/* 顶部装饰区 */}
      <div className="auth-top">
        <div className="auth-logo">
          <div className="auth-logo-tagline">记录每一笔，掌握每一分</div>
        </div>
      </div>

      {/* 白色表单卡片 */}
      <div className="auth-card">
        <div className="auth-card-handle" />
        <div className="auth-card-title">欢迎回来 👋</div>
        <div className="auth-card-subtitle">登录账户，开始记账之旅</div>

        {(error || localError) && (
          <div className="auth-error">
            <span>⚠️</span>
            <span>{error || localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <div className="auth-input-item">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
                required
                autoComplete="username"
              />
            </div>
            <div className="auth-input-item">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入密码"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" />登录中...</> : '登录'}
          </button>
        </form>

        <div className="auth-switch">
          <span className="auth-switch-text">还没有账户？</span>
          <Link to="/register" className="auth-switch-link">立即注册</Link>
        </div>
      </div>
    </div>
  );
};
