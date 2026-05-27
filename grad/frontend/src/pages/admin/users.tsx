/**
 * 管理员 - 用户管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '@types/index';
import { adminApi } from '@services/admin';
import './admin.css';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadUsers = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(pageNum, 20);
      if (res.data) {
        const newUsers = res.data.rows || [];
        setUsers(prev => append ? [...prev, ...newUsers] : newUsers);
        setHasMore(pageNum < (res.data.totalPages || 1));
        setPage(pageNum);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.isActive ? 0 : 1;
    const action = newStatus ? '启用' : '禁用';
    if (!window.confirm(`确定${action}用户 "${user.username}" 吗？`)) return;

    try {
      await adminApi.updateUserStatus(user.id, newStatus);
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, isActive: newStatus } : u
      ));
    } catch {
      alert(`${action}失败`);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-title">用户管理</div>

      {loading && users.length === 0 ? (
        <div className="admin-loading">加载中...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">暂无用户</div>
      ) : (
        <div className="admin-table-card">
          {users.map(user => (
            <div key={user.id} className="admin-table-row">
              <div className="admin-table-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="admin-table-info">
                <div className="admin-table-name">
                  {user.username}
                  {user.role === 'admin' && (
                    <span style={{ fontSize: 11, color: '#FF9500', marginLeft: 6 }}>管理员</span>
                  )}
                </div>
                <div className="admin-table-sub">
                  注册 {formatTime(user.createdAt)} · {user.transactionCount} 笔账单
                </div>
              </div>
              <div className="admin-table-action">
                {user.role !== 'admin' && (
                  <button
                    className={`admin-toggle-btn ${user.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.isActive ? '正常' : '已禁用'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && users.length > 0 && (
        <button className="admin-load-more" onClick={() => loadUsers(page + 1, true)} disabled={loading}>
          {loading ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  );
};

export default AdminUsers;
