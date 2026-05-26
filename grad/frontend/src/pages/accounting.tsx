/**
 * 记账页面 - 鲨鱼记账风格升级版
 */

import React, { useState, useCallback } from 'react';
import { QuickEntryForm, TransactionList, StatisticsCard } from '@components/accounting';
import { Transaction } from '@types/index';
import './accounting.css';

const AccountingPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');

  const handleRecordSuccess = useCallback((transaction: Transaction) => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleSelectTransaction = useCallback((transaction: Transaction) => {
    console.log('Selected transaction:', transaction);
  }, []);

  const openForm = (type: 'income' | 'expense') => {
    setFormType(type);
    setShowForm(true);
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <div className="accounting-page">
      {/* 顶部渐变区域 */}
      <div className="accounting-stats-wrap">
        <div className="accounting-top-header">
          <div className="accounting-header-content">
            <div>
              <div className="accounting-greeting">{greeting}，准备记账了吗？</div>
              <div className="accounting-title">我的账本</div>
            </div>
          </div>
        </div>
        <StatisticsCard type="monthly" refreshTrigger={refreshTrigger} />
      </div>

      {/* 白色主内容区 */}
      <div className="accounting-main-content">

        {/* 快速记录操作区 */}
        <div className="accounting-quick-actions">
          <div className="quick-actions-label">快速记录</div>
          <div className="quick-actions-row">
            {/* 支出按钮 */}
            <button
              className="quick-action-btn expense"
              onClick={() => openForm('expense')}
            >
              <div className="quick-action-icon">💸</div>
              <div className="quick-action-text">记支出</div>
              <div className="quick-action-sub">日常消费</div>
            </button>
            {/* 收入按钮 */}
            <button
              className="quick-action-btn income"
              onClick={() => openForm('income')}
            >
              <div className="quick-action-icon">💰</div>
              <div className="quick-action-text">记收入</div>
              <div className="quick-action-sub">工资奖金</div>
            </button>
          </div>

          {/* 快捷金额提示卡片 */}
          <div className="quick-tips-row">
            <div className="quick-tip-chip" onClick={() => openForm('expense')}>🍜 午饭</div>
            <div className="quick-tip-chip" onClick={() => openForm('expense')}>🚌 交通</div>
            <div className="quick-tip-chip" onClick={() => openForm('expense')}>☕ 咖啡</div>
            <div className="quick-tip-chip" onClick={() => openForm('income')}>💼 工资</div>
          </div>
        </div>

        {/* 流水记录 */}
        <div className="accounting-list-wrap">
          <div className="accounting-section-header">
            <div className="accounting-section-title">最近账单</div>
          </div>
          <TransactionList
            refreshTrigger={refreshTrigger}
            onSelectTransaction={handleSelectTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </div>

      {/* 底部弹出记录面板 */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div
            className="form-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖动条 */}
            <div className="form-sheet-handle" />
            {/* 标题栏 */}
            <div className="form-sheet-header">
              <span className="form-sheet-title">
                {formType === 'expense' ? '💸 记一笔支出' : '💰 记一笔收入'}
              </span>
              <button
                className="form-sheet-close"
                onClick={() => setShowForm(false)}
              >✕</button>
            </div>
            <QuickEntryForm
              defaultType={formType}
              onSuccess={handleRecordSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingPage;
