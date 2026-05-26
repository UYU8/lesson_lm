import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/index';
import './auth.css';

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('两次输入的密码不一致');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('密码长度至少为 6 个字符');
      return;
    }

    try {
      await register(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '注册失败');
    }
  };

  return (
    <div className="auth-page">
      {/* 顶部装饰区 */}
      <div className="auth-top">
        <div className="auth-logo">
          <div className="auth-logo-tagline">开始您的智慧记账之旅</div>
        </div>
      </div>

      {/* 白色表单卡片 */}
      <div className="auth-card">
        <div className="auth-card-handle" />
        <div className="auth-card-title">创建新账户 ✨</div>
        <div className="auth-card-subtitle">注册后即可使用全部功能</div>

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
                placeholder="请输入用户名（3-20个字符）"
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
                placeholder="请输入密码（至少 6 个字符）"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="auth-input-item">
              <span className="auth-input-icon">🔐</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请再次输入密码"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" />注册中...</> : '注册账户'}
          </button>
        </form>

        <div className="auth-switch">
          <span className="auth-switch-text">已有账户？</span>
          <Link to="/login" className="auth-switch-link">立即登录</Link>
        </div>
      </div>
    </div>
  );
};
