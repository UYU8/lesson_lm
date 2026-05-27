/**
 * 管理员 - 分享管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Share } from '@types/index';
import { adminApi } from '@services/admin';
import './admin.css';

const AdminShares: React.FC = () => {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadShares = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const res = await adminApi.getShares(pageNum, 20);
      if (res.data) {
        const newShares = res.data.rows || [];
        setShares(prev => append ? [...prev, ...newShares] : newShares);
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
    loadShares(1);
  }, [loadShares]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除这条分享吗？')) return;
    try {
      await adminApi.deleteShare(id);
      setShares(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('删除失败');
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getContentSummary = (share: Share) => {
    try {
      const content = JSON.parse(share.content);
      if (share.shareType === 'single') {
        return `${content.categoryName || '未分类'} ¥${content.amount || 0}`;
      }
      return `收入 ¥${content.income || 0} / 支出 ¥${content.expense || 0}`;
    } catch {
      return '账单分享';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-title">分享管理</div>

      {loading && shares.length === 0 ? (
        <div className="admin-loading">加载中...</div>
      ) : shares.length === 0 ? (
        <div className="admin-empty">暂无分享内容</div>
      ) : (
        <div className="admin-table-card">
          {shares.map(share => (
            <div key={share.id} className="admin-table-row">
              <div className="admin-table-avatar">
                {(share.user?.username || '?').charAt(0).toUpperCase()}
              </div>
              <div className="admin-table-info">
                <div className="admin-table-name">{share.title}</div>
                <div className="admin-table-sub">
                  {share.user?.username || '匿名'} · {getContentSummary(share)}
                </div>
              </div>
              <div className="admin-table-meta">{formatTime(share.createdAt)}</div>
              <div className="admin-table-action">
                <button className="admin-delete-btn" onClick={() => handleDelete(share.id)}>
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && shares.length > 0 && (
        <button className="admin-load-more" onClick={() => loadShares(page + 1, true)} disabled={loading}>
          {loading ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  );
};

export default AdminShares;
