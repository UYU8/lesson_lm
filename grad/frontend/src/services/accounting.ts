/**
 * 记账服务
 * 处理分类、标签、交易等相关的 API 调用
 */

import api from './api';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionListParams,
  TransactionListResponse,
  DailyStats,
  MonthlyStats,
  CategoryStats,
  YearlyStats,
  TrendData,
  ApiResponse,
} from '@types/index';

/**
 * 分类相关 API
 */
export const categoryApi = {
  /**
   * 获取用户的分类列表
   */
  getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get('/categories');
  },

  /**
   * 获取所有分类（含默认分类，按 expense/income 分组）
   */
  getAllCategories(): Promise<ApiResponse<any>> {
    return api.get('/categories/all');
  },

  /**
   * 为当前用户初始化/补充默认分类（已有账号首次使用新版时调用）
   */
  initDefaults(): Promise<ApiResponse<any>> {
    return api.post('/categories/init-defaults');
  },

  /**
   * 获取单个分类
   */
  getCategory(id: string): Promise<ApiResponse<Category>> {
    return api.get(`/categories/${id}`);
  },

  /**
   * 创建分类
   */
  createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return api.post('/categories', data);
  },

  /**
   * 更新分类
   */
  updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    return api.put(`/categories/${id}`, data);
  },

  /**
   * 删除分类
   */
  deleteCategory(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/categories/${id}`);
  },
};

/**
 * 标签相关 API
 */
export const tagApi = {
  /**
   * 获取用户的标签列表
   */
  getTags(): Promise<ApiResponse<Tag[]>> {
    return api.get('/tags');
  },

  /**
   * 获取单个标签
   */
  getTag(id: string): Promise<ApiResponse<Tag>> {
    return api.get(`/tags/${id}`);
  },

  /**
   * 创建标签
   */
  createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return api.post('/tags', data);
  },

  /**
   * 更新标签
   */
  updateTag(id: string, data: UpdateTagRequest): Promise<ApiResponse<Tag>> {
    return api.put(`/tags/${id}`, data);
  },

  /**
   * 删除标签
   */
  deleteTag(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/tags/${id}`);
  },
};

/**
 * 交易相关 API
 */
export const transactionApi = {
  /**
   * 获取交易列表（分页）
   */
  getTransactions(
    params?: TransactionListParams
  ): Promise<ApiResponse<TransactionListResponse>> {
    return api.get('/transactions', { params });
  },

  /**
   * 获取单个交易
   */
  getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return api.get(`/transactions/${id}`);
  },

  /**
   * 创建交易
   */
  createTransaction(
    data: CreateTransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    return api.post('/transactions', data);
  },

  /**
   * 更新交易
   */
  updateTransaction(
    id: string,
    data: UpdateTransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    return api.put(`/transactions/${id}`, data);
  },

  /**
   * 删除交易
   */
  deleteTransaction(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/transactions/${id}`);
  },

  /**
   * 获取特定日期的交易
   */
  getTransactionsByDate(date: string): Promise<ApiResponse<Transaction[]>> {
    return api.get(`/transactions/by-date/${date}`);
  },
};

/**
 * 报表相关 API
 */
export const reportApi = {
  /**
   * 获取日统计数据
   */
  getDailyStats(date: string): Promise<ApiResponse<DailyStats>> {
    return api.get('/reports/daily', { params: { date } });
  },

  /**
   * 获取月统计数据
   */
  getMonthlyStats(yearMonth: string): Promise<ApiResponse<MonthlyStats>> {
    return api.get('/reports/monthly', { params: { yearMonth } });
  },

  /**
   * 获取分类统计数据
   */
  getCategoryStats(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<CategoryStats[]>> {
    return api.get('/reports/category-stats', {
      params: { startDate, endDate },
    });
  },

  /**
   * 获取年度统计数据
   */
  getYearlyStats(year: number): Promise<ApiResponse<YearlyStats>> {
    return api.get('/reports/yearly', { params: { year } });
  },

  /**
   * 获取趋势数据
   */
  getTrendData(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<TrendData[]>> {
    return api.get('/reports/trend', { params: { startDate, endDate } });
  },
};

/**
 * 导出相关 API（预留）
 */
export const exportApi = {
  /**
   * 导出为 CSV
   */
  exportToCSV(startDate: string, endDate: string): Promise<Blob> {
    return api.get('/export/csv', {
      params: { startDate, endDate },
      responseType: 'blob',
    });
  },

  /**
   * 导出为 Excel
   */
  exportToExcel(startDate: string, endDate: string): Promise<Blob> {
    return api.get('/export/excel', {
      params: { startDate, endDate },
      responseType: 'blob',
    });
  },
};

/**
 * 搜索相关 API
 */
export const searchApi = {
  /**
   * 搜索交易
   */
  searchTransactions(options: {
    keyword?: string;
    minAmount?: number;
    maxAmount?: number;
    categoryId?: string;
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<any>> {
    return api.post('/search', options);
  },

  /**
   * 获取搜索历史
   */
  getSearchHistory(limit?: number): Promise<ApiResponse<any[]>> {
    return api.get('/search/history', { params: { limit } });
  },

  /**
   * 删除单条搜索历史
   */
  deleteSearchHistory(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/search/history/${id}`);
  },

  /**
   * 清除所有搜索历史
   */
  clearSearchHistory(): Promise<ApiResponse<null>> {
    return api.delete('/search/history');
  },
};

/**
 * 预算相关 API
 */
export const budgetApi = {
  /**
   * 获取预算列表
   */
  getBudgets(yearMonth?: string): Promise<ApiResponse<any[]>> {
    return api.get('/budgets', { params: { yearMonth } });
  },

  /**
   * 获取单个预算
   */
  getBudget(id: string): Promise<ApiResponse<any>> {
    return api.get(`/budgets/${id}`);
  },

  /**
   * 创建预算
   */
  createBudget(data: {
    categoryId: string;
    amount: number;
    year: number;
    month: number;
  }): Promise<ApiResponse<any>> {
    return api.post('/budgets', data);
  },

  /**
   * 更新预算
   */
  updateBudget(id: string, data: { amount: number }): Promise<ApiResponse<any>> {
    return api.put(`/budgets/${id}`, data);
  },

  /**
   * 删除预算
   */
  deleteBudget(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/budgets/${id}`);
  },

  /**
   * 获取预算状态
   */
  getBudgetStatus(id: string): Promise<ApiResponse<any>> {
    return api.get(`/budgets/${id}/status`);
  },

  /**
   * 获取月度预算状态
   */
  getMonthlyBudgetStatus(yearMonth: string): Promise<ApiResponse<any[]>> {
    return api.get('/budgets/status/monthly', { params: { yearMonth } });
  },

  /**
   * 获取某分类建议预算金额（近3个月平均消费）
   */
  getSuggestion(categoryId: string, yearMonth: string): Promise<ApiResponse<{ suggested: number; history: number[] }>> {
    return api.get('/budgets/suggestion', { params: { categoryId, yearMonth } });
  },
};
