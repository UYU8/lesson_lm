/**
 * QuickAddSheet - 记账底部弹窗
 * 第一屏：支出/收入分类选择（全部分类含默认）
 * 第二屏：金额输入（自定义数字键盘）
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { categoryApi, transactionApi } from '@services/accounting';
import { Category, Transaction } from '@types/index';
import { getCategoryIcon } from '@utils/category-icon';
import './quick-add-sheet.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:7001/api';

// 压缩图片到 base64，最长边不超过 1024px
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ─────────────────────────────────────────
   数字键盘
───────────────────────────────────────── */
const KEYS = [
  ['7', '8', '9', 'date'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '-'],
  ['.', '0', 'del', 'ok'],
];

interface NumpadProps {
  value: string;
  date: string;
  note: string;
  onValue: (v: string) => void;
  onDateChange: (d: string) => void;
  onNoteChange: (n: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const Numpad: React.FC<NumpadProps> = ({
  value, date, note, onValue, onDateChange, onNoteChange, onSubmit, loading,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dateLabel =
    date === todayStr ? '今天' :
    date === yesterdayStr ? '昨天' :
    date.slice(5).replace('-', '/');

  const press = (key: string) => {
    if (key === 'del') { onValue(value.slice(0, -1)); return; }
    if (key === 'ok') { onSubmit(); return; }
    if (key === 'date') { setShowDatePicker(true); return; }
    if (key === '+' || key === '-') return;
    if (key === '.' && value.includes('.')) return;
    if (value.includes('.') && value.split('.')[1]?.length >= 2) return;
    if (!value.includes('.') && value.replace(/^0/, '').length >= 7 && key !== '.') return;
    if (value === '0' && key !== '.') { onValue(key); return; }
    onValue((value || '') + key);
  };

  return (
    <div className="qs-numpad-wrap">
      <div className="qs-amount-display">
        <span className="qs-amount-currency">¥</span>
        <span className="qs-amount-value">{value || '0'}</span>
        <span className="qs-amount-cursor" />
      </div>

      <div className="qs-note-row">
        <span className="qs-note-label">备注:</span>
        <input
          className="qs-note-input"
          placeholder="点击填写备注"
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          onFocus={e => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
        />
      </div>

      <div className="qs-keypad">
        {KEYS.map((row, ri) => (
          <div key={ri} className="qs-keypad-row">
            {row.map(key => {
              const isOk = key === 'ok';
              const isDel = key === 'del';
              const isDate = key === 'date';
              return (
                <button
                  key={key}
                  className={`qs-key ${isOk ? 'qs-key-ok' : ''} ${isDel ? 'qs-key-del' : ''} ${isDate ? 'qs-key-date' : ''}`}
                  onClick={() => press(key)}
                  disabled={isOk && loading}
                >
                  {isOk ? (loading ? '...' : '完成') :
                   isDel ? '⌫' :
                   isDate ? `📅 ${dateLabel}` :
                   key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {showDatePicker && (
        <div className="qs-date-picker-mask" onClick={() => setShowDatePicker(false)}>
          <div className="qs-date-picker-wrap" onClick={e => e.stopPropagation()}>
            <div className="qs-date-picker-title">选择日期</div>
            <input
              type="date"
              className="qs-date-native"
              value={date}
              max={todayStr}
              onChange={e => { onDateChange(e.target.value); setShowDatePicker(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   主组件
───────────────────────────────────────── */
interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (tx: Transaction) => void;
}

type Step = 'category' | 'amount';

const QuickAddSheet: React.FC<QuickAddSheetProps> = ({ visible, onClose, onSuccess }) => {
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  // allCategories 存所有分类（含默认），按 type 分组
  const [allCategories, setAllCategories] = useState<{ expense: Category[]; income: Category[] }>({
    expense: [],
    income: [],
  });
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [step, setStep] = useState<Step>('category');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrHint, setOcrHint] = useState('');
  const loadedRef = useRef(false);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  // 动画入场
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  // 键盘弹起时上移 overlay，防止遮住输入框
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !visible) return;
    const handler = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    };
    vv.addEventListener('resize', handler);
    vv.addEventListener('scroll', handler);
    return () => {
      vv.removeEventListener('resize', handler);
      vv.removeEventListener('scroll', handler);
      setKeyboardOffset(0);
    };
  }, [visible]);

  // 加载所有分类（含默认），只加载一次
  useEffect(() => {
    if (!visible || loadedRef.current) return;
    loadedRef.current = true;

    const loadCategories = async () => {
      try {
        // 先自动补充默认分类（已注册老用户兼容）
        await categoryApi.initDefaults().catch(() => {});
        // 再获取所有分类（按 expense/income 分组）
        const res = await categoryApi.getAllCategories();
        if (res.data) {
          const raw = res.data as any;
          if (Array.isArray(raw)) {
            setAllCategories({
              expense: raw.filter((c: Category) => c.type === 'expense'),
              income: raw.filter((c: Category) => c.type === 'income'),
            });
          } else {
            setAllCategories({
              expense: raw.expense || [],
              income: raw.income || [],
            });
          }
        }
      } catch {
        // 降级：直接加载用户分类
        const res = await categoryApi.getCategories().catch(() => ({ data: [] }));
        const list = (res.data || []) as Category[];
        setAllCategories({
          expense: list.filter(c => c.type === 'expense'),
          income: list.filter(c => c.type === 'income'),
        });
      }
    };

    loadCategories();
  }, [visible]);

  // 切换收/支重置状态
  useEffect(() => {
    setSelectedCat(null);
    setStep('category');
    setAmount('');
    setNote('');
    setError('');
  }, [txType]);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(() => {
      onClose();
      setStep('category');
      setSelectedCat(null);
      setAmount('');
      setNote('');
      setError('');
    }, 300);
  }, [onClose]);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCat(cat);
    setStep('amount');
    setAmount('');
    setNote('');
    setError('');
  };

  const handleBack = () => {
    setStep('category');
    setSelectedCat(null);
  };

  const handleOcrClick = () => ocrInputRef.current?.click();

  const handleOcrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setOcrLoading(true);
    setOcrHint('正在识别账单...');
    setError('');

    try {
      const imageBase64 = await compressImage(file);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/chat/ocr-bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ imageBase64 }),
      });
      const json = await res.json();
      if (json.code !== 0) throw new Error(json.message || '识别失败');

      const { amount, type, categoryName, description, date } = json.data;

      // 切换收/支类型
      if (type === 'income' || type === 'expense') setTxType(type);

      // 匹配分类
      const cats = type === 'income' ? allCategories.income : allCategories.expense;
      const matched = cats.find(c =>
        c.name === categoryName ||
        categoryName?.includes(c.name) ||
        c.name.includes(categoryName ?? '')
      ) || null;

      // 填充数据
      if (amount) setAmount(String(parseFloat(amount).toFixed(2)));
      if (description) setNote(description);
      if (date) setDate(date);
      if (matched) setSelectedCat(matched);

      setOcrHint(`识别完成：${categoryName ?? ''} ¥${amount ?? ''}`);
      setStep('amount');
    } catch (err: any) {
      setError('识别失败：' + (err.message || '请重试'));
      setOcrHint('');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('请输入金额'); return; }
    if (!selectedCat) return;
    setLoading(true);
    setError('');
    try {
      const res = await transactionApi.createTransaction({
        categoryId: selectedCat.id,
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        type: txType,
        description: note || undefined,
        transactionDate: date,
      });
      if (res.data) {
        onSuccess?.(res.data);
        handleClose();
      }
    } catch (e: any) {
      setError(e?.message || '记录失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredCats = (() => {
    const seen = new Set<string>();
    return (allCategories[txType] || [])
      .filter(c => { if (seen.has(c.icon)) return false; seen.add(c.icon); return true; })
      .sort((a, b) => {
        if (a.icon === 'other') return 1;
        if (b.icon === 'other') return -1;
        return a.icon.localeCompare(b.icon);
      });
  })();

  if (!visible && !mounted) return null;

  return (
    <div
      className={`qs-overlay ${mounted && visible ? 'qs-overlay-in' : 'qs-overlay-out'}`}
      style={{ bottom: keyboardOffset }}
      onClick={handleClose}
    >
      <div
        className={`qs-sheet ${mounted && visible ? 'qs-sheet-in' : 'qs-sheet-out'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── 黄色顶部 Header ── */}
        <div className="qs-header">
          <div className="qs-header-tabs">
            <button
              className={`qs-header-tab ${txType === 'expense' ? 'active' : ''}`}
              onClick={() => setTxType('expense')}
            >
              支出
            </button>
            <button
              className={`qs-header-tab ${txType === 'income' ? 'active' : ''}`}
              onClick={() => setTxType('income')}
            >
              收入
            </button>
          </div>
          <button className="qs-cancel-btn" onClick={handleClose}>取消</button>
        </div>

        {/* ── 内容区 ── */}
        {step === 'category' ? (
          <div className="qs-body qs-body-scroll">
            {/* 拍照识别入口 */}
            <input
              ref={ocrInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleOcrFile}
            />
            <button
              className={`qs-ocr-btn${ocrLoading ? ' loading' : ''}`}
              onClick={handleOcrClick}
              disabled={ocrLoading}
            >
              {ocrLoading ? (
                <><span className="qs-ocr-spinner" /> 识别中...</>
              ) : (
                <><span className="qs-ocr-icon">📷</span> 拍照 / 上传账单识别</>
              )}
            </button>
            {ocrHint && <div className="qs-ocr-hint">{ocrHint}</div>}
            <div className="qs-cat-grid">
              {filteredCats.length === 0 ? (
                <div className="qs-empty">暂无分类，请先在分类管理中添加</div>
              ) : (
                filteredCats.map(cat => (
                  <button
                    key={cat.id}
                    className="qs-cat-item"
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <div className="qs-cat-icon-wrap">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="qs-cat-name">{cat.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="qs-body qs-body-amount">
            {/* 迷你横向分类栏 */}
            <div className="qs-cat-mini-bar">
              <button className="qs-back-btn" onClick={handleBack}>‹ 返回</button>
              <div className="qs-cat-mini-list">
                {filteredCats.map(cat => (
                  <button
                    key={cat.id}
                    className={`qs-cat-mini-item ${selectedCat?.id === cat.id ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <div className="qs-cat-mini-icon">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="qs-cat-mini-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="qs-error">{error}</div>}

            <Numpad
              value={amount}
              date={date}
              note={note}
              onValue={setAmount}
              onDateChange={setDate}
              onNoteChange={setNote}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAddSheet;
