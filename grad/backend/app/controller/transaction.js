'use strict';

/**
 * 交易控制器
 * 处理交易相关的 HTTP 请求
 */

const Controller = require('egg').Controller;

class TransactionController extends Controller {
  /**
   * 获取交易列表（分页）
   * GET /api/transactions?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31&categoryId=xxx&type=expense
   */
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      categoryId,
      type,
    } = ctx.query;

    const result = await ctx.service.transaction.getTransactions(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      startDate,
      endDate,
      categoryId,
      type,
    });

    ctx.body = {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  /**
   * 获取交易详情
   * GET /api/transactions/:id
   */
  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    const transaction = await ctx.service.transaction.getTransactionById(
      id,
      userId
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: transaction,
    };
  }

  /**
   * 创建交易
   * POST /api/transactions
   * 请求体：{ categoryId, amount, type, description, transactionDate, tagIds }
   */
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const {
      categoryId,
      amount,
      type,
      description,
      transactionDate,
      tagIds,
    } = ctx.request.body;

    const transaction = await ctx.service.transaction.createTransaction(
      userId,
      {
        categoryId,
        amount,
        type,
        description,
        transactionDate,
        tagIds,
      }
    );

    ctx.status = 201;
    ctx.body = {
      code: 0,
      message: 'success',
      data: transaction,
    };
  }

  /**
   * 更新交易
   * PUT /api/transactions/:id
   * 请求体：{ categoryId, amount, type, description, transactionDate, tagIds }
   */
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const {
      categoryId,
      amount,
      type,
      description,
      transactionDate,
      tagIds,
    } = ctx.request.body;

    const transaction = await ctx.service.transaction.updateTransaction(
      id,
      userId,
      {
        categoryId,
        amount,
        type,
        description,
        transactionDate,
        tagIds,
      }
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: transaction,
    };
  }

  /**
   * 删除交易
   * DELETE /api/transactions/:id
   */
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    await ctx.service.transaction.deleteTransaction(id, userId);

    ctx.body = {
      code: 0,
      message: 'success',
      data: null,
    };
  }

  /**
   * 获取特定日期的交易
   * GET /api/transactions/by-date/:date
   */
  async getByDate() {
    const { ctx } = this;
    const { date } = ctx.params;
    const userId = ctx.state.user.id;

    const transactions = await ctx.service.transaction.getTransactionsByDate(
      userId,
      date
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: transactions,
    };
  }
}

module.exports = TransactionController;
