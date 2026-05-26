/**
 * 快速录入表单组件 - 现代 App 风格
 */

import React, { useState, useEffect } from 'react';
import { Category, Tag, CreateTransactionRequest, Transaction } from '@types/index';
import { categoryApi, tagApi, transactionApi } from '@services/accounting';
import { formatDate } from '@utils/date';
import './quick-entry-form.css';

interface QuickEntryFormProps {
  onSuccess?: (transaction: Transaction) => void;
  onError?: (error: string) => void;
  defaultType?: 'income' | 'expense';
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍜', transport: '🚌', entertainment: '🎮', shopping: '🛍️',
  medical: '💊', other: '📦', salary: '💼', bonus: '🎁',
  parttime: '💡', income: '💰', expense: '💸',
};

const QuickEntryForm: React.FC<QuickEntryFormProps> = ({
  onSuccess,
  onError,
  defaultType = 'expense',
}) => {
  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(formatDate(new Date()));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { setCategoryId(''); }, [type]);

  const loadData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([categoryApi.getCategories(), tagApi.getTags()]);
      if (catRes.data) setCategories(catRes.data);
      if (tagRes.data) setTags(tagRes.data);
    } catch (err) {
      setError('加载数据失败');
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  const dayBefore = formatDate(new Date(Date.now() - 172800000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!amount || parseFloat(amount) <= 0) { setError('请输入有效金额'); return; }
    if (!categoryId) { setError('请选择分类'); return; }

    try {
      setLoading(true);
      const data: CreateTransactionRequest = {
        categoryId, amount: parseFloat(amount), type,
        description: description || undefined,
        transactionDate,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      };
      const response = await transactionApi.createTransaction(data);
      if (response.data) {
        setSuccess('记录成功！');
        setAmount(''); setCategoryId(''); setDescription('');
        setTransactionDate(formatDate(new Date())); setSelectedTags([]);
        onSuccess?.(response.data);
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '记录失败';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  };

  return (
    <form className="quick-entry-form" onSubmit={handleSubmit}>
      {/* 收支类型切换 */}
      <div className="type-tab-bar">
        <button
          type="button"
          className={`type-tab expense ${type === 'expense' ? 'active' : ''}`}
          onClick={() => setType('expense')}
        >
          💸 支出
        </button>
        <button
          type="button"
          className={`type-tab income ${type === 'income' ? 'active' : ''}`}
          onClick={() => setType('income')}
        >
          💰 收入
        </button>
      </div>

      {/* 金额输入 */}
      <div className="amount-section">
        <div className="amount-label">金额（元）</div>
        <div className="amount-input-row">
          <span className="amount-currency">¥</span>
          <input
            type="number"
            className="amount-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            autoFocus
          />
        </div>
        {/* 快捷金额 */}
        <div className="amount-shortcuts">
          {[10, 20, 50, 100].map((v) => (
            <button
              key={v}
              type="button"
              className="amount-shortcut-btn"
              onClick={() => setAmount(String(v))}
            >¥{v}</button>
          ))}
        </div>
      </div>

      <div className="form-body">
        {/* 分类 */}
        <div className="form-row">
          <div className="form-row-label">选择分类</div>
          <div className="category-grid">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className={`category-chip ${categoryId === cat.id ? 'active' : ''}`}
                onClick={() => setCategoryId(cat.id)}
                style={categoryId === cat.id ? { borderColor: cat.color || 'var(--color-primary)', backgroundColor: `${cat.color}18` } : {}}
              >
                <span className="category-chip-icon">
                  {CATEGORY_ICONS[cat.icon || ''] || CATEGORY_ICONS[cat.type] || '📌'}
                </span>
                <span className="category-chip-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 日期快捷 */}
        <div className="form-row">
          <div className="form-row-label">日期</div>
          <div className="date-chips">
            <button type="button" className={`date-chip ${transactionDate === today ? 'active' : ''}`} onClick={() => setTransactionDate(today)}>今天</button>
            <button type="button" className={`date-chip ${transactionDate === yesterday ? 'active' : ''}`} onClick={() => setTransactionDate(yesterday)}>昨天</button>
            <button type="button" className={`date-chip ${transactionDate === dayBefore ? 'active' : ''}`} onClick={() => setTransactionDate(dayBefore)}>前天</button>
            <label className={`date-chip date-chip-custom ${![today, yesterday, dayBefore].includes(transactionDate) ? 'active' : ''}`}>
              📅
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="form-row">
            <div className="form-row-label">标签（可选）</div>
            <div className="tag-chips">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-chip ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag.id)}
                  style={selectedTags.includes(tag.id) ? { borderColor: tag.color || 'var(--color-primary)', color: tag.color || 'var(--color-primary)' } : {}}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 备注 */}
        <div className="form-row">
          <div className="form-row-label">备注（可选）</div>
          <textarea
            className="note-input"
            placeholder="添加备注，让记录更清晰..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 提示 */}
        {error && <div className="form-error-msg"><span>⚠️</span>{error}</div>}
        {success && <div className="form-success-msg"><span>✅</span>{success}</div>}
      </div>

      {/* 提交按钮 */}
      <div className="submit-area">
        <button
          type="submit"
          className={`submit-btn ${type}`}
          disabled={loading || !amount || !categoryId}
        >
          {loading ? <><span className="spinner"></span> 记录中...</> : `记录${type === 'expense' ? '支出' : '收入'}`}
        </button>
      </div>
    </form>
  );
};

export default QuickEntryForm;
