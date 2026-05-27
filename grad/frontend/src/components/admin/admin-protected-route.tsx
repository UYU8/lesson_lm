/**
 * 管理员路由守卫
 */

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@services/auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setStatus('unauthorized');
        return;
      }
      try {
        const user = await authService.getCurrentUser();
        if (user && user.role === 'admin') {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      } catch {
        setStatus('unauthorized');
      }
    };
    checkAdmin();
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#999' }}>
        加载中...
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
