/**
 * 公开广场页面
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share } from '@types/index';
import { shareApi } from '@services/share';
import PullToRefresh from '@components/pull-to-refresh';
import './plaza.css';

const PlazaPage: React.FC = () => {
  const navigate = useNavigate();
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadShares = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const res = await shareApi.getPlaza(pageNum, 20);
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

  const handleRefresh = useCallback(async () => {
    await loadShares(1);
  }, [loadShares]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadShares(page + 1, true);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}天前`;
    return `${d.getMonth() + 1}月${d.getDate()}日`;
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
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="plaza-page">
        {/* 顶部 */}
        <div className="plaza-header">
          <button className="plaza-back-btn" onClick={() => navigate(-1)}>‹</button>
          <span className="plaza-title">分享广场</span>
          <div style={{ width: 36 }} />
        </div>

        {/* 分享列表 */}
        <div className="plaza-list">
          {loading && shares.length === 0 ? (
            <div className="plaza-loading">加载中...</div>
          ) : shares.length === 0 ? (
            <div className="plaza-empty">
              <div className="plaza-empty-icon">🌍</div>
              <div className="plaza-empty-text">还没有人分享</div>
              <div className="plaza-empty-sub">去账单页分享你的第一条记录吧</div>
            </div>
          ) : (
            <>
              {shares.map(share => (
                <div
                  key={share.id}
                  className="plaza-card"
                  onClick={() => navigate(`/plaza/${share.id}`)}
                >
                  <div className="plaza-card-header">
                    <div className="plaza-card-avatar">
                      {(share.user?.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="plaza-card-meta">
                      <span className="plaza-card-username">{share.user?.username || '匿名'}</span>
                      <span className="plaza-card-time">{formatTime(share.createdAt)}</span>
                    </div>
                    <span className="plaza-card-type">
                      {share.shareType === 'single' ? '单笔' : '月度'}
                    </span>
                  </div>
                  <div className="plaza-card-title">{share.title}</div>
                  <div className="plaza-card-summary">{getContentSummary(share)}</div>
                </div>
              ))}
              {hasMore && (
                <button className="plaza-load-more" onClick={handleLoadMore} disabled={loading}>
                  {loading ? '加载中...' : '加载更多'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};

export default PlazaPage;
