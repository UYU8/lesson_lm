'use strict';

/**
 * 报表控制器
 * 处理报表和统计相关的 HTTP 请求
 */

const Controller = require('egg').Controller;

class ReportController extends Controller {
  /**
   * 获取日统计数据
   * GET /api/reports/daily?date=2024-01-01
   */
  async getDailyStats() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { date } = ctx.query;

    if (!date) {
      ctx.throw(400, '日期参数不能为空');
    }

    const stats = await ctx.service.report.getDailyStats(userId, date);

    ctx.body = {
      code: 0,
      message: 'success',
      data: stats,
    };
  }

  /**
   * 获取月统计数据
   * GET /api/reports/monthly?yearMonth=2024-01
   */
  async getMonthlyStats() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { yearMonth } = ctx.query;

    if (!yearMonth) {
      ctx.throw(400, '年月参数不能为空');
    }

    const stats = await ctx.service.report.getMonthlyStats(userId, yearMonth);

    ctx.body = {
      code: 0,
      message: 'success',
      data: stats,
    };
  }

  /**
   * 获取分类统计数据
   * GET /api/reports/category-stats?startDate=2024-01-01&endDate=2024-01-31
   */
  async getCategoryStats() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { startDate, endDate } = ctx.query;

    if (!startDate || !endDate) {
      ctx.throw(400, '开始日期和结束日期不能为空');
    }

    const stats = await ctx.service.report.getCategoryStats(
      userId,
      startDate,
      endDate
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: stats,
    };
  }

  /**
   * 获取年度统计数据
   * GET /api/reports/yearly?year=2024
   */
  async getYearlyStats() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { year } = ctx.query;

    if (!year) {
      ctx.throw(400, '年份参数不能为空');
    }

    const stats = await ctx.service.report.getYearlyStats(
      userId,
      parseInt(year)
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: stats,
    };
  }

  /**
   * 获取趋势数据
   * GET /api/reports/trend?startDate=2024-01-01&endDate=2024-01-31
   */
  async getTrendData() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { startDate, endDate } = ctx.query;

    if (!startDate || !endDate) {
      ctx.throw(400, '开始日期和结束日期不能为空');
    }

    const trendData = await ctx.service.report.getTrendData(
      userId,
      startDate,
      endDate
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: trendData,
    };
  }
}

module.exports = ReportController;
