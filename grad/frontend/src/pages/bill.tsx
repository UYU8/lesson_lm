/**
 * 账单页面 - 鲨鱼记账风格（图二还原）
 * 月账单 / 年账单 切换
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@types/index';
import { transactionApi, reportApi } from '@services/accounting';
import { formatAmount } from '@utils/currency';
import PullToRefresh from '@components/pull-to-refresh';
import './bill.css';

interface MonthRow {
  month: number;
  income: number;
  expense: number;
  balance: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍜', transport: '🚌', entertainment: '🎮', shopping: '🛍️',
  medical: '💊', other: '📦', salary: '💼', bonus: '🎁', parttime: '💡',
};

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const BillPage: React.FC = () => {
  const navigate = useNavigate();
  const now = new Date();

  // 年账单 / 月账单 切换（从明细点进来默认是年账单）
  const [viewType, setViewType] = useState<'year' | 'month'>('year');
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // 年账单数据
  const [yearIncome, setYearIncome] = useState(0);
  const [yearExpense, setYearExpense] = useState(0);
  const [monthRows, setMonthRows] = useState<MonthRow[]>([]);
  const [yearLoading, setYearLoading] = useState(false);

  // 月账单数据
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);

  // ===== 加载年账单 =====
  const loadYearData = useCallback(() => {
    if (viewType !== 'year') return;
    setYearLoading(true);
    reportApi.getYearlyStats(selectedYear)
      .then(res => {
        const data = res.data;
        if (!data) return;
        setYearIncome(parseFloat(data.totalIncome?.toString() || '0'));
        setYearExpense(parseFloat(data.totalExpense?.toString() || '0'));

        const rows: MonthRow[] = Array.from({ length: 12 }, (_, i) => {
          const m = 12 - i;
          const monthKey = `${selectedYear}-${String(m).padStart(2, '0')}`;
          const monthData = (data.monthlyStats || []).find((d: any) => d.month === monthKey);
          const inc = parseFloat(monthData?.income?.toString() || '0');
          const exp = parseFloat(monthData?.expense?.toString() || '0');
          return { month: m, income: inc, expense: exp, balance: inc - exp };
        });
        setMonthRows(rows);
      })
      .catch(() => {})
      .finally(() => setYearLoading(false));
  }, [selectedYear, viewType]);

  // ===== 加载月账单（汇总 + 交易列表） =====
  const loadMonthData = useCallback(() => {
    if (viewType !== 'month') return;

    const yearMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const startDate = `${yearMonth}-01`;
    const endDate = `${yearMonth}-${lastDay}`;

    setMonthLoading(true);
    setMonthTransactions([]);

    Promise.all([
      reportApi.getMonthlyStats(yearMonth).catch(() => null),
      transactionApi.getTransactions({ page: 1, limit: 300, startDate, endDate } as any).catch(() => null),
    ]).then(([statsRes, txRes]) => {
      if (statsRes?.data) {
        setMonthIncome(parseFloat(statsRes.data.income?.toString() || '0'));
        setMonthExpense(parseFloat(statsRes.data.expense?.toString() || '0'));
      }
      if (txRes?.data?.rows) {
        setMonthTransactions(txRes.data.rows);
      }
    }).finally(() => setMonthLoading(false));
  }, [selectedYear, selectedMonth, viewType]);

  useEffect(() => { loadYearData(); }, [loadYearData]);
  useEffect(() => { loadMonthData(); }, [loadMonthData]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      new Promise<void>(r => { loadYearData(); r(); }),
      new Promise<void>(r => { loadMonthData(); r(); }),
    ]);
  }, [loadYearData, loadMonthData]);

  const fmt = (v: number) => formatAmount(v, 2);
  const fmtSigned = (v: number) => formatAmount(v, 2);

  const getEmoji = (t: Transaction) => {
    const icon = t.category?.icon || '';
    return CATEGORY_ICONS[icon] || (t.type === 'income' ? '💰' : '💸');
  };

  // 按日期分组
  const groupByDate = (txns: Transaction[]) => {
    const grouped = txns.reduce((acc, t) => {
      const date = (t.transactionDate || '').split('T')[0];
      if (!date) return acc;
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({ date, txns: grouped[date] }));
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = WEEKDAYS[d.getDay()];
    return `${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日  ${weekday}`;
  };

  const getDayStats = (dayTs: Transaction[]) => {
    let income = 0, expense = 0;
    dayTs.forEach(t => {
      const amt = parseFloat(t.amount.toString());
      if (t.type === 'income') income += amt;
      else expense += amt;
    });
    return { income, expense };
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="bill-page">
      {/* ===== 顶部导航栏 ===== */}
      <div className="bill-navbar">
        <button className="bill-back-btn" onClick={() => navigate(-1)}>‹</button>

        <div className="bill-year-selector" onClick={() => setShowYearPicker(true)}>
          <span className="bill-year-text">{selectedYear}年</span>
          <span className="bill-year-arrow">▼</span>
        </div>

        {/* 月账单 / 年账单 pill 切换 */}
        <div className="bill-type-toggle">
          <button
            className={`bill-type-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >月账单</button>
          <button
            className={`bill-type-btn ${viewType === 'year' ? 'active' : ''}`}
            onClick={() => setViewType('year')}
          >年账单</button>
        </div>

        <div className="bill-navbar-actions">
          <button className="bill-navbar-icon-btn">···</button>
        </div>
      </div>

      {/* ===== 年账单视图 ===== */}
      {viewType === 'year' && (
        <div className="bill-year-view">
          {/* 年度总计黄色卡片 */}
          <div className="bill-year-card">
            <div className="bill-year-card-bg-icon">¥</div>
            <div className="bill-year-card-label">年结余</div>
            <div className="bill-year-card-balance">{fmtSigned(yearIncome - yearExpense)}</div>
            <div className="bill-year-card-row">
              <span className="bill-year-card-sub">年收入 <strong>{fmt(yearIncome)}</strong></span>
              <span className="bill-year-card-sub">年支出 <strong>{fmt(yearExpense)}</strong></span>
            </div>
          </div>

          {/* 月份表格 */}
          <div className="bill-month-table">
            <div className="bill-month-table-header">
              <span className="bill-col-month">月份</span>
              <span className="bill-col-income">月收入</span>
              <span className="bill-col-expense">月支出</span>
              <span className="bill-col-balance">月结余</span>
              <span className="bill-col-arrow" />
            </div>

            {yearLoading ? (
              <div className="bill-loading">加载中...</div>
            ) : (
              monthRows.map(row => (
                <button
                  key={row.month}
                  className="bill-month-row"
                  onClick={() => { setSelectedMonth(row.month); setViewType('month'); }}
                >
                  <span className="bill-col-month">{row.month}月</span>
                  <span className="bill-col-income">{fmt(row.income)}</span>
                  <span className="bill-col-expense">{fmt(row.expense)}</span>
                  <span className={`bill-col-balance ${row.balance < 0 ? 'negative' : ''}`}>
                    {fmt(row.balance)}
                  </span>
                  <span className="bill-col-arrow">›</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== 月账单视图 ===== */}
      {viewType === 'month' && (
        <div className="bill-month-view">
          {/* 月份切换 */}
          <div className="bill-month-nav-bar">
            <button className="bill-month-nav-btn" onClick={() => {
              if (selectedMonth === 1) { setSelectedYear(y => y - 1); setSelectedMonth(12); }
              else setSelectedMonth(m => m - 1);
            }}>‹</button>
            <span className="bill-month-nav-label">{selectedMonth}月</span>
            <button className="bill-month-nav-btn" onClick={() => {
              if (selectedMonth === 12) { setSelectedYear(y => y + 1); setSelectedMonth(1); }
              else setSelectedMonth(m => m + 1);
            }}>›</button>
          </div>

          {/* 月度总计黄色卡片 */}
          <div className="bill-year-card">
            <div className="bill-year-card-bg-icon">¥</div>
            <div className="bill-year-card-label">月结余</div>
            <div className="bill-year-card-balance">{fmtSigned(monthIncome - monthExpense)}</div>
            <div className="bill-year-card-row">
              <span className="bill-year-card-sub">月收入 <strong>{fmt(monthIncome)}</strong></span>
              <span className="bill-year-card-sub">月支出 <strong>{fmt(monthExpense)}</strong></span>
            </div>
          </div>

          {/* 当月交易流水 */}
          {monthLoading ? (
            <div className="bill-loading">加载中...</div>
          ) : monthTransactions.length === 0 ? (
            <div className="bill-empty">
              <div className="bill-empty-icon-bg">🗓️</div>
              <div className="bill-empty-text">本月还没有记录</div>
              <div className="bill-empty-sub">点击下方 + 按钮，记录你的第一笔账</div>
            </div>
          ) : (
            <div className="bill-txn-list">
              {groupByDate(monthTransactions).map(({ date, txns }) => {
                const { income, expense } = getDayStats(txns);
                return (
                  <div key={date} className="bill-day-group">
                    {/* 日期头 */}
                    <div className="bill-day-header">
                      <span className="bill-day-label">{formatDay(date)}</span>
                      <span className="bill-day-summary">
                        {income > 0 && <span>收入：{formatAmount(income)}</span>}
                        {income > 0 && expense > 0 && ' '}
                        {expense > 0 && <span>支出：{formatAmount(expense)}</span>}
                      </span>
                    </div>

                    {/* 交易条目 */}
                    {txns.map(t => {
                      const amt = parseFloat(t.amount.toString());
                      const isExpense = t.type === 'expense';
                      return (
                        <div key={t.id} className="bill-txn-item">
                          <div className="bill-txn-avatar">{getEmoji(t)}</div>
                          <div className="bill-txn-info">
                            <span className="bill-txn-name">
                              {t.description || t.category?.name || '未分类'}
                            </span>
                          </div>
                          <div className={`bill-txn-amount ${isExpense ? 'expense' : 'income'}`}>
                            {isExpense ? '-' : '+'}{formatAmount(amt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== 年份选择器 底部弹层 ===== */}
      {showYearPicker && (
        <div className="picker-overlay" onClick={() => setShowYearPicker(false)}>
          <div className="picker-sheet" onClick={e => e.stopPropagation()}>
            <div className="picker-handle" />
            <div className="picker-year-row">
              <span className="picker-year-title">选择年份</span>
            </div>
            <div className="picker-year-list">
              {Array.from({ length: 6 }, (_, i) => now.getFullYear() - i).map(yr => (
                <button
                  key={yr}
                  className={`picker-year-item ${yr === selectedYear ? 'selected' : ''}`}
                  onClick={() => { setSelectedYear(yr); setShowYearPicker(false); }}
                >
                  {yr}年
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </PullToRefresh>
  );
};

export default BillPage;
