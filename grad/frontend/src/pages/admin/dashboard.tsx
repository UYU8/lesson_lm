/**
 * 管理员数据看板
 */

import React, { useState, useEffect } from 'react';
import { AdminStats, TrendItem } from '@types/index';
import { adminApi } from '@services/admin';
import { LineChart } from '@components/charts';
import './admin.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.getStats().catch(() => null),
      adminApi.getTrend().catch(() => null),
    ]).then(([statsRes, trendRes]) => {
      if (statsRes?.data) setStats(statsRes.data);
      if (trendRes?.data) setTrend(trendRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '👥', value: stats.totalUsers, label: '总用户数' },
    { icon: '🆕', value: stats.newUsersToday, label: '今日新增' },
    { icon: '📋', value: stats.totalTransactions, label: '总账单数' },
    { icon: '📤', value: stats.totalShares, label: '总分享数' },
  ] : [];

  return (
    <div className="admin-dashboard">
      {loading ? (
        <div className="admin-loading">加载中...</div>
      ) : (
        <>
          {/* 统计卡片 */}
          <div className="admin-stats-grid">
            {statCards.map(card => (
              <div key={card.label} className="admin-stat-card">
                <div className="admin-stat-icon">{card.icon}</div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {/* 趋势图 */}
          <div className="admin-chart-card">
            <div className="admin-chart-title">近30天账单趋势</div>
            {trend.length > 0 ? (
              <LineChart
                xAxisData={trend.map(t => t.date.slice(5))}
                seriesData={[{
                  name: '新增账单',
                  data: trend.map(t => t.count),
                  color: '#FF9500',
                }]}
                height={240}
                yAxisName="条数"
              />
            ) : (
              <div className="admin-empty">暂无数据</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
