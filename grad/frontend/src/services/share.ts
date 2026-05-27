/**
 * 分享服务
 */

import api from './api';
import {
  Share,
  CreateShareRequest,
  ApiResponse,
  PaginatedResponse,
} from '@types/index';

export const shareApi = {
  /**
   * 发起分享
   */
  createShare(data: CreateShareRequest): Promise<ApiResponse<Share>> {
    return api.post('/shares', data);
  },

  /**
   * 获取广场列表
   */
  getPlaza(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Share>>> {
    return api.get('/shares/plaza', { params: { page, limit } });
  },

  /**
   * 获取我的分享列表
   */
  getMyShares(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Share>>> {
    return api.get('/shares/mine', { params: { page, limit } });
  },

  /**
   * 获取分享详情
   */
  getShareDetail(id: string): Promise<ApiResponse<Share>> {
    return api.get(`/shares/${id}`);
  },

  /**
   * 删除分享
   */
  deleteShare(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/shares/${id}`);
  },
};
