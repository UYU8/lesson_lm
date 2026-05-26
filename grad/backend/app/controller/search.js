'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  /**
   * 搜索交易记录
   * POST /api/search
   * @param {string} keyword - 搜索关键词
   * @param {number} minAmount - 最小金额
   * @param {number} maxAmount - 最大金额
   * @param {string} categoryId - 分类 ID
   * @param {string} type - 交易类型
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   */
  async search() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    const {
      keyword = '',
      minAmount,
      maxAmount,
      categoryId,
      type,
      startDate,
      endDate,
      page = 1,
      pageSize = 20,
    } = ctx.request.body;

    try {
      const result = await ctx.service.search.search(userId, {
        keyword,
        minAmount: minAmount ? parseFloat(minAmount) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        categoryId,
        type,
        startDate,
        endDate,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });

      ctx.body = {
        code: 0,
        message: '搜索成功',
        data: result,
      };
    } catch (error) {
      ctx.logger.error('搜索失败:', error);
      ctx.body = {
        code: 500,
        message: '搜索失败',
        error: error.message,
      };
    }
  }

  /**
   * 获取搜索历史
   * GET /api/search/history
   * @param {number} limit - 返回数量
   */
  async getHistory() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { limit = 10 } = ctx.query;

    try {
      const history = await ctx.service.search.getSearchHistory(userId, parseInt(limit));

      ctx.body = {
        code: 0,
        message: '获取搜索历史成功',
        data: history,
      };
    } catch (error) {
      ctx.logger.error('获取搜索历史失败:', error);
      ctx.body = {
        code: 500,
        message: '获取搜索历史失败',
        error: error.message,
      };
    }
  }

  /**
   * 删除搜索历史
   * DELETE /api/search/history/:id
   * @param {string} id - 搜索历史 ID
   */
  async deleteHistory() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    try {
      const success = await ctx.service.search.deleteSearchHistory(userId, id);

      if (success) {
        ctx.body = {
          code: 0,
          message: '删除搜索历史成功',
        };
      } else {
        ctx.body = {
          code: 404,
          message: '搜索历史不存在',
        };
      }
    } catch (error) {
      ctx.logger.error('删除搜索历史失败:', error);
      ctx.body = {
        code: 500,
        message: '删除搜索历史失败',
        error: error.message,
      };
    }
  }

  /**
   * 清除所有搜索历史
   * DELETE /api/search/history
   */
  async clearHistory() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    try {
      await ctx.service.search.clearSearchHistory(userId);

      ctx.body = {
        code: 0,
        message: '清除搜索历史成功',
      };
    } catch (error) {
      ctx.logger.error('清除搜索历史失败:', error);
      ctx.body = {
        code: 500,
        message: '清除搜索历史失败',
        error: error.message,
      };
    }
  }
}

module.exports = SearchController;
