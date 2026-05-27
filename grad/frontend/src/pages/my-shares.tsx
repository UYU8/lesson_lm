/**
 * 我的分享页面
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share } from '@types/index';
import { shareApi } from '@services/share';
import PullToRefresh from '@components/pull-to-refresh';
import './my-shares.css';

const MySharesPage: React.FC = () => {
  const navigate = useNavigate();
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);

  const loadShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shareApi.getMyShares(1, 100);
      if (res.data) {
        setShares(res.data.rows || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShares();
  }, [loadShares]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除这条分享吗？')) return;
    try {
      await shareApi.deleteShare(id);
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
      if (share.shareType === 'monthly') {
        return `收入 ¥${content.income || 0} / 支出 ¥${content.expense || 0}`;
      }
    } catch {
      // ignore
    }
    return '账单分享';
  };

  return (
    <PullToRefresh onRefresh={loadShares}>
      <div className="my-shares-page">
        <div className="my-shares-header">
          <button className="plaza-back-btn" onClick={() => navigate(-1)}>‹</button>
          <span className="my-shares-title">我的分享</span>
          <div style={{ width: 36 }} />
        </div>

        <div className="my-shares-list">
          {loading && shares.length === 0 ? (
            <div className="my-shares-loading">加载中...</div>
          ) : shares.length === 0 ? (
            <div className="my-shares-empty">
              <div className="my-shares-empty-icon">📤</div>
              <div className="my-shares-empty-text">还没有分享过</div>
              <div className="my-shares-empty-sub">去账单页分享你的记录吧</div>
            </div>
          ) : (
            shares.map(share => (
              <div key={share.id} className="my-shares-card">
                <div className="my-shares-card-content" onClick={() => navigate(`/plaza/${share.id}`)}>
                  <div className="my-shares-card-top">
                    <span className="my-shares-card-title">{share.title}</span>
                    <span className="my-shares-card-type">
                      {share.shareType === 'single' ? '单笔' : '月度'}
                    </span>
                  </div>
                  <div className="my-shares-card-summary">{getContentSummary(share)}</div>
                  <div className="my-shares-card-time">{formatTime(share.createdAt)}</div>
                </div>
                <button className="my-shares-delete-btn" onClick={() => handleDelete(share.id)}>
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};

export default MySharesPage;
