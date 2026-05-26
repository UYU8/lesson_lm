import React, { useState, useEffect } from 'react';
import { reportApi } from '@services/accounting';
import { PieChart, BarChart } from '@components/charts';
import { formatCurrency } from '@utils/currency';
import { getMonthString } from '@utils/date';
import './report.css';

interface CategoryStats {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  income: number;
  expense: number;
  total: number;
  percentage: number;
}

interface TrendItem {
  date: string;
  income: number;
  expense: number;
}

export const ReportPage: React.FC = () => {
  const [reportType, setReportType] = useState<'month' | 'year'>('month');
  const [currentMonth, setCurrentMonth] = useState(getMonthString(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [yearlyStats, setYearlyStats] = useState<any>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [trendData, setTrendData] = useState<TrendItem[]>([]);

  useEffect(() => {
    if (reportType === 'month') {
      loadMonthlyReport();
    } else {
      loadYearlyReport();
    }
  }, [reportType, currentMonth, currentYear]);

  const loadMonthlyReport = async () => {
    setIsLoading(true);
    try {
      const statsResponse = await reportApi.getMonthlyStats(currentMonth);
      if (statsResponse.code === 0) setMonthlyStats(statsResponse.data);

      const [year, month] = currentMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      const categoryResponse = await reportApi.getCategoryStats(startDate, endDate);
      if (categoryResponse.code === 0) setCategoryStats(categoryResponse.data);

      const trendResponse = await reportApi.getTrendData(startDate, endDate);
      if (trendResponse.code === 0) setTrendData(trendResponse.data);
    } catch (error) {
      console.error('加载月度报表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadYearlyReport = async () => {
    setIsLoading(true);
    try {
      const statsResponse = await reportApi.getYearlyStats(currentYear);
      if (statsResponse.code === 0) setYearlyStats(statsResponse.data);

      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      const categoryResponse = await reportApi.getCategoryStats(startDate, endDate);
      if (categoryResponse.code === 0) setCategoryStats(categoryResponse.data);

      const trendResponse = await reportApi.getTrendData(startDate, endDate);
      if (trendResponse.code === 0) setTrendData(trendResponse.data);
    } catch (error) {
      console.error('加载年度报表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPeriod = () => {
    if (reportType === 'month') {
      const date = new Date(currentMonth + '-01');
      date.setMonth(date.getMonth() - 1);
      setCurrentMonth(getMonthString(date));
    } else {
      setCurrentYear(currentYear - 1);
    }
  };

  const handleNextPeriod = () => {
    if (reportType === 'month') {
      const date = new Date(currentMonth + '-01');
      date.setMonth(date.getMonth() + 1);
      setCurrentMonth(getMonthString(date));
    } else {
      setCurrentYear(currentYear + 1);
    }
  };

  const stats = reportType === 'month' ? monthlyStats : yearlyStats;
  const totalIncome = stats?.income || 0;
  const totalExpense = stats?.expense || 0;
  const totalBalance = totalIncome - totalExpense;

  // 饼图数据（支出分类）
  const expensePieData = categoryStats
    .filter(c => c.expense > 0)
    .map(c => ({
      name: `${c.categoryIcon} ${c.categoryName}`,
      value: c.expense,
    }));

  // 趋势图数据
  const trendXAxisData = trendData.map(t => {
    const date = new Date(t.date);
    return reportType === 'month'
      ? `${date.getDate()}日`
      : `${date.getMonth() + 1}月`;
  });

  const trendSeriesData = [
    {
      name: '收入',
      data: trendData.map(t => t.income),
      color: '#34C759',
    },
    {
      name: '支出',
      data: trendData.map(t => t.expense),
      color: '#FF9500',
    },
  ];

  const periodLabel = reportType === 'month' ? currentMonth : String(currentYear);

  const expenseCategoryStats = categoryStats.filter(c => c.expense > 0);
  const maxExpense = Math.max(...expenseCategoryStats.map(c => c.expense), 1);

  return (
    <div className="report-page">
      {/* 顶部 Header */}
      <div className="report-header">
        <div className="report-header-top">
          <div>
            <div className="report-header-title">📊 报表分析</div>
            <div className="report-header-subtitle">掌握收支，理性消费</div>
          </div>
        </div>
        <div className="report-tab-bar">
          <button
            className={`report-tab ${reportType === 'month' ? 'active' : ''}`}
            onClick={() => setReportType('month')}
          >
            月度报表
          </button>
          <button
            className={`report-tab ${reportType === 'year' ? 'active' : ''}`}
            onClick={() => setReportType('year')}
          >
            年度报表
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <div className="report-content">
        {/* 时间导航 */}
        <div className="report-period-nav">
          <button className="report-period-btn" onClick={handlePrevPeriod}>‹</button>
          <span className="report-period-label">{periodLabel}</span>
          <button className="report-period-btn" onClick={handleNextPeriod}>›</button>
        </div>

        {/* 汇总卡片 */}
        <div className="report-summary-row">
          <div className="report-summary-card income-card">
            <div className="report-summary-emoji">💰</div>
            <div className="report-summary-label">收入</div>
            <div className="report-summary-amount income">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="report-summary-card expense-card">
            <div className="report-summary-emoji">💸</div>
            <div className="report-summary-label">支出</div>
            <div className="report-summary-amount expense">{formatCurrency(totalExpense)}</div>
          </div>
          <div className="report-summary-card balance-card">
            <div className="report-summary-emoji">🏦</div>
            <div className="report-summary-label">结余</div>
            <div className={`report-summary-amount ${totalBalance >= 0 ? 'balance' : 'negative'}`}>
              {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="report-loading">
            <div className="report-loading-spinner" />
            <span>数据加载中...</span>
          </div>
        ) : (
          <>
            {/* 支出分布图 */}
            <div className="report-chart-card">
              <div className="report-chart-title">
                <div className="report-chart-title-icon">🥧</div>
                支出分类分布
              </div>
              {expensePieData.length > 0 ? (
                <PieChart data={expensePieData} height={280} />
              ) : (
                <div className="report-empty">
                  <div className="report-empty-icon">📭</div>
                  <div className="report-empty-text">暂无支出数据</div>
                  <div className="report-empty-hint">记录一笔支出后就能看到分布啦</div>
                </div>
              )}
            </div>

            {/* 支出分类排行 */}
            {expenseCategoryStats.length > 0 && (
              <div className="report-chart-card">
                <div className="report-chart-title">
                  <div className="report-chart-title-icon">📋</div>
                  支出分类排行
                </div>
                <div className="category-stat-list">
                  {expenseCategoryStats
                    .sort((a, b) => b.expense - a.expense)
                    .map((item, index) => (
                      <div key={index} className="category-stat-item">
                        <div className="category-stat-icon">{item.categoryIcon}</div>
                        <div className="category-stat-info">
                          <div className="category-stat-name">{item.categoryName}</div>
                          <div className="category-stat-bar-wrap">
                            <div
                              className="category-stat-bar expense"
                              style={{ width: `${(item.expense / maxExpense) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="category-stat-amount expense">{formatCurrency(item.expense)}</div>
                        <div className="category-stat-percent">{item.percentage.toFixed(0)}%</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 收支趋势图 */}
            <div className="report-chart-card">
              <div className="report-chart-title">
                <div className="report-chart-title-icon">📈</div>
                收支趋势
              </div>
              {trendData.length > 0 ? (
                <BarChart
                  xAxisData={trendXAxisData}
                  seriesData={trendSeriesData}
                  height={280}
                />
              ) : (
                <div className="report-empty">
                  <div className="report-empty-icon">📉</div>
                  <div className="report-empty-text">暂无趋势数据</div>
                  <div className="report-empty-hint">记录更多交易后即可查看趋势</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
