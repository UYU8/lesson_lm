import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { searchApi, categoryApi } from '@services/accounting';
import { Category, Transaction } from '@types/index';
import { formatCurrency } from '@utils/currency';
import './search.css';

interface SearchFilters {
  keyword?: string;
  minAmount?: number;
  maxAmount?: number;
  categoryId?: string;
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
}

interface SearchResult {
  total: number;
  page: number;
  pageSize: number;
  data: Transaction[];
}

interface SearchHistory {
  id: string;
  keyword: string;
  createdAt: string;
}

const CATEGORY_ICON_COLORS: Record<string, string> = {
  income: '#E8F8ED',
  expense: '#FFF4E0',
};

export const SearchPage: React.FC = () => {
  const location = useLocation();
  const locationState = (location.state || {}) as {
    categoryId?: string;
    categoryName?: string;
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
  };

  const initialFilters: SearchFilters = {
    ...(locationState.categoryId ? { categoryId: locationState.categoryId } : {}),
    ...(locationState.type ? { type: locationState.type } : {}),
    ...(locationState.startDate ? { startDate: locationState.startDate } : {}),
    ...(locationState.endDate ? { endDate: locationState.endDate } : {}),
  };
  const hasInitialFilter = Object.keys(initialFilters).length > 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(hasInitialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadCategories();
    loadSearchHistory();
  }, []);

  // 实时搜索：输入停止 400ms 后自动触发
  useEffect(() => {
    if (!searchQuery.trim() && !Object.values(filters).some(v => v)) {
      setSearchResults(null);
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      doSearch(searchQuery, filters, 1);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, filters]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.data) setCategories(response.data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const response = await searchApi.getSearchHistory(10);
      if (response.code === 0) setSearchHistory(response.data);
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  const doSearch = useCallback(async (query: string, f: SearchFilters, page: number) => {
    setIsSearching(true);
    setCurrentPage(page);
    try {
      const response = await searchApi.searchTransactions({
        keyword: query,
        ...f,
        page,
        pageSize: 20,
      });
      if (response.code === 0) {
        setSearchResults(response.data);
        if (query.trim()) loadSearchHistory();
      }
    } catch { }
    finally { setIsSearching(false); }
  }, []);

  const handleHistoryClick = (keyword: string) => {
    setSearchQuery(keyword);
    // useEffect 会自动触发搜索
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await searchApi.deleteSearchHistory(id);
      loadSearchHistory();
    } catch (error) {
      console.error('删除搜索历史失败:', error);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('确定要清除所有搜索历史吗？')) {
      try {
        await searchApi.clearSearchHistory();
        loadSearchHistory();
      } catch (error) {
        console.error('清除搜索历史失败:', error);
      }
    }
  };

  const handleLoadMore = async () => {
    if (!searchResults) return;
    const nextPage = currentPage + 1;
    setIsSearching(true);
    try {
      const response = await searchApi.searchTransactions({
        keyword: searchQuery,
        ...filters,
        page: nextPage,
        pageSize: 20,
      });
      if (response.code === 0) {
        setSearchResults(prev => prev ? {
          ...response.data,
          data: [...prev.data, ...response.data.data],
        } : response.data);
        setCurrentPage(nextPage);
      }
    } catch { }
    finally { setIsSearching(false); }
  };

  return (
    <div className="search-page">
      {/* 顶部 Header */}
      <div className="search-header">
        <div className="search-header-top">
          <div>
            <div className="search-header-title">🔍 搜索</div>
            <div className="search-header-subtitle">
              {locationState.categoryName
                ? `${locationState.categoryName} · ${locationState.type === 'income' ? '收入' : '支出'}`
                : '查找任意一笔交易'}
            </div>
          </div>
        </div>
        <div className="search-input-wrap">
          <div className="search-input-box">
            {isSearching
              ? <span className="search-input-spinner" />
              : <span className="search-input-icon">🔍</span>
            }
            <input
              type="text"
              placeholder="搜索交易记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="search-content">
        {/* 筛选器 */}
        <button
          className={`search-filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>⚙️</span>
          <span>{showFilters ? '收起筛选' : '高级筛选'}</span>
        </button>

        {showFilters && (
          <div className="search-filters-panel">
            <div className="filter-group">
              <div className="filter-group-label">金额范围</div>
              <div className="filter-input-row">
                <input
                  type="number"
                  className="filter-input"
                  placeholder="最小金额"
                  value={filters.minAmount || ''}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
                <span>—</span>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="最大金额"
                  value={filters.maxAmount || ''}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">分类</div>
              <select
                className="filter-select"
                value={filters.categoryId || ''}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value || undefined })}
              >
                <option value="">全部分类</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">类型</div>
              <select
                className="filter-select"
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: (e.target.value as 'income' | 'expense') || undefined })}
              >
                <option value="">全部类型</option>
                <option value="income">收入</option>
                <option value="expense">支出</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">日期范围</div>
              <div className="filter-input-row">
                <input
                  type="date"
                  className="filter-input"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                />
                <span>—</span>
                <input
                  type="date"
                  className="filter-input"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {searchResults ? (
          <>
            <div className="search-results-info">
              找到 <strong>{searchResults.total}</strong> 条相关记录
            </div>
            {searchResults.data.length === 0 ? (
              <div className="search-empty">
                <div className="search-empty-icon">😔</div>
                <div className="search-empty-text">没有找到相关记录</div>
                <div className="search-empty-hint">换个关键词试试吧</div>
              </div>
            ) : (
              <>
                <div className="search-results-list">
                  {searchResults.data.map(transaction => (
                    <div key={transaction.id} className="search-result-item">
                      <div
                        className="search-result-icon"
                        style={{ background: transaction.type === 'income' ? CATEGORY_ICON_COLORS.income : CATEGORY_ICON_COLORS.expense }}
                      >
                        {transaction.category?.icon || (transaction.type === 'income' ? '💰' : '💸')}
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-category">
                          {transaction.category?.name || '未分类'}
                        </div>
                        {transaction.note && (
                          <div className="search-result-note">{transaction.note}</div>
                        )}
                        <div className="search-result-date">
                          {new Date(transaction.date).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      <div className={`search-result-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                {searchResults.data.length < searchResults.total && (
                  <button
                    className="search-load-more"
                    onClick={handleLoadMore}
                    disabled={isSearching}
                  >
                    {isSearching ? '加载中...' : '查看更多'}
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div className="search-history">
                <div className="search-history-header">
                  <div className="search-history-title">搜索历史</div>
                  <button className="search-history-clear" onClick={handleClearHistory}>
                    清除全部
                  </button>
                </div>
                <div className="search-history-list">
                  {searchHistory.map(item => (
                    <div key={item.id} className="search-history-chip">
                      <button
                        className="search-history-keyword"
                        onClick={() => handleHistoryClick(item.keyword)}
                      >
                        🕐 {item.keyword}
                      </button>
                      <button
                        className="search-history-del"
                        onClick={() => handleDeleteHistory(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchHistory.length === 0 && (
              <div className="search-empty">
                <div className="search-empty-icon">🔍</div>
                <div className="search-empty-text">搜索交易记录</div>
                <div className="search-empty-hint">输入关键词、金额或使用筛选条件</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
