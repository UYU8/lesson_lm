import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register, ChangePassword } from '@components/auth';
import { ProtectedRoute } from '@components/protected-route';
import { MainLayout } from '@components/layout';
import AccountingPage from '@pages/accounting';
import DetailsPage from '@pages/details';
import ChartsPage from '@pages/charts';
import BudgetPage from '@pages/budget';
import ProfilePage from '@pages/profile';
import BillPage from '@pages/bill';
import SearchPage from '@pages/search';
import CalendarPage from '@pages/calendar';
import ChatPage from '@pages/chat';
import PlazaPage from '@pages/plaza';
import PlazaDetailPage from '@pages/plaza-detail';
import MySharesPage from '@pages/my-shares';
import AdminLogin from '@pages/admin/login';
import AdminDashboard from '@pages/admin/dashboard';
import AdminShares from '@pages/admin/shares';
import AdminUsers from '@pages/admin/users';
import { AdminProtectedRoute } from '@components/admin/admin-protected-route';
import { AdminLayout } from '@components/admin/admin-layout';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 认证路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* 主应用布局（包含 Tab 导航） */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* 明细页面 */}
            <Route path="/details" element={<DetailsPage />} />

            {/* 图表页面 */}
            <Route path="/charts" element={<ChartsPage />} />

            {/* 记账页面 */}
            <Route path="/accounting" element={<AccountingPage />} />

            {/* 预算页面 */}
            <Route path="/budget" element={<BudgetPage />} />

            {/* 我的页面 */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* 账单页面（从明细点击进入） */}
            <Route path="/bill" element={<BillPage />} />

            {/* 保留旧路由（不在 tab 中显示） */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/chat" element={<ChatPage />} />

            {/* 广场相关路由 */}
            <Route path="/plaza" element={<PlazaPage />} />
            <Route path="/plaza/:id" element={<PlazaDetailPage />} />
            <Route path="/my-shares" element={<MySharesPage />} />
          </Route>

          {/* 主页面（重定向到明细页面） */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/details" replace />
              </ProtectedRoute>
            }
          />

          {/* 管理员后台路由 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/shares" element={<AdminShares />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* 兜底重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
