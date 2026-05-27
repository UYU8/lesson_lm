/**
 * 分享详情页
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share } from '@types/index';
import { shareApi } from '@services/share';
import { formatAmount } from '@utils/currency';
import './plaza-detail.css';

const PlazaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [share, setShare] = useState<Share | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    shareApi.getShareDetail(id)
      .then(res => {
        if (res.data) setShare(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const renderContent = () => {
    if (!share) return null;
    try {
      const content = JSON.parse(share.content);

      if (share.shareType === 'single') {
        return (
          <div className="plaza-detail-single">
            <div className="plaza-detail-amount-row">
              <span className={`plaza-detail-amount ${content.type === 'expense' ? 'expense' : 'income'}`}>
                {content.type === 'expense' ? '-' : '+'}¥{formatAmount(parseFloat(content.amount || 0))}
              </span>
            </div>
            <div className="plaza-detail-info-list">
              <div className="plaza-detail-info-item">
                <span className="plaza-detail-info-label">分类</span>
                <span className="plaza-detail-info-value">{content.categoryName || '未分类'}</span>
              </div>
              {content.description && (
                <div className="plaza-detail-info-item">
                  <span className="plaza-detail-info-label">备注</span>
                  <span className="plaza-detail-info-value">{content.description}</span>
                </div>
              )}
              {content.date && (
                <div className="plaza-detail-info-item">
                  <span className="plaza-detail-info-label">日期</span>
                  <span className="plaza-detail-info-value">{content.date}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      if (share.shareType === 'monthly') {
        return (
          <div className="plaza-detail-monthly">
            <div className="plaza-detail-stats-card">
              <div className="plaza-detail-stat">
                <div className="plaza-detail-stat-label">收入</div>
                <div className="plaza-detail-stat-value income">¥{formatAmount(parseFloat(content.income || 0))}</div>
              </div>
              <div className="plaza-detail-stat-divider" />
              <div className="plaza-detail-stat">
                <div className="plaza-detail-stat-label">支出</div>
                <div className="plaza-detail-stat-value expense">¥{formatAmount(parseFloat(content.expense || 0))}</div>
              </div>
              <div className="plaza-detail-stat-divider" />
              <div className="plaza-detail-stat">
                <div className="plaza-detail-stat-label">结余</div>
                <div className="plaza-detail-stat-value">
                  ¥{formatAmount(parseFloat(content.income || 0) - parseFloat(content.expense || 0))}
                </div>
              </div>
            </div>
            {content.yearMonth && (
              <div className="plaza-detail-month-label">{content.yearMonth} 月度概览</div>
            )}
            {content.transactionCount !== undefined && (
              <div className="plaza-detail-count">共 {content.transactionCount} 笔记录</div>
            )}
          </div>
        );
      }
    } catch {
      return <div className="plaza-detail-raw">{share.content}</div>;
    }
    return null;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="plaza-detail-page">
      {/* 顶部 */}
      <div className="plaza-detail-header">
        <button className="plaza-back-btn" onClick={() => navigate(-1)}>‹</button>
        <span className="plaza-detail-title-text">分享详情</span>
        <div style={{ width: 36 }} />
      </div>

      {loading ? (
        <div className="plaza-detail-loading">加载中...</div>
      ) : !share ? (
        <div className="plaza-detail-empty">分享不存在或已被删除</div>
      ) : (
        <div className="plaza-detail-body">
          {/* 用户信息 */}
          <div className="plaza-detail-user-row">
            <div className="plaza-card-avatar">
              {(share.user?.username || '?').charAt(0).toUpperCase()}
            </div>
            <div className="plaza-detail-user-meta">
              <span className="plaza-detail-username">{share.user?.username || '匿名'}</span>
              <span className="plaza-detail-time">{formatTime(share.createdAt)}</span>
            </div>
          </div>

          {/* 标题 */}
          <div className="plaza-detail-share-title">{share.title}</div>

          {/* 内容 */}
          <div className="plaza-detail-content">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlazaDetailPage;
