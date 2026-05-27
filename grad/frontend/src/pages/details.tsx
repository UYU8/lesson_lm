/**
 * 明细页面 - 鲨鱼记账风格（图一还原）
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@types/index';
import { transactionApi, reportApi } from '@services/accounting';
import { formatAmount } from '@utils/currency';
import PullToRefresh from '@components/pull-to-refresh';
import './details.css';

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍜', transport: '🚌', entertainment: '🎮', shopping: '🛍️',
  medical: '💊', other: '📦', salary: '💼', bonus: '🎁', parttime: '💡',
};

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);
  // picker 内部临时选择的年份
  const [pickerYear, setPickerYear] = useState(now.getFullYear());

  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载当月统计
  const loadStats = useCallback(() => {
    const yearMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    reportApi.getMonthlyStats(yearMonth).then(res => {
      if (res.data) {
        setMonthIncome(parseFloat(res.data.income?.toString() || '0'));
        setMonthExpense(parseFloat(res.data.expense?.toString() || '0'));
      }
    }).catch(() => {});
  }, [selectedYear, selectedMonth]);

  // 加载当月交易
  const loadTransactions = useCallback(() => {
    const yearMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const startDate = `${yearMonth}-01`;
    const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;

    setLoading(true);
    transactionApi.getTransactions({ page: 1, limit: 200, startDate, endDate } as any)
      .then(res => { if (res.data) setTransactions(res.data.rows); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedYear, selectedMonth]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  // 监听记账成功事件，实时刷新
  useEffect(() => {
    const handleTransactionCreated = () => {
      loadStats();
      loadTransactions();
    };
    window.addEventListener('transaction-created', handleTransactionCreated);
    return () => window.removeEventListener('transaction-created', handleTransactionCreated);
  }, [loadStats, loadTransactions]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) { setSelectedYear(y => y - 1); setSelectedMonth(12); }
    else setSelectedMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1) return;
    if (selectedMonth === 12) { setSelectedYear(y => y + 1); setSelectedMonth(1); }
    else setSelectedMonth(m => m + 1);
  };

  const openPicker = () => {
    setPickerYear(selectedYear);
    setShowPicker(true);
  };

  const selectMonth = (m: number) => {
    setSelectedYear(pickerYear);
    setSelectedMonth(m);
    setShowPicker(false);
  };

  // 按日期分组
  const grouped = transactions.reduce((acc, t) => {
    const date = (t.transactionDate || '').split('T')[0];
    if (!date) return acc;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getEmoji = (t: Transaction) =>
    CATEGORY_ICONS[t.category?.icon || ''] || (t.type === 'income' ? '💰' : '💸');

  const getDayStats = (dayTs: Transaction[]) => {
    let income = 0, expense = 0;
    dayTs.forEach(t => {
      const amt = parseFloat(t.amount.toString());
      if (t.type === 'income') income += amt; else expense += amt;
    });
    return { income, expense };
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日  ${WEEKDAYS[d.getDay()]}`;
  };

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      new Promise<void>(r => { loadStats(); r(); }),
      new Promise<void>(r => { loadTransactions(); r(); }),
    ]);
  }, [loadStats, loadTransactions]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="details-page">
      {/* ===== 顶部黄色区域 ===== */}
      <div className="details-top">
        <button className="details-ai-btn" onClick={() => navigate('/chat')}>
          <span>🤖</span>
        </button>
        <div className="details-stats-row">
          {/* 月份选择器 — 点击弹出 picker */}
          <div className="details-month-selector" onClick={openPicker}>
            <div className="details-year-text">{selectedYear}年</div>
            <div className="details-month-text">
              {String(selectedMonth).padStart(2, '0')}月
              <span className="details-month-arrow">▼</span>
            </div>
          </div>

          <div className="details-stats-divider" />

          <div className="details-stat-block">
            <div className="details-stat-label">收入</div>
            <div className="details-stat-value">
              <span className="details-stat-main">{Math.floor(monthIncome)}</span>
              <span className="details-stat-decimal">.{String(Math.round((monthIncome % 1) * 100)).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="details-stat-block">
            <div className="details-stat-label">支出</div>
            <div className="details-stat-value">
              <span className="details-stat-main">{Math.floor(monthExpense)}</span>
              <span className="details-stat-decimal">.{String(Math.round((monthExpense % 1) * 100)).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="details-month-nav">
          <button className="details-month-nav-btn" onClick={handlePrevMonth}>‹</button>
          <button
            className="details-month-nav-btn"
            onClick={handleNextMonth}
            disabled={selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1}
          >›</button>
        </div>
      </div>

      {/* ===== 快捷功能入口 ===== */}
      <div className="details-shortcuts-wrap">
        <div className="details-shortcuts-card">
          <button className="details-shortcut-item" onClick={() => navigate('/bill')}>
            <div className="details-shortcut-icon-wrap">
              <span className="details-shortcut-icon">☰</span>
            </div>
            <span className="details-shortcut-label">账单</span>
          </button>
          <button className="details-shortcut-item" onClick={() => navigate('/search')}>
            <div className="details-shortcut-icon-wrap">
              <span className="details-shortcut-icon">🔍</span>
            </div>
            <span className="details-shortcut-label">搜索</span>
          </button>
          <button className="details-shortcut-item" onClick={() => navigate('/plaza')}>
            <div className="details-shortcut-icon-wrap">
              <span className="details-shortcut-icon">🌍</span>
            </div>
            <span className="details-shortcut-label">广场</span>
          </button>
        </div>
      </div>

      {/* ===== 交易流水区 ===== */}
      <div className="details-list-area">
        {loading && transactions.length === 0 ? (
          <div className="details-loading">加载中...</div>
        ) : transactions.length === 0 ? (
          <div className="details-empty">
            <div className="details-empty-icon-bg">💸</div>
            <div className="details-empty-text">本月还没有记录</div>
            <div className="details-empty-sub">点击下方 + 按钮，记录你的第一笔账</div>
          </div>
        ) : (
          sortedDates.map(date => {
            const dayTs = grouped[date];
            const { income, expense } = getDayStats(dayTs);
            return (
              <div key={date} className="details-day-group">
                <div className="details-day-header">
                  <span className="details-day-label">{formatDay(date)}</span>
                  <span className="details-day-summary">
                    {income > 0 && <span>收入：{formatAmount(income)}</span>}
                    {income > 0 && expense > 0 && <span className="details-day-sep"> </span>}
                    {expense > 0 && <span>支出：{formatAmount(expense)}</span>}
                  </span>
                </div>
                {dayTs.map(t => {
                  const amt = parseFloat(t.amount.toString());
                  const isExpense = t.type === 'expense';
                  return (
                    <div key={t.id} className="details-txn-item">
                      <div className="details-txn-avatar"><span>{getEmoji(t)}</span></div>
                      <div className="details-txn-info">
                        <span className="details-txn-name">
                          {t.description || t.category?.name || '未分类'}
                        </span>
                      </div>
                      <div className={`details-txn-amount ${isExpense ? 'expense' : 'income'}`}>
                        {isExpense ? '-' : '+'}{formatAmount(amt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ===== 月份选择器 底部弹层 ===== */}
      {showPicker && (
        <div className="picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="picker-sheet" onClick={e => e.stopPropagation()}>
            <div className="picker-handle" />
            {/* 年份切换 */}
            <div className="picker-year-row">
              <button className="picker-year-btn" onClick={() => setPickerYear(y => y - 1)}>‹</button>
              <span className="picker-year-label">{pickerYear}年</span>
              <button
                className="picker-year-btn"
                onClick={() => setPickerYear(y => y + 1)}
                disabled={pickerYear >= now.getFullYear()}
              >›</button>
            </div>
            {/* 月份网格 */}
            <div className="picker-month-grid">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                const isFuture = pickerYear === now.getFullYear() && m > now.getMonth() + 1;
                const isSelected = pickerYear === selectedYear && m === selectedMonth;
                return (
                  <button
                    key={m}
                    className={`picker-month-btn ${isSelected ? 'selected' : ''} ${isFuture ? 'disabled' : ''}`}
                    disabled={isFuture}
                    onClick={() => selectMonth(m)}
                  >
                    {m}月
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    </PullToRefresh>
  );
};

export default DetailsPage;
