import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { reportApi } from '@services/accounting';
import { getCategoryIcon } from '@utils/category-icon';
import { formatAmount } from '@utils/currency';
import './charts.css';

/* ────────────────────────────────────────────
   工具函数
──────────────────────────────────────────── */
function getWeekRange(baseDate: Date): { start: Date; end: Date } {
  // 以周一为起点
  const d = new Date(baseDate);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  return { start: d, end };
}

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function formatMD(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekLabel(start: Date) {
  // 第几周
  const now = new Date();
  const diff = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      start.getTime()) /
      (7 * 86400000)
  );
  if (diff === 0) return '本周';
  if (diff === 1) return '上周';
  if (diff === -1) return '下周';
  return `${start.getMonth() + 1}/${start.getDate()}`;
}

function getISOWeekNumber(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

/* ────────────────────────────────────────────
   类型
──────────────────────────────────────────── */
type PeriodType = 'week' | 'month' | 'year';
type TransactionType = 'expense' | 'income';

interface TrendPoint {
  date: string;
  income: number;
  expense: number;
}

interface CategoryStat {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
}

/* ────────────────────────────────────────────
   主组件
──────────────────────────────────────────── */
const ChartsPage: React.FC = () => {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('week');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  // 当前时间游标（相对偏移，0=当前）
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [yearOffset, setYearOffset] = useState(0);

  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  /* ── 时间范围计算 ── */
  const computeRange = useCallback((): { start: Date; end: Date; label: string; subLabels: string[] } => {
    const now = new Date();
    if (periodType === 'week') {
      const base = new Date(now);
      base.setDate(base.getDate() - weekOffset * 7);
      const { start, end } = getWeekRange(base);
      const subLabels: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        subLabels.push(formatMD(toDateStr(d)));
      }
      return { start, end, label: getWeekLabel(start), subLabels };
    } else if (periodType === 'month') {
      const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const subLabels: string[] = [];
      const total = end.getDate();
      for (let i = 1; i <= total; i++) {
        subLabels.push(`${i}`);
      }
      return {
        start,
        end,
        label: `${d.getFullYear()}年${d.getMonth() + 1}月`,
        subLabels,
      };
    } else {
      const year = now.getFullYear() - yearOffset;
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      const subLabels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      return { start, end, label: `${year}年`, subLabels };
    }
  }, [periodType, weekOffset, monthOffset, yearOffset]);

  /* ── 数据加载 ── */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { start, end } = computeRange();
      const [trendRes, categoryRes] = await Promise.all([
        reportApi.getTrendData(toDateStr(start), toDateStr(end)),
        reportApi.getCategoryStats(toDateStr(start), toDateStr(end)),
      ]);
      if (trendRes.code === 0) setTrendData(trendRes.data || []);
      if (categoryRes.code === 0) setCategoryStats(categoryRes.data || []);
    } catch (err) {
      console.error('图表数据加载失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [computeRange]);

  useEffect(() => { loadData(); }, [loadData]);

  // 监听记账成功事件，实时刷新图表
  useEffect(() => {
    window.addEventListener('transaction-created', loadData);
    return () => window.removeEventListener('transaction-created', loadData);
  }, [loadData]);

  /* ── ECharts 折线图 ── */
  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, { renderer: 'svg' });
    }

    const { start, subLabels } = computeRange();

    // 按日期构建数据点
    let xData: string[] = [];
    let yData: number[] = [];

    if (periodType === 'week') {
      // 7天
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = toDateStr(d);
        const point = trendData.find(t => t.date === key);
        xData.push(subLabels[i]);
        yData.push(point ? (txType === 'expense' ? point.expense : point.income) : 0);
      }
    } else if (periodType === 'month') {
      const firstDay = new Date(start);
      subLabels.forEach((label, idx) => {
        const d = new Date(firstDay);
        d.setDate(idx + 1);
        const key = toDateStr(d);
        const point = trendData.find(t => t.date === key);
        xData.push(label);
        yData.push(point ? (txType === 'expense' ? point.expense : point.income) : 0);
      });
    } else {
      // 按月聚合
      const yearVal = start.getFullYear();
      for (let m = 1; m <= 12; m++) {
        const prefix = `${yearVal}-${String(m).padStart(2, '0')}`;
        const total = trendData
          .filter(t => t.date.startsWith(prefix))
          .reduce((sum, t) => sum + (txType === 'expense' ? t.expense : t.income), 0);
        xData.push(subLabels[m - 1]);
        yData.push(parseFloat(total.toFixed(2)));
      }
    }

    const total = yData.reduce((a, b) => a + b, 0);
    const nonZero = yData.filter(v => v > 0);
    const avg = nonZero.length > 0 ? total / nonZero.length : 0;
    const maxVal = Math.max(...yData, 0);

    const primaryColor = '#FFE566';

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: { left: 0, right: 16, top: 60, bottom: 0, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1C1C1E',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `${p.axisValue}<br/>¥${p.value}`;
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#AEAEB2', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: maxVal > 0 ? Math.ceil(maxVal * 1.25) : 100,
      },
      series: [
        {
          name: txType === 'expense' ? '支出' : '收入',
          type: 'line',
          data: yData,
          smooth: false,
          symbol: 'circle',
          symbolSize: (val: number) => (val > 0 ? 8 : 5),
          lineStyle: { color: primaryColor, width: 2 },
          itemStyle: {
            color: (params: any) => (params.value > 0 ? primaryColor : '#AEAEB2'),
            borderWidth: 2,
            borderColor: primaryColor,
          },
          markLine: avg > 0 ? {
            silent: true,
            symbol: 'none',
            lineStyle: { type: 'dashed', color: '#AEAEB2', width: 1 },
            label: { show: false },
            data: [{ yAxis: avg }],
          } : undefined,
          label: {
            show: true,
            position: 'top',
            color: primaryColor,
            fontSize: 11,
            fontWeight: '600',
            formatter: (p: any) => (p.value > 0 ? `${p.value}` : ''),
          },
        },
      ],
    };

    chartInstance.current.setOption(option, true);
    chartInstance.current.resize();
  }, [trendData, txType, periodType, computeRange]);

  /* ── 窗口 resize ── */
  useEffect(() => {
    const onResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── 统计汇总 ── */
  const totalAmount = trendData.reduce(
    (sum, t) => sum + (txType === 'expense' ? t.expense : t.income),
    0
  );
  const nonZeroDays = trendData.filter(
    t => (txType === 'expense' ? t.expense : t.income) > 0
  ).length;
  const avgAmount = nonZeroDays > 0 ? totalAmount / nonZeroDays : 0;

  /* ── 分类排行 ── */
  const filteredCategory = categoryStats
    .filter(c => c.type === txType)
    .sort((a, b) => b.amount - a.amount);
  const maxCatAmount = filteredCategory[0]?.amount || 1;

  /* ── 周期选择器 Scroller ── */
  const generatePeriodItems = () => {
    const items: { label: string; offset: number }[] = [];
    for (let i = 4; i >= -2; i--) {
      const base = new Date();
      if (periodType === 'week') {
        const d = new Date(base);
        d.setDate(d.getDate() - i * 7);
        const { start: ws } = getWeekRange(d);
        const weekNo = getISOWeekNumber(ws);
        items.push({ label: i === 0 ? '本周' : i === 1 ? '上周' : `第${weekNo}周`, offset: i });
      } else if (periodType === 'month') {
        const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
        items.push({ label: i === 0 ? '本月' : `${d.getMonth() + 1}月`, offset: i });
      } else {
        const y = base.getFullYear() - i;
        items.push({ label: `${y}年`, offset: i });
      }
    }
    return items.reverse();
  };

  const currentOffset =
    periodType === 'week' ? weekOffset : periodType === 'month' ? monthOffset : yearOffset;
  const setOffset = (v: number) => {
    if (periodType === 'week') setWeekOffset(v);
    else if (periodType === 'month') setMonthOffset(v);
    else setYearOffset(v);
  };

  const periodItems = generatePeriodItems();

  return (
    <div className="charts-page">
      {/* ── 顶部黄色区域 ── */}
      <div className="charts-header">
        {/* 类型切换按钮 */}
        <div className="charts-type-switcher" onClick={() => setShowTypeMenu(!showTypeMenu)}>
          <span className="charts-type-label">
            {txType === 'expense' ? '支出' : '收入'}
          </span>
          <span className="charts-type-arrow">▾</span>
          {showTypeMenu && (
            <div className="charts-type-menu">
              <div
                className={`charts-type-option ${txType === 'expense' ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setTxType('expense'); setShowTypeMenu(false); }}
              >
                支出
              </div>
              <div
                className={`charts-type-option ${txType === 'income' ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setTxType('income'); setShowTypeMenu(false); }}
              >
                收入
              </div>
            </div>
          )}
        </div>

        {/* 周/月/年 Tab */}
        <div className="charts-period-tabs">
          {(['week', 'month', 'year'] as PeriodType[]).map(p => (
            <button
              key={p}
              className={`charts-period-tab ${periodType === p ? 'active' : ''}`}
              onClick={() => setPeriodType(p)}
            >
              {p === 'week' ? '周' : p === 'month' ? '月' : '年'}
            </button>
          ))}
        </div>

        {/* 时间段滚动选择器 */}
        <div className="charts-period-scroller">
          {periodItems.map(item => (
            <button
              key={item.offset}
              className={`charts-period-item ${currentOffset === item.offset ? 'active' : ''}`}
              onClick={() => setOffset(item.offset)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 内容区 ── */}
      <div className="charts-body">
        {/* 汇总信息 */}
        <div className="charts-summary">
          <span className="charts-summary-label">
            总{txType === 'expense' ? '支出' : '收入'}：
            <span className="charts-summary-amount">{formatAmount(totalAmount, 2)}</span>
          </span>
          <span className="charts-summary-avg">
            平均值：{formatAmount(avgAmount, 2)}
          </span>
        </div>

        {/* 折线图 */}
        <div className="charts-line-wrap">
          {isLoading ? (
            <div className="charts-loading">
              <div className="charts-spinner" />
            </div>
          ) : (
            <div ref={chartRef} style={{ width: '100%', height: 220 }} />
          )}
        </div>

        {/* 排行榜 */}
        <div className="charts-rank-section">
          <div className="charts-rank-title">
            {txType === 'expense' ? '支出' : '收入'}排行榜
          </div>
          {filteredCategory.length === 0 ? (
            <div className="charts-empty">
              <div className="charts-empty-icon-bg">📊</div>
              <div className="charts-empty-text">暂无数据</div>
              <div className="charts-empty-sub">记录更多账单后{'\n'}这里将展示分类统计</div>
            </div>
          ) : (
            <div className="charts-rank-list">
              {filteredCategory.map((cat, idx) => {
                const pct = ((cat.amount / filteredCategory.reduce((s, c) => s + c.amount, 0)) * 100).toFixed(1);
                const barWidth = (cat.amount / maxCatAmount) * 100;
                const { start, end } = computeRange();
                return (
                  <div
                    key={cat.id}
                    className="charts-rank-item charts-rank-item-tappable"
                    onClick={() => navigate('/search', {
                      state: {
                        categoryId: cat.id,
                        categoryName: cat.name,
                        type: txType,
                        startDate: toDateStr(start),
                        endDate: toDateStr(end),
                      },
                    })}
                  >
                    <div className="charts-rank-icon-wrap">
                      <span className="charts-rank-icon">{getCategoryIcon(cat.name)}</span>
                    </div>
                    <div className="charts-rank-info">
                      <div className="charts-rank-top">
                        <span className="charts-rank-name">{cat.name}</span>
                        <span className="charts-rank-pct">{pct}%</span>
                        <span className="charts-rank-amount">{formatAmount(cat.amount, 2)}</span>
                      </div>
                      <div className="charts-rank-bar-bg">
                        <div
                          className="charts-rank-bar-fill"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <span className="charts-rank-chevron">›</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
