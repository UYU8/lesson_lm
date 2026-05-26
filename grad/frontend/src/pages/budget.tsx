import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import { budgetApi, categoryApi, reportApi } from '@services/accounting';
import { Category } from '@types/index';
import { formatCurrency } from '@utils/currency';
import { getCategoryIcon } from '@utils/category-icon';
import './budget.css';

interface BudgetStatus {
  budgetId: string;
  categoryId: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  isExceeded: boolean;
}

interface BudgetWithStatus extends BudgetStatus {
  categoryName: string;
  categoryIcon: string;
}

interface InsightItem {
  id: string;
  categoryName: string;
  categoryIcon: string;
  thisMonth: number;
  lastMonth: number;
  diff: number;
}

function getMonthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function generateMonthItems(now: string) {
  const [ny, nm] = now.split('-').map(Number);
  const items: { label: string; value: string }[] = [];
  for (let i = 5; i >= -1; i--) {
    let m = nm - i;
    let y = ny;
    while (m <= 0) { m += 12; y--; }
    while (m > 12) { m -= 12; y++; }
    const value = `${y}-${String(m).padStart(2, '0')}`;
    let label: string;
    if (i === 0) label = '本月';
    else if (i === 1) label = '上月';
    else if (y === ny) label = `${m}月`;
    else label = `${y}年${m}月`;
    items.push({ label, value });
  }
  return items;
}

const TOTAL_KEY = (ym: string) => `shark_total_budget_${ym}`;

const getProgressClass = (pct: number) =>
  pct >= 100 ? 'exceeded' : pct >= 80 ? 'warning' : 'normal';

export const BudgetPage: React.FC = () => {
  const nowMonth = getMonthString(new Date());
  const [currentMonth, setCurrentMonth] = useState(nowMonth);
  const [budgets, setBudgets] = useState<BudgetWithStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 总预算
  const [totalBudget, setTotalBudget] = useState(0);
  const [editingTotal, setEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState('');

  // 洞察
  const [insights, setInsights] = useState<InsightItem[]>([]);

  // 添加 Sheet
  const [showSheet, setShowSheet] = useState(false);
  const [sheetStep, setSheetStep] = useState<'category' | 'amount'>('category');
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [suggested, setSuggested] = useState(0);

  // ECharts
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInst = useRef<echarts.ECharts | null>(null);

  // 月份滚动：当月切换时自动滚到对应位置
  const scrollerRef = useRef<HTMLDivElement>(null);
  const monthItems = generateMonthItems(nowMonth);

  // 读取总预算
  useEffect(() => {
    const stored = localStorage.getItem(TOTAL_KEY(currentMonth));
    const val = stored ? parseFloat(stored) : 0;
    setTotalBudget(val);
    setTotalInput(stored || '');
    setEditingTotal(false);
  }, [currentMonth]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getAllCategories();
      if (res.code === 0) {
        const { income = [], expense = [] } = res.data;
        setCategories([...income, ...expense]);
      }
    } catch (_) {}
  }, []);

  const loadBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await budgetApi.getMonthlyBudgetStatus(currentMonth);
      if (res.code === 0) {
        const enriched: BudgetWithStatus[] = res.data.map((s: BudgetStatus) => {
          const cat = categories.find(c => c.id === s.categoryId);
          return { ...s, categoryName: cat?.name || '未知', categoryIcon: (cat as any)?.icon || '📁' };
        });
        setBudgets(enriched);
      }
    } catch (_) {} finally {
      setIsLoading(false);
    }
  }, [currentMonth, categories]);

  const loadInsights = useCallback(async () => {
    try {
      const [y, m] = currentMonth.split('-').map(Number);
      const thisStart = new Date(y, m - 1, 1);
      const thisEnd = new Date(y, m, 0);
      const lastStart = new Date(y, m - 2, 1);
      const lastEnd = new Date(y, m - 1, 0);

      const [thisRes, lastRes] = await Promise.all([
        reportApi.getCategoryStats(toDateStr(thisStart), toDateStr(thisEnd)),
        reportApi.getCategoryStats(toDateStr(lastStart), toDateStr(lastEnd)),
      ]);

      if (thisRes.code === 0 && lastRes.code === 0) {
        const thisStats = (thisRes.data as any[]).filter(c => c.type === 'expense');
        const lastStats = (lastRes.data as any[]).filter(c => c.type === 'expense');

        const items: InsightItem[] = thisStats
          .map(c => {
            const last = lastStats.find((l: any) => l.id === c.id);
            return {
              id: c.id,
              categoryName: c.name,
              categoryIcon: c.icon || '📁',
              thisMonth: c.amount,
              lastMonth: last?.amount || 0,
              diff: c.amount - (last?.amount || 0),
            };
          })
          .filter(i => i.lastMonth > 0)
          .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
          .slice(0, 3);

        setInsights(items);
      }
    } catch (_) {}
  }, [currentMonth]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      loadBudgets();
      loadInsights();
    }
  }, [loadBudgets, loadInsights, categories.length]);

  // 监听记账事件刷新
  useEffect(() => {
    window.addEventListener('transaction-created', loadBudgets as any);
    return () => window.removeEventListener('transaction-created', loadBudgets as any);
  }, [loadBudgets]);

  // ECharts 对比图
  useEffect(() => {
    if (!chartRef.current || budgets.length === 0) return;
    if (!chartInst.current) {
      chartInst.current = echarts.init(chartRef.current, undefined, { renderer: 'svg' });
    }
    const names = budgets.map(b => b.categoryName);
    const budgetVals = budgets.map(b => b.budgetAmount);
    const spentVals = budgets.map(b => b.spentAmount);

    chartInst.current.setOption({
      backgroundColor: 'transparent',
      grid: { left: 0, right: 8, top: 36, bottom: 0, containLabel: true },
      legend: {
        top: 4, right: 4,
        itemWidth: 10, itemHeight: 10,
        textStyle: { fontSize: 11, color: '#6C6C70' },
        data: ['预算', '实际'],
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1C1C1E',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: any) =>
          `${params[0].axisValue}<br/>预算 ¥${params[0].value}<br/>实际 ¥${params[1].value}`,
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#AEAEB2', fontSize: 10 },
      },
      yAxis: { type: 'value', show: false },
      series: [
        {
          name: '预算',
          type: 'bar',
          data: budgetVals,
          barMaxWidth: 18,
          barGap: '10%',
          itemStyle: { color: '#FFE566', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '实际',
          type: 'bar',
          data: spentVals,
          barMaxWidth: 18,
          itemStyle: {
            color: (p: any) => spentVals[p.dataIndex] > budgetVals[p.dataIndex] ? '#FF3B30' : '#34C759',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }, true);
    chartInst.current.resize();
  }, [budgets]);

  useEffect(() => {
    const onResize = () => chartInst.current?.resize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 总预算保存
  const saveTotalBudget = () => {
    const val = parseFloat(totalInput) || 0;
    localStorage.setItem(TOTAL_KEY(currentMonth), String(val));
    setTotalBudget(val);
    setEditingTotal(false);
  };

  // 建议金额
  const loadSuggestion = async (catId: string) => {
    try {
      const res = await budgetApi.getSuggestion(catId, currentMonth);
      if (res.code === 0) setSuggested(res.data.suggested);
      else setSuggested(0);
    } catch (_) { setSuggested(0); }
  };

  const handleSelectCat = (cat: Category) => {
    setSelectedCat(cat);
    setSheetStep('amount');
    setAddAmount('');
    setSuggested(0);
    loadSuggestion(cat.id);
  };

  const handleAddBudget = async () => {
    if (!selectedCat || !addAmount || parseFloat(addAmount) <= 0) return;
    const [year, month] = currentMonth.split('-');
    try {
      const res = await budgetApi.createBudget({
        categoryId: selectedCat.id,
        amount: parseFloat(addAmount),
        year: parseInt(year),
        month: parseInt(month),
      });
      if (res.code === 0) {
        setShowSheet(false);
        setSheetStep('category');
        setSelectedCat(null);
        setAddAmount('');
        loadBudgets();
      }
    } catch (_) {}
  };

  const handleDelete = async (budgetId: string) => {
    if (!window.confirm('确定删除这个预算？')) return;
    await budgetApi.deleteBudget(budgetId);
    loadBudgets();
  };

  const openSheet = () => {
    setSheetStep('category');
    setSelectedCat(null);
    setAddAmount('');
    setShowSheet(true);
  };

  // 可用分类（支出、未设预算），去重 + 按 icon a-z 排序，other 排最后
  const availableCats = (() => {
    const seen = new Set<string>();
    return categories
      .filter((c: any) => c.type === 'expense')
      .filter(c => !budgets.some(b => b.categoryId === c.id))
      .filter((c: any) => { if (seen.has(c.icon)) return false; seen.add(c.icon); return true; })
      .sort((a: any, b: any) => {
        if (a.icon === 'other') return 1;
        if (b.icon === 'other') return -1;
        return a.icon.localeCompare(b.icon);
      });
  })();

  // 总预算进度
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);
  const totalPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const totalRemain = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      {/* 黄色 Header */}
      <div className="budget-header">
        <div className="budget-header-top">
          <span className="budget-header-title">预算</span>
          <button className="budget-fab" onClick={openSheet}>+</button>
        </div>
        <div className="budget-month-scroller" ref={scrollerRef}>
          {monthItems.map(item => (
            <button
              key={item.value}
              className={`budget-month-item${currentMonth === item.value ? ' active' : ''}`}
              onClick={() => setCurrentMonth(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 白色内容区 */}
      <div className="budget-body">

        {/* C: 总预算 */}
        <div className="budget-total-card">
          <div className="budget-total-head">
            <span className="budget-total-label">月总预算</span>
            {!editingTotal ? (
              <button className="budget-total-action" onClick={() => setEditingTotal(true)}>
                {totalBudget > 0 ? '修改' : '设置'}
              </button>
            ) : (
              <button className="budget-total-action save" onClick={saveTotalBudget}>保存</button>
            )}
          </div>
          {editingTotal ? (
            <input
              className="budget-total-input"
              type="number"
              placeholder="输入月总预算"
              value={totalInput}
              onChange={e => setTotalInput(e.target.value)}
              autoFocus
            />
          ) : totalBudget > 0 ? (
            <>
              <div className="budget-total-amounts">
                <span className="budget-total-spent">{formatCurrency(totalSpent)}</span>
                <span className="budget-total-sep">/</span>
                <span className="budget-total-budget">{formatCurrency(totalBudget)}</span>
              </div>
              <div className="budget-total-bar-bg">
                <div
                  className={`budget-total-bar-fill ${getProgressClass(totalPct)}`}
                  style={{ width: `${totalPct}%` }}
                />
              </div>
              <div className={`budget-total-remain ${totalRemain < 0 ? 'over' : ''}`}>
                {totalRemain >= 0
                  ? `剩余 ${formatCurrency(totalRemain)}`
                  : `超支 ${formatCurrency(-totalRemain)}`}
              </div>
            </>
          ) : (
            <div className="budget-total-placeholder">设置总预算，掌控整体支出</div>
          )}
        </div>

        {/* D: 预算 vs 实际对比图 */}
        {budgets.length > 0 && (
          <div className="budget-chart-section">
            <div className="budget-section-label">预算 vs 实际</div>
            {isLoading ? (
              <div className="budget-chart-loading"><div className="budget-spinner" /></div>
            ) : (
              <div ref={chartRef} style={{ width: '100%', height: 190 }} />
            )}
          </div>
        )}

        {/* A: 洞察 */}
        {insights.length > 0 && (
          <div className="budget-insight-section">
            <div className="budget-section-label">本月洞察</div>
            {insights.map((item, i) => (
              <div key={i} className={`budget-insight-item${item.diff > 0 ? ' up' : ' down'}`}>
                <span className="budget-insight-icon">{getCategoryIcon(item.categoryName)}</span>
                <span className="budget-insight-name">{item.categoryName}</span>
                <span className="budget-insight-diff">
                  {item.diff > 0
                    ? `↑ 比上月多 ${formatCurrency(item.diff)}`
                    : `↓ 比上月省 ${formatCurrency(-item.diff)}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 分类预算列表 */}
        <div className="budget-list-section">
          <div className="budget-section-label">分类预算</div>
          {isLoading && budgets.length === 0 ? (
            <div className="budget-list-loading"><div className="budget-spinner" /></div>
          ) : budgets.length === 0 ? (
            <div className="budget-empty">
              <div className="budget-empty-icon">🎯</div>
              <div className="budget-empty-text">还没有预算</div>
              <div className="budget-empty-hint">点击右上角 + 添加分类预算</div>
            </div>
          ) : (
            budgets.map(b => {
              const pct = b.percentage;
              const cls = getProgressClass(pct);
              return (
                <div key={b.budgetId} className={`budget-item${b.isExceeded ? ' exceeded' : ''}`}>
                  <div className="budget-item-main">
                    <div className="budget-item-icon-wrap">
                      <span className="budget-item-emoji">{getCategoryIcon(b.categoryName)}</span>
                    </div>
                    <div className="budget-item-info">
                      <div className="budget-item-top">
                        <span className="budget-item-name">{b.categoryName}</span>
                        <span className="budget-item-amount">{formatCurrency(b.spentAmount)}</span>
                      </div>
                      <div className="budget-item-bar-bg">
                        <div
                          className={`budget-item-bar-fill ${cls}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="budget-item-bottom">
                        {b.isExceeded ? (
                          <span className="budget-exceeded-tag">超支 {formatCurrency(b.spentAmount - b.budgetAmount)}</span>
                        ) : (
                          <>
                            <span className={`budget-item-pct ${cls}`}>{pct.toFixed(0)}%</span>
                            <span className="budget-item-remain">剩 {formatCurrency(b.remainingAmount)}</span>
                          </>
                        )}
                        <span className="budget-item-total-hint">预算 {formatCurrency(b.budgetAmount)}</span>
                      </div>
                    </div>
                    <button className="budget-item-del" onClick={() => handleDelete(b.budgetId)}>✕</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* B: 添加预算 Bottom Sheet */}
      {showSheet && (
        <div className="budget-sheet-mask" onClick={() => setShowSheet(false)}>
          <div className="budget-sheet" onClick={e => e.stopPropagation()}>
            <div className="budget-sheet-handle" />

            {sheetStep === 'category' ? (
              <>
                <div className="budget-sheet-title">选择分类</div>
                {availableCats.length === 0 ? (
                  <div className="budget-sheet-empty">所有分类已设置预算</div>
                ) : (
                  <div className="budget-sheet-cats">
                    {availableCats.map(cat => (
                      <button key={cat.id} className="budget-sheet-cat" onClick={() => handleSelectCat(cat)}>
                        <div className="budget-sheet-cat-icon">{getCategoryIcon(cat.name)}</div>
                        <div className="budget-sheet-cat-name">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="budget-sheet-title">
                  <button className="budget-sheet-back" onClick={() => setSheetStep('category')}>‹</button>
                  {selectedCat?.name}的预算
                </div>
                {suggested > 0 && (
                  <div className="budget-sheet-suggest" onClick={() => setAddAmount(String(suggested))}>
                    💡 建议金额 {formatCurrency(suggested)}（近3月均值，点击填入）
                  </div>
                )}
                <div className="budget-sheet-amount-row">
                  <span className="budget-sheet-currency">¥</span>
                  <input
                    className="budget-sheet-amount-input"
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={e => setAddAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  className="budget-sheet-confirm"
                  onClick={handleAddBudget}
                  disabled={!addAmount || parseFloat(addAmount) <= 0}
                >
                  确定
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
