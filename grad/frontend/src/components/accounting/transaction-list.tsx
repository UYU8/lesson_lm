/**
 * 交易列表组件 - 现代 App 风格
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Transaction, TransactionListParams } from '@types/index';
import { transactionApi } from '@services/accounting';
import { formatDate, formatTime } from '@utils/date';
import { formatCurrency } from '@utils/currency';
import './transaction-list.css';

interface TransactionListProps {
  onSelectTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  refreshTrigger?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍜', transport: '🚌', entertainment: '🎮', shopping: '🛍️',
  medical: '💊', other: '📦', salary: '💼', bonus: '🎁',
  parttime: '💡',
};

const CATEGORY_BG: Record<string, string> = {
  food: '#FFF0E8', transport: '#E8F8F7', entertainment: '#FFF8E8', shopping: '#E8F8F0',
  medical: '#FFE8EE', other: '#F5F5F5', salary: '#E8F8F0', bonus: '#FFF0F7',
  parttime: '#EFF8FF',
};

const TransactionList: React.FC<TransactionListProps> = ({
  onSelectTransaction,
  onDeleteTransaction,
  refreshTrigger = 0,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);
  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeDelta = useRef(0);

  useEffect(() => {
    setPage(1);
    setTransactions([]);
  }, [filterType, refreshTrigger]);

  useEffect(() => {
    loadTransactions(page, filterType, page === 1);
  }, [page, filterType, refreshTrigger]);

  const loadTransactions = async (p: number, type: string, reset: boolean = false) => {
    try {
      setLoading(true);
      const params: TransactionListParams = {
        page: p,
        limit: 20,
        type: type !== 'all' ? (type as 'income' | 'expense') : undefined,
      };
      const response = await transactionApi.getTransactions(params);
      if (response.data) {
        setTransactions(prev => reset ? response.data.rows : [...prev, ...response.data.rows]);
        setTotal(response.data.count);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      // 静默失败
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionApi.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setOpenSwipeId(null);
      onDeleteTransaction?.(id);
    } catch { }
  };

  const handleSwipeTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    swipeTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipeDelta.current = 0;
  }, []);

  const handleSwipeTouchMove = useCallback((e: React.TouchEvent, id: string, el: HTMLDivElement | null) => {
    if (!swipeTouchStart.current || !el) return;
    const dx = e.touches[0].clientX - swipeTouchStart.current.x;
    const dy = e.touches[0].clientY - swipeTouchStart.current.y;
    if (Math.abs(dy) > Math.abs(dx)) return; // 纵向滚动优先
    swipeDelta.current = dx;
    const OPEN = -76;
    const current = openSwipeId === id ? OPEN : 0;
    const raw = current + dx;
    const clamped = Math.max(OPEN, Math.min(0, raw));
    el.style.transform = `translateX(${clamped}px)`;
    el.style.transition = 'none';
  }, [openSwipeId]);

  const handleSwipeTouchEnd = useCallback((e: React.TouchEvent, id: string, el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.transition = 'transform 0.25s ease';
    const OPEN = -76;
    const isCurrentlyOpen = openSwipeId === id;
    const threshold = 36;
    if (!isCurrentlyOpen && swipeDelta.current < -threshold) {
      el.style.transform = `translateX(${OPEN}px)`;
      setOpenSwipeId(id);
    } else if (isCurrentlyOpen && swipeDelta.current > threshold) {
      el.style.transform = 'translateX(0)';
      setOpenSwipeId(null);
    } else if (isCurrentlyOpen) {
      el.style.transform = `translateX(${OPEN}px)`;
    } else {
      el.style.transform = 'translateX(0)';
    }
    swipeTouchStart.current = null;
  }, [openSwipeId]);

  const closeSwipe = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.transition = 'transform 0.25s ease';
    el.style.transform = 'translateX(0)';
    setOpenSwipeId(null);
  }, []);

  // 按日期分组
  const grouped = transactions.reduce((acc, t) => {
    const date = t.transactionDate.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDayStats = (dayTs: Transaction[]) => {
    let income = 0, expense = 0;
    dayTs.forEach(t => {
      const amt = parseFloat(t.amount.toString());
      if (t.type === 'income') income += amt;
      else expense += amt;
    });
    return { income, expense };
  };

  const getIconInfo = (transaction: Transaction) => {
    const icon = transaction.category?.icon || '';
    const emoji = CATEGORY_ICONS[icon] || (transaction.type === 'income' ? '💰' : '💸');
    const bg = CATEGORY_BG[icon] || (transaction.type === 'income' ? 'var(--color-income-bg)' : 'var(--color-expense-bg)');
    return { emoji, bg };
  };

  return (
    <div className="transaction-list">
      {/* 标题 + 筛选 */}
      <div className="transaction-list-header">
        <div className="transaction-list-title">近期流水</div>
      </div>

      {/* 类型筛选 */}
      <div className="transaction-filter-bar">
        {[
          { key: 'all', label: '全部', cls: '' },
          { key: 'expense', label: '💸 支出', cls: 'expense' },
          { key: 'income', label: '💰 收入', cls: 'income' },
        ].map(f => (
          <button
            key={f.key}
            className={`filter-chip ${filterType === f.key ? `active ${f.cls}` : ''}`}
            onClick={() => setFilterType(f.key as any)}
          >
            {f.label}
          </button>
        ))}
        {total > 0 && (
          <span className="filter-chip" style={{ borderStyle: 'dashed', cursor: 'default', color: 'var(--color-text-tertiary)' }}>
            共 {total} 笔
          </span>
        )}
      </div>

      {/* 交易内容 */}
      {loading && transactions.length === 0 ? (
        <div className="transaction-list-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-item">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton-text-group">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="transaction-list-empty">
          <div className="transaction-list-empty-icon">🌱</div>
          <div className="transaction-list-empty-text">还没有交易记录</div>
          <div className="transaction-list-empty-hint">点击下方 + 记录你的第一笔账</div>
        </div>
      ) : (
        <>
          {sortedDates.map(date => {
            const dayTs = grouped[date];
            const { income, expense } = getDayStats(dayTs);
            const isToday = date === new Date().toISOString().split('T')[0];
            const isYesterday = date === new Date(Date.now() - 86400000).toISOString().split('T')[0];

            return (
              <div key={date} className="transaction-group">
                <div className="transaction-group-header">
                  <div className="transaction-group-date">
                    {isToday ? '今天' : isYesterday ? '昨天' : formatDate(new Date(date))}
                  </div>
                  <div className="transaction-group-stats">
                    {income > 0 && (
                      <span className="transaction-group-stat">
                        <span className="transaction-group-stat-value income">+{formatCurrency(income)}</span>
                      </span>
                    )}
                    {expense > 0 && (
                      <span className="transaction-group-stat">
                        <span className="transaction-group-stat-value expense">-{formatCurrency(expense)}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="transaction-card">
                  {dayTs.map(t => {
                    const { emoji, bg } = getIconInfo(t);
                    let contentRef: HTMLDivElement | null = null;
                    return (
                      <div key={t.id} className="swipe-item">
                        <div
                          className="transaction-item"
                          ref={el => { contentRef = el; }}
                          onTouchStart={e => handleSwipeTouchStart(e, t.id)}
                          onTouchMove={e => handleSwipeTouchMove(e, t.id, contentRef)}
                          onTouchEnd={e => handleSwipeTouchEnd(e, t.id, contentRef)}
                          onClick={() => {
                            if (openSwipeId === t.id) { closeSwipe(contentRef); return; }
                            onSelectTransaction?.(t);
                          }}
                        >
                          <div className="transaction-item-icon" style={{ backgroundColor: bg }}>
                            {emoji}
                          </div>
                          <div className="transaction-item-info">
                            <div className="transaction-item-category">
                              {t.category?.name || '未分类'}
                            </div>
                            {t.description && (
                              <div className="transaction-item-desc">{t.description}</div>
                            )}
                            {t.tags && t.tags.length > 0 && (
                              <div className="transaction-item-tags">
                                {t.tags.map(tag => (
                                  <span key={tag.id} className="transaction-item-tag">{tag.name}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="transaction-item-right">
                            <div className={`transaction-item-amount ${t.type}`}>
                              {t.type === 'expense' ? '-' : '+'}{formatCurrency(parseFloat(t.amount.toString()))}
                            </div>
                            <div className="transaction-item-time">
                              {formatTime(new Date(t.createdAt || t.transactionDate))}
                            </div>
                          </div>
                        </div>
                        <button
                          className="swipe-delete-btn"
                          onClick={() => handleDelete(t.id)}
                        >
                          删除
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* 加载更多 */}
          {page < totalPages && (
            <button
              className="load-more-btn"
              onClick={() => setPage(prev => prev + 1)}
              disabled={loading}
            >
              {loading ? <><span className="spinner" style={{ borderTopColor: 'var(--color-primary)', borderColor: 'var(--color-border)' }} /> 加载中...</> : '↓ 加载更多'}
            </button>
          )}

          {transactions.length > 0 && page >= totalPages && (
            <div className="pagination-info">已显示全部 {total} 条记录</div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;
