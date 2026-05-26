'use strict';

/**
 * 报表服务
 * 处理统计和报表的业务逻辑
 */

const Service = require('egg').Service;
const { Op } = require('sequelize');

class ReportService extends Service {
  /**
   * 获取日统计数据
   * @param {string} userId - 用户 ID
   * @param {string} date - 日期（YYYY-MM-DD 格式）
   * @returns {Promise<Object>} { date, income, expense, net, transactions }
   */
  async getDailyStats(userId, date) {
    const { ctx } = this;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'color'],
        },
      ],
      order: [['transactionDate', 'DESC']],
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    return {
      date,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
      net: parseFloat((income - expense).toFixed(2)),
      transactionCount: transactions.length,
      transactions,
    };
  }

  /**
   * 获取月统计数据
   * @param {string} userId - 用户 ID
   * @param {string} yearMonth - 年月（YYYY-MM 格式）
   * @returns {Promise<Object>} { yearMonth, income, expense, net, dailyStats, categoryStats }
   */
  async getMonthlyStats(userId, yearMonth) {
    const { ctx } = this;
    const [year, month] = yearMonth.split('-');
    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'color'],
        },
      ],
      order: [['transactionDate', 'DESC']],
    });

    // 计算总统计
    let income = 0;
    let expense = 0;
    const dailyMap = {};

    transactions.forEach((t) => {
      const amount = parseFloat(t.amount);
      // transactionDate 映射到 date 列（DATE类型），MySQL 返回字符串如 "2026-04-05"
      const rawDate = t.transactionDate;
      const dateStr = typeof rawDate === 'string'
        ? rawDate.split('T')[0].split(' ')[0]
        : rawDate instanceof Date
          ? rawDate.toISOString().split('T')[0]
          : String(rawDate).split('T')[0];

      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { income: 0, expense: 0, count: 0 };
      }

      if (t.type === 'income') {
        income += amount;
        dailyMap[dateStr].income += amount;
      } else {
        expense += amount;
        dailyMap[dateStr].expense += amount;
      }
      dailyMap[dateStr].count += 1;
    });

    // 转换为数组
    const dailyStats = Object.entries(dailyMap).map(([date, stats]) => ({
      date,
      income: parseFloat(stats.income.toFixed(2)),
      expense: parseFloat(stats.expense.toFixed(2)),
      net: parseFloat((stats.income - stats.expense).toFixed(2)),
      count: stats.count,
    }));

    return {
      yearMonth,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
      net: parseFloat((income - expense).toFixed(2)),
      transactionCount: transactions.length,
      dailyStats: dailyStats.sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  }

  /**
   * 获取分类统计数据
   * @param {string} userId - 用户 ID
   * @param {string} startDate - 开始日期（YYYY-MM-DD 格式）
   * @param {string} endDate - 结束日期（YYYY-MM-DD 格式）
   * @returns {Promise<Array>} 分类统计列表
   */
  async getCategoryStats(userId, startDate, endDate) {
    const { ctx } = this;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'icon', 'color'],
        },
      ],
    });

    // 按分类分组统计
    const categoryMap = {};

    transactions.forEach((t) => {
      const categoryId = t.categoryId;
      const amount = parseFloat(t.amount);

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          id: categoryId,
          name: t.category.name,
          type: t.category.type,
          icon: t.category.icon || '',
          color: t.category.color || '',
          amount: 0,
          count: 0,
        };
      }

      categoryMap[categoryId].amount += amount;
      categoryMap[categoryId].count += 1;
    });

    // 转换为数组并排序
    const stats = Object.values(categoryMap).map((item) => ({
      ...item,
      amount: parseFloat(item.amount.toFixed(2)),
    }));

    // 按金额降序排列
    return stats.sort((a, b) => b.amount - a.amount);
  }

  /**
   * 获取年度统计数据
   * @param {string} userId - 用户 ID
   * @param {number} year - 年份
   * @returns {Promise<Object>} { year, monthlyStats, totalIncome, totalExpense, totalNet }
   */
  async getYearlyStats(userId, year) {
    const { ctx } = this;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      attributes: ['type', 'amount', 'transactionDate'],
    });

    // 按月份分组统计
    const monthlyMap = {};

    transactions.forEach((t) => {
      // transactionDate 映射到 date 列，MySQL DATE 类型返回字符串 "YYYY-MM-DD"
      const rawDate = t.transactionDate;
      const dateObj = typeof rawDate === 'string' ? new Date(rawDate + 'T00:00:00') : rawDate;
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = `${year}-${month}`;
      const amount = parseFloat(t.amount);

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyMap[monthKey].income += amount;
      } else {
        monthlyMap[monthKey].expense += amount;
      }
    });

    // 生成完整的月份列表
    const monthlyStats = [];
    let totalIncome = 0;
    let totalExpense = 0;

    for (let month = 1; month <= 12; month++) {
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const stats = monthlyMap[monthKey] || { income: 0, expense: 0 };

      monthlyStats.push({
        month: monthKey,
        income: parseFloat(stats.income.toFixed(2)),
        expense: parseFloat(stats.expense.toFixed(2)),
        net: parseFloat((stats.income - stats.expense).toFixed(2)),
      });

      totalIncome += stats.income;
      totalExpense += stats.expense;
    }

    return {
      year,
      monthlyStats,
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      totalNet: parseFloat((totalIncome - totalExpense).toFixed(2)),
    };
  }

  /**
   * 获取趋势数据（按日期）
   * @param {string} userId - 用户 ID
   * @param {string} startDate - 开始日期（YYYY-MM-DD 格式）
   * @param {string} endDate - 结束日期（YYYY-MM-DD 格式）
   * @returns {Promise<Array>} 趋势数据列表
   */
  async getTrendData(userId, startDate, endDate) {
    const { ctx } = this;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      attributes: ['type', 'amount', 'transactionDate'],
      order: [['transactionDate', 'ASC']],
    });

    // 按日期分组统计
    const dailyMap = {};

    transactions.forEach((t) => {
      // transactionDate 映射到 date 列，MySQL DATE 类型返回字符串 "YYYY-MM-DD"
      const rawDate = t.transactionDate;
      const dateStr = typeof rawDate === 'string'
        ? rawDate.split('T')[0].split(' ')[0]
        : rawDate instanceof Date
          ? rawDate.toISOString().split('T')[0]
          : String(rawDate).split('T')[0];
      const amount = parseFloat(t.amount);

      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        dailyMap[dateStr].income += amount;
      } else {
        dailyMap[dateStr].expense += amount;
      }
    });

    // 转换为数组
    const trendData = Object.entries(dailyMap).map(([date, stats]) => ({
      date,
      income: parseFloat(stats.income.toFixed(2)),
      expense: parseFloat(stats.expense.toFixed(2)),
      net: parseFloat((stats.income - stats.expense).toFixed(2)),
    }));

    return trendData;
  }
}

module.exports = ReportService;
