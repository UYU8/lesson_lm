import api from './api';
import { MonthlyReport, ReportData } from '@types/index';

/**
 * 报表服务
 */
export const reportService = {
  /**
   * 获取月度报表
   */
  getMonthlyReport: async (year: number, month: number): Promise<MonthlyReport> => {
    const response = await api.get<MonthlyReport>('/reports/monthly', {
      params: { year, month },
    });
    return response.data!;
  },

  /**
   * 获取分类统计数据
   */
  getCategoryStats: async (startDate: string, endDate: string): Promise<ReportData[]> => {
    const response = await api.get<ReportData[]>('/reports/category-stats', {
      params: { startDate, endDate },
    });
    return response.data || [];
  },

  /**
   * 获取收支趋势数据
   */
  getTrendData: async (startDate: string, endDate: string): Promise<any[]> => {
    const response = await api.get('/reports/trend', {
      params: { startDate, endDate },
    });
    return response.data || [];
  },

  /**
   * 获取年度报表
   */
  getYearlyReport: async (year: number): Promise<any> => {
    const response = await api.get('/reports/yearly', {
      params: { year },
    });
    return response.data;
  },
};
