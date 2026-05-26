import React, { useState, useEffect, useCallback } from 'react';
import { transactionApi, reportApi } from '@services/accounting';
import { Transaction } from '@types/index';
import { formatCurrency, formatAmount } from '@utils/currency';
import './calendar.css';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  transactions: Transaction[];
  income: number;
  expense: number;
}

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);

  const today = new Date();

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const loadMonthData = useCallback(async () => {
    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const yearMonth = `${year}-${month}`;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      const [statsRes, txRes] = await Promise.all([
        reportApi.getMonthlyStats(yearMonth),
        transactionApi.getTransactions({ startDate, endDate, pageSize: 1000 }),
      ]);

      if (statsRes.code === 0) {
        setMonthIncome(statsRes.data?.income || 0);
        setMonthExpense(statsRes.data?.expense || 0);
      }

      if (txRes.code === 0) {
        generateCalendarDays(txRes.data.data);
      }
    } catch (error) {
      console.error('加载月份数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadMonthData();
    setSelectedDate(null);
  }, [loadMonthData]);

  const generateCalendarDays = (transactions: Transaction[]) => {
    const days: CalendarDay[] = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const transactionMap = new Map<string, Transaction[]>();
    transactions.forEach(t => {
      const dateStr = new Date(t.date).toISOString().split('T')[0];
      if (!transactionMap.has(dateStr)) transactionMap.set(dateStr, []);
      transactionMap.get(dateStr)!.push(t);
    });

    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isCurrentMonth: false, transactions: [], income: 0, expense: 0 });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTransactions = transactionMap.get(dateStr) || [];
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      days.push({ date: i, isCurrentMonth: true, transactions: dayTransactions, income, expense });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isCurrentMonth: false, transactions: [], income: 0, expense: 0 });
    }

    setCalendarDays(days);
  };

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthYear = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  const selectedDayData = selectedDate
    ? calendarDays.find(d => d.isCurrentMonth && d.date === selectedDate.getDate())
    : null;

  const isToday = (day: CalendarDay) =>
    day.isCurrentMonth &&
    day.date === today.getDate() &&
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  return (
    <div className="calendar-page">
      {/* 顶部 Header */}
      <div className="calendar-header">
        <div className="calendar-header-top">
          <div className="calendar-header-title">📅 日历</div>
          <div className="calendar-header-subtitle">查看每日收支情况</div>
        </div>
        <div className="calendar-month-nav">
          <button className="calendar-nav-btn" onClick={handlePrevMonth}>‹</button>
          <span className="calendar-month-label">{monthYear}</span>
          <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
        </div>
      </div>

      {/* 主内容 */}
      <div className="calendar-content">
        {/* 月度汇总 */}
        <div className="calendar-month-summary">
          <div className="calendar-summary-chip">
            <div className="calendar-summary-chip-label">本月收入</div>
            <div className="calendar-summary-chip-value income">{formatCurrency(monthIncome)}</div>
          </div>
          <div className="calendar-summary-chip">
            <div className="calendar-summary-chip-label">本月支出</div>
            <div className="calendar-summary-chip-value expense">{formatCurrency(monthExpense)}</div>
          </div>
          <div className="calendar-summary-chip">
            <div className="calendar-summary-chip-label">月度结余</div>
            <div className={`calendar-summary-chip-value ${monthIncome - monthExpense >= 0 ? 'net' : 'expense'}`}>
              {formatCurrency(monthIncome - monthExpense)}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="calendar-loading">
            <div className="calendar-loading-spinner" />
            <span>加载中...</span>
          </div>
        ) : (
          <>
            {/* 日历卡片 */}
            <div className="calendar-card">
              <div className="calendar-weekdays">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="calendar-weekday">{d}</div>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={[
                      'calendar-day',
                      !day.isCurrentMonth ? 'other-month' : '',
                      isToday(day) ? 'today' : '',
                      selectedDate?.getDate() === day.date && day.isCurrentMonth ? 'selected' : '',
                    ].join(' ')}
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date));
                      }
                    }}
                  >
                    <div className="calendar-day-num">{day.date}</div>
                    {day.isCurrentMonth && (day.income > 0 || day.expense > 0) && (
                      <div className="calendar-day-amounts">
                        {day.income > 0 && (
                          <span className="calendar-day-income">+{formatAmount(day.income)}</span>
                        )}
                        {day.expense > 0 && (
                          <span className="calendar-day-expense">-{formatAmount(day.expense)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 详情面板 */}
            <div className="calendar-detail-panel">
              <div className="calendar-detail-header">
                <div className="calendar-detail-date">
                  {selectedDate
                    ? selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
                    : '选择日期查看详情'}
                </div>
                {selectedDayData && (selectedDayData.income > 0 || selectedDayData.expense > 0) && (
                  <div className="calendar-detail-stats">
                    {selectedDayData.income > 0 && (
                      <span className="calendar-detail-stat income">+{formatCurrency(selectedDayData.income)}</span>
                    )}
                    {selectedDayData.expense > 0 && (
                      <span className="calendar-detail-stat expense">-{formatCurrency(selectedDayData.expense)}</span>
                    )}
                  </div>
                )}
              </div>

              {selectedDayData && selectedDayData.transactions.length > 0 ? (
                <div className="calendar-detail-list">
                  {selectedDayData.transactions.map(transaction => (
                    <div key={transaction.id} className="calendar-detail-item">
                      <div
                        className="calendar-detail-icon"
                        style={{ background: transaction.type === 'income' ? '#E8F8ED' : '#FFF4E0' }}
                      >
                        {transaction.category?.icon || (transaction.type === 'income' ? '💰' : '💸')}
                      </div>
                      <div className="calendar-detail-info">
                        <div className="calendar-detail-category">
                          {transaction.category?.name || '未分类'}
                        </div>
                        {transaction.note && (
                          <div className="calendar-detail-note">{transaction.note}</div>
                        )}
                      </div>
                      <div className={`calendar-detail-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="calendar-empty">
                  <div className="calendar-empty-icon">
                    {selectedDate ? '📭' : '👆'}
                  </div>
                  <div className="calendar-empty-text">
                    {selectedDate ? '当日暂无交易记录' : '点击日期查看交易详情'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
