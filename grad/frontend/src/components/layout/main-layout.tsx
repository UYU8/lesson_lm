import React, { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabNavigation from './tab-navigation';
import QuickAddSheet from '@components/accounting/quick-add-sheet';
import { Transaction } from '@types/index';
import './main-layout.css';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [quickAddVisible, setQuickAddVisible] = useState(false);

  const handleOpenQuickAdd = useCallback(() => {
    setQuickAddVisible(true);
  }, []);

  const handleCloseQuickAdd = useCallback(() => {
    setQuickAddVisible(false);
  }, []);

  const handleQuickAddSuccess = useCallback((tx: Transaction) => {
    // 可通过 Context / EventEmitter 通知其他页面刷新
    window.dispatchEvent(new CustomEvent('transaction-created', { detail: tx }));
  }, []);

  return (
    <div className="main-layout">
      <main className="main-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <TabNavigation onOpenQuickAdd={handleOpenQuickAdd} />
      <QuickAddSheet
        visible={quickAddVisible}
        onClose={handleCloseQuickAdd}
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default MainLayout;
