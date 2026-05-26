/**
 * 统计卡片组件 - 现代渐变风格
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DailyStats, MonthlyStats } from '@types/index';
import { reportApi } from '@services/accounting';
import { formatDate, getMonthString } from '@utils/date';
import { formatCurrency } from '@utils/currency';
import './statistics-card.css';

interface StatisticsCardProps {
  type?: 'daily' | 'monthly' | 'both';
  date?: string;
  yearMonth?: string;
  onDateChange?: (date: string) => void;
  onMonthChange?: (yearMonth: string) => void;
  refreshTrigger?: number;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  type = 'both',
  date,
  yearMonth,
  onDateChange,
  onMonthChange,
  refreshTrigger = 0,
}) => {
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(date || formatDate(new Date()));
  const [currentMonth, setCurrentMonth] = useState(yearMonth || getMonthString(new Date()));

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const promises: Promise<any>[] = [];

      if (type === 'daily' || type === 'both') {
        promises.push(reportApi.getDailyStats(currentDate));
      }
      if (type === 'monthly' || type === 'both') {
        promises.push(reportApi.getMonthlyStats(currentMonth));
      }

      const results = await Promise.all(promises);
      let idx = 0;

      if (type === 'daily' || type === 'both') {
        const res = results[idx++];
        if (res.data) setDailyStats(res.data);
      }
      if (type === 'monthly' || type === 'both') {
        const res = results[idx++];
        if (res.data) setMonthlyStats(res.data);
      }
    } catch (err) {
      // 静默失败
    } finally {
      setLoading(false);
    }
  }, [type, currentDate, currentMonth]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics, refreshTrigger]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    const str = formatDate(newDate);
    setCurrentDate(str);
    onDateChange?.(str);
  };

  const handleMonthChange = (months: number) => {
    const [year, month] = currentMonth.split('-');
    let newYear = parseInt(year);
    let newMonth = parseInt(month) + months;
    if (newMonth > 12) { newYear += Math.floor(newMonth / 12); newMonth = newMonth % 12 || 12; }
    else if (newMonth < 1) { newYear -= Math.ceil((1 - newMonth) / 12); newMonth = ((newMonth - 1 + 12) % 12) + 1; }
    const str = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
    setCurrentMonth(str);
    onMonthChange?.(str);
  };

  const isToday = currentDate === formatDate(new Date());

  return (
    <div className="statistics-container">
      {/* 月统计主卡片 */}
      {(type === 'monthly' || type === 'both') && (
        <div className={`stats-main-card ${loading ? 'statistics-loading' : ''}`}>
          {loading ? (
            <div className="skeleton statistics-skeleton" />
          ) : (
            <>
              {/* 月份导航 */}
              <div className="stats-month-nav">
                <button className="stats-month-btn" onClick={() => handleMonthChange(-1)}>‹</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="stats-month-label">{currentMonth} 月账单</span>
                  {currentMonth !== getMonthString(new Date()) && (
                    <button className="stats-month-today-btn" onClick={() => setCurrentMonth(getMonthString(new Date()))}>本月</button>
                  )}
                </div>
                <button className="stats-month-btn" onClick={() => handleMonthChange(1)}>›</button>
              </div>

              {/* 结余展示 */}
              <div className="stats-balance-section">
                <div className="stats-balance-label">月结余（元）</div>
                <div className={`stats-balance-amount ${monthlyStats && monthlyStats.net < 0 ? 'negative' : ''}`}>
                  {monthlyStats ? formatCurrency(monthlyStats.net) : '¥ 0.00'}
                </div>
              </div>

              {/* 收支明细 */}
              <div className="stats-row">
                <div className="stats-col">
                  <div className="stats-col-label">
                    <span className="stats-col-dot income" />收入
                  </div>
                  <div className="stats-col-value">
                    {monthlyStats ? formatCurrency(monthlyStats.income) : '¥0'}
                  </div>
                </div>
                <div className="stats-col">
                  <div className="stats-col-label">
                    <span className="stats-col-dot expense" />支出
                  </div>
                  <div className="stats-col-value">
                    {monthlyStats ? formatCurrency(monthlyStats.expense) : '¥0'}
                  </div>
                </div>
                <div className="stats-col">
                  <div className="stats-col-label">笔数</div>
                  <div className="stats-col-value">
                    {monthlyStats?.transactionCount ?? 0}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 日统计 */}
      {(type === 'daily' || type === 'both') && (
        <>
          <div className="stats-date-nav">
            <button className="stats-date-nav-btn" onClick={() => handleDateChange(-1)}>‹</button>
            <span className="stats-date-label">
              {isToday ? '今天' : currentDate.replace(/-/g, '/')}
            </span>
            {!isToday && (
              <button className="stats-today-btn" onClick={() => setCurrentDate(formatDate(new Date()))}>今天</button>
            )}
            <button className="stats-date-nav-btn" onClick={() => handleDateChange(1)}>›</button>
          </div>

          <div className="stats-daily-row">
            <div className="stats-daily-mini">
              <div className="stats-daily-mini-label">今日收入</div>
              <div className="stats-daily-mini-value income">
                {dailyStats ? formatCurrency(dailyStats.income) : '¥0'}
              </div>
            </div>
            <div className="stats-daily-mini">
              <div className="stats-daily-mini-label">今日支出</div>
              <div className="stats-daily-mini-value expense">
                {dailyStats ? formatCurrency(dailyStats.expense) : '¥0'}
              </div>
            </div>
            <div className="stats-daily-mini">
              <div className="stats-daily-mini-label">今日结余</div>
              <div className="stats-daily-mini-value net">
                {dailyStats ? formatCurrency(dailyStats.net) : '¥0'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsCard;
