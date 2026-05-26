'use strict';

const Service = require('egg').Service;

class BudgetService extends Service {
  /**
   * 获取用户的预算列表
   * @param {string} userId - 用户 ID
   * @param {string} yearMonth - 年月（格式：YYYY-MM，可选）
   * @returns {Promise<array>} 预算列表
   */
  async getBudgets(userId, yearMonth) {
    const { Budget, Category } = this.app.model;
    const where = { userId };

    // 如果指定了年月，则筛选该月的预算
    if (yearMonth) {
      const [year, month] = yearMonth.split('-');
      where.year = parseInt(year);
      where.month = parseInt(month);
    }

    const budgets = await Budget.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'icon'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return budgets;
  }

  /**
   * 获取单个预算
   * @param {string} userId - 用户 ID
   * @param {string} budgetId - 预算 ID
   * @returns {Promise<object>} 预算详情
   */
  async getBudget(userId, budgetId) {
    const { Budget, Category } = this.app.model;

    const budget = await Budget.findOne({
      where: { id: budgetId, userId },
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'icon'],
        },
      ],
    });

    return budget;
  }

  /**
   * 创建预算
   * @param {string} userId - 用户 ID
   * @param {object} data - 预算数据
   * @param {string} data.categoryId - 分类 ID
   * @param {number} data.amount - 预算金额
   * @param {number} data.year - 年份
   * @param {number} data.month - 月份
   * @returns {Promise<object>} 创建的预算
   */
  async createBudget(userId, data) {
    const { Budget, Category } = this.app.model;
    const { categoryId, amount, year, month } = data;

    // 验证分类是否存在且属于该用户
    const category = await Category.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new Error('分类不存在');
    }

    // 检查是否已存在相同的预算
    const existing = await Budget.findOne({
      where: { userId, categoryId, year, month },
    });

    if (existing) {
      throw new Error('该分类在该月份已有预算设置');
    }

    const budget = await Budget.create({
      userId,
      categoryId,
      amount,
      year,
      month,
    });

    return budget;
  }

  /**
   * 更新预算
   * @param {string} userId - 用户 ID
   * @param {string} budgetId - 预算 ID
   * @param {object} data - 更新数据
   * @returns {Promise<object>} 更新后的预算
   */
  async updateBudget(userId, budgetId, data) {
    const { Budget } = this.app.model;

    const budget = await Budget.findOne({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new Error('预算不存在');
    }

    await budget.update(data);
    return budget;
  }

  /**
   * 删除预算
   * @param {string} userId - 用户 ID
   * @param {string} budgetId - 预算 ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteBudget(userId, budgetId) {
    const { Budget } = this.app.model;

    const result = await Budget.destroy({
      where: { id: budgetId, userId },
    });

    return result > 0;
  }

  /**
   * 获取预算状态（已支出金额）
   * @param {string} userId - 用户 ID
   * @param {string} budgetId - 预算 ID
   * @returns {Promise<object>} 预算状态
   */
  async getBudgetStatus(userId, budgetId) {
    const { Budget, Transaction } = this.app.model;

    const budget = await Budget.findOne({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new Error('预算不存在');
    }

    // 计算该月该分类的支出
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

    const result = await Transaction.findAll({
      where: {
        userId,
        categoryId: budget.categoryId,
        type: 'expense',
        date: {
          [this.app.Sequelize.Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [this.app.Sequelize.fn('SUM', this.app.Sequelize.col('amount')), 'totalAmount'],
      ],
      raw: true,
    });

    const spent = parseFloat(result[0]?.totalAmount || 0);
    const budgetAmount = parseFloat(budget.amount);
    const percentage = (spent / budgetAmount) * 100;
    const isExceeded = spent > budgetAmount;

    return {
      budgetId,
      categoryId: budget.categoryId,
      budgetAmount,
      spentAmount: spent,
      remainingAmount: Math.max(0, budgetAmount - spent),
      percentage: Math.round(percentage * 100) / 100,
      isExceeded,
    };
  }

  /**
   * 获取当月所有预算的状态
   * @param {string} userId - 用户 ID
   * @param {string} yearMonth - 年月（格式：YYYY-MM）
   * @returns {Promise<array>} 预算状态列表
   */
  async getMonthlyBudgetStatus(userId, yearMonth) {
    const { Budget } = this.app.model;
    const [year, month] = yearMonth.split('-');

    const budgets = await Budget.findAll({
      where: {
        userId,
        year: parseInt(year),
        month: parseInt(month),
      },
    });

    const statuses = await Promise.all(
      budgets.map(budget => this.getBudgetStatus(userId, budget.id))
    );

    return statuses;
  }

  /**
   * 获取某分类的历史消费建议金额（近3个月平均）
   * @param {string} userId
   * @param {string} categoryId
   * @param {string} yearMonth - 目标月份，建议基于此月之前3个月
   */
  async getSuggestion(userId, categoryId, yearMonth) {
    const { Transaction } = this.app.model;
    const { Op, fn, col } = this.app.Sequelize;

    const [year, month] = yearMonth.split('-').map(Number);
    const amounts = [];

    for (let i = 1; i <= 3; i++) {
      let m = month - i;
      let y = year;
      if (m <= 0) { m += 12; y--; }
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59);

      const result = await Transaction.findAll({
        where: {
          userId,
          categoryId,
          type: 'expense',
          date: { [Op.between]: [startDate, endDate] },
        },
        attributes: [[ fn('SUM', col('amount')), 'total' ]],
        raw: true,
      });
      amounts.push(parseFloat(result[0]?.total || 0));
    }

    const nonZero = amounts.filter(a => a > 0);
    const avg = nonZero.length > 0 ? nonZero.reduce((s, a) => s + a, 0) / nonZero.length : 0;
    const suggested = avg > 0 ? Math.ceil(avg / 10) * 10 : 0;

    return { suggested, history: amounts };
  }
}

module.exports = BudgetService;
