/**
 * 货币工具函数
 */

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number, currency: string = 'CNY'): string => {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

/**
 * 格式化为人民币
 */
export const formatRMB = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

/**
 * 格式化数字（带千位分隔符，无货币符号）
 */
export const formatAmount = (amount: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * 解析货币字符串为数字
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * 计算百分比
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 10000) / 100;
};
