/**
 * 管理员登录页 - 重定向到普通登录页
 * 管理员通过普通登录页登录后，根据 role 自动跳转到管理后台
 */

import { Navigate } from 'react-router-dom';

const AdminLogin = () => <Navigate to="/login" replace />;

export default AdminLogin;
