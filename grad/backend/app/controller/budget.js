'use strict';

const Controller = require('egg').Controller;

class BudgetController extends Controller {
  /**
   * 获取预算列表
   * GET /api/budgets
   * @param {string} yearMonth - 年月（可选）
   */
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { yearMonth } = ctx.query;

    try {
      const budgets = await ctx.service.budget.getBudgets(userId, yearMonth);

      ctx.body = {
        code: 0,
        message: '获取预算列表成功',
        data: budgets,
      };
    } catch (error) {
      ctx.logger.error('获取预算列表失败:', error);
      ctx.body = {
        code: 500,
        message: '获取预算列表失败',
        error: error.message,
      };
    }
  }

  /**
   * 获取单个预算
   * GET /api/budgets/:id
   */
  async show() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    try {
      const budget = await ctx.service.budget.getBudget(userId, id);

      if (!budget) {
        ctx.body = {
          code: 404,
          message: '预算不存在',
        };
        return;
      }

      ctx.body = {
        code: 0,
        message: '获取预算成功',
        data: budget,
      };
    } catch (error) {
      ctx.logger.error('获取预算失败:', error);
      ctx.body = {
        code: 500,
        message: '获取预算失败',
        error: error.message,
      };
    }
  }

  /**
   * 创建预算
   * POST /api/budgets
   * @param {string} categoryId - 分类 ID
   * @param {number} amount - 预算金额
   * @param {number} year - 年份
   * @param {number} month - 月份
   */
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { categoryId, amount, year, month } = ctx.request.body;

    // 验证必填字段
    if (!categoryId || !amount || !year || !month) {
      ctx.body = {
        code: 400,
        message: '缺少必填字段',
      };
      return;
    }

    try {
      const budget = await ctx.service.budget.createBudget(userId, {
        categoryId,
        amount: parseFloat(amount),
        year: parseInt(year),
        month: parseInt(month),
      });

      ctx.body = {
        code: 0,
        message: '创建预算成功',
        data: budget,
      };
    } catch (error) {
      ctx.logger.error('创建预算失败:', error);
      ctx.body = {
        code: 400,
        message: error.message || '创建预算失败',
      };
    }
  }

  /**
   * 更新预算
   * PUT /api/budgets/:id
   * @param {number} amount - 预算金额
   */
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;
    const { amount } = ctx.request.body;

    if (!amount) {
      ctx.body = {
        code: 400,
        message: '缺少必填字段',
      };
      return;
    }

    try {
      const budget = await ctx.service.budget.updateBudget(userId, id, {
        amount: parseFloat(amount),
      });

      ctx.body = {
        code: 0,
        message: '更新预算成功',
        data: budget,
      };
    } catch (error) {
      ctx.logger.error('更新预算失败:', error);
      ctx.body = {
        code: 400,
        message: error.message || '更新预算失败',
      };
    }
  }

  /**
   * 删除预算
   * DELETE /api/budgets/:id
   */
  async destroy() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    try {
      const success = await ctx.service.budget.deleteBudget(userId, id);

      if (success) {
        ctx.body = {
          code: 0,
          message: '删除预算成功',
        };
      } else {
        ctx.body = {
          code: 404,
          message: '预算不存在',
        };
      }
    } catch (error) {
      ctx.logger.error('删除预算失败:', error);
      ctx.body = {
        code: 500,
        message: '删除预算失败',
        error: error.message,
      };
    }
  }

  /**
   * 获取预算状态
   * GET /api/budgets/:id/status
   */
  async getStatus() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    try {
      const status = await ctx.service.budget.getBudgetStatus(userId, id);

      ctx.body = {
        code: 0,
        message: '获取预算状态成功',
        data: status,
      };
    } catch (error) {
      ctx.logger.error('获取预算状态失败:', error);
      ctx.body = {
        code: 400,
        message: error.message || '获取预算状态失败',
      };
    }
  }

  /**
   * 获取分类建议预算金额（近3个月平均消费）
   * GET /api/budgets/suggestion?categoryId=xxx&yearMonth=YYYY-MM
   */
  async getSuggestion() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { categoryId, yearMonth } = ctx.query;

    if (!categoryId || !yearMonth) {
      ctx.body = { code: 400, message: '缺少参数' };
      return;
    }

    try {
      const data = await ctx.service.budget.getSuggestion(userId, categoryId, yearMonth);
      ctx.body = { code: 0, message: '成功', data };
    } catch (error) {
      ctx.logger.error('获取建议金额失败:', error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 获取当月所有预算的状态
   * GET /api/budgets/status/monthly
   * @param {string} yearMonth - 年月（格式：YYYY-MM）
   */
  async getMonthlyStatus() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { yearMonth } = ctx.query;

    if (!yearMonth) {
      ctx.body = {
        code: 400,
        message: '缺少 yearMonth 参数',
      };
      return;
    }

    try {
      const statuses = await ctx.service.budget.getMonthlyBudgetStatus(userId, yearMonth);

      ctx.body = {
        code: 0,
        message: '获取月度预算状态成功',
        data: statuses,
      };
    } catch (error) {
      ctx.logger.error('获取月度预算状态失败:', error);
      ctx.body = {
        code: 500,
        message: '获取月度预算状态失败',
        error: error.message,
      };
    }
  }
}

module.exports = BudgetController;
