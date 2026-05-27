/**
 * 管理员服务
 */

import api from './api';
import {
  AdminStats,
  TrendItem,
  AdminUser,
  Share,
  ApiResponse,
  PaginatedResponse,
} from '@types/index';

export const adminApi = {
  /**
   * 获取平台统计数据
   */
  getStats(): Promise<ApiResponse<AdminStats>> {
    return api.get('/admin/stats');
  },

  /**
   * 获取近30天账单趋势
   */
  getTrend(): Promise<ApiResponse<TrendItem[]>> {
    return api.get('/admin/trend');
  },

  /**
   * 获取所有分享列表
   */
  getShares(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Share>>> {
    return api.get('/admin/shares', { params: { page, limit } });
  },

  /**
   * 删除违规分享
   */
  deleteShare(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/admin/shares/${id}`);
  },

  /**
   * 获取用户列表
   */
  getUsers(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<AdminUser>>> {
    return api.get('/admin/users', { params: { page, limit } });
  },

  /**
   * 禁用/启用用户
   */
  updateUserStatus(id: string, isActive: number): Promise<ApiResponse<AdminUser>> {
    return api.put(`/admin/users/${id}/status`, { isActive });
  },
};
