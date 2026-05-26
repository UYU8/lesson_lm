/**
 * 用户相关类型定义
 */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * 分类相关类型定义
 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  isDefault?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'income' | 'expense';
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: 'income' | 'expense';
  color?: string;
}

/**
 * 标签相关类型定义
 */
export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

/**
 * 交易相关类型定义
 */
export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transactionDate: string;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  categoryId: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transactionDate: string;
  tagIds?: string[];
}

export interface UpdateTransactionRequest {
  categoryId?: string;
  amount?: number;
  type?: 'income' | 'expense';
  description?: string;
  transactionDate?: string;
  tagIds?: string[];
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
}

export interface TransactionListResponse {
  rows: Transaction[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 统计相关类型定义
 */
export interface DailyStats {
  date: string;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
  transactions?: Transaction[];
}

export interface MonthlyStats {
  yearMonth: string;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
  dailyStats: DailyStats[];
}

export interface CategoryStats {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  amount: number;
  count: number;
}

export interface YearlyStats {
  year: number;
  monthlyStats: MonthlyStatsItem[];
  totalIncome: number;
  totalExpense: number;
  totalNet: number;
}

export interface MonthlyStatsItem {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface TrendData {
  date: string;
  income: number;
  expense: number;
  net: number;
}

/**
 * 报表相关类型定义
 */
export interface ReportData {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyReport {
  month: string;
  income: number;
  expense: number;
  balance: number;
  categories: ReportData[];
}

/**
 * 预算相关类型定义
 */
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  spent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
}

export interface UpdateBudgetRequest {
  amount?: number;
  period?: 'monthly' | 'yearly';
}

/**
 * 搜索相关类型定义
 */
export interface SearchParams {
  keyword?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SearchHistory {
  id: string;
  userId: string;
  keyword: string;
  createdAt: string;
}

/**
 * Chat 相关类型定义
 */
export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface CreateChatMessageRequest {
  content: string;
}

/**
 * API 响应类型定义
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 分页相关类型定义
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  rows: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 错误相关类型定义
 */
export interface ErrorResponse {
  code: number;
  message: string;
}
