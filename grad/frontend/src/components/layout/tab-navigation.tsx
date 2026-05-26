import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './tab-navigation.css';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  center?: boolean;
  action?: string;
}

const TAB_ITEMS: TabItem[] = [
  { id: 'details',    label: '明细', path: '/details',    icon: '📋' },
  { id: 'charts',     label: '图表', path: '/charts',     icon: '📊' },
  { id: 'accounting', label: '记账', path: '/accounting', icon: '+', center: true, action: 'open-quick-add' },
  { id: 'budget',     label: '预算', path: '/budget',     icon: '🎯' },
  { id: 'profile',    label: '我的', path: '/profile',    icon: '👤' },
];

interface TabNavigationProps {
  onOpenQuickAdd?: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ onOpenQuickAdd }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = TAB_ITEMS.find(tab => tab.path === location.pathname)?.id || 'details';

  const handleTabClick = (tab: TabItem) => {
    if (tab.action === 'open-quick-add') {
      onOpenQuickAdd?.();
    } else {
      navigate(tab.path);
    }
  };

  return (
    <nav className="tab-navigation">
      <div className="tab-container">
        {TAB_ITEMS.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${tab.center ? 'tab-center' : ''} ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            <div className="tab-icon-wrap">
              <span className="tab-icon">{tab.icon}</span>
            </div>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
