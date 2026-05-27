/**
 * 管理员控制器
 */

'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  /**
   * 获取平台统计数据
   */
  async stats() {
    const { ctx } = this;

    const data = await ctx.service.admin.getStats();

    ctx.body = {
      code: 0,
      message: 'success',
      data,
    };
  }

  /**
   * 获取近30天账单趋势
   */
  async trend() {
    const { ctx } = this;

    const data = await ctx.service.admin.getTrend();

    ctx.body = {
      code: 0,
      message: 'success',
      data,
    };
  }

  /**
   * 获取所有分享列表
   */
  async shares() {
    const { ctx } = this;
    const { page = 1, limit = 20 } = ctx.query;

    const result = await ctx.service.share.getAllShares(
      parseInt(page),
      parseInt(limit)
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  /**
   * 删除违规分享
   */
  async deleteShare() {
    const { ctx } = this;
    const { id } = ctx.params;

    await ctx.service.share.adminDeleteShare(id);

    ctx.body = {
      code: 0,
      message: '删除成功',
    };
  }

  /**
   * 获取用户列表
   */
  async users() {
    const { ctx } = this;
    const { page = 1, limit = 20 } = ctx.query;

    const result = await ctx.service.admin.getUsers(
      parseInt(page),
      parseInt(limit)
    );

    ctx.body = {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  /**
   * 禁用/启用用户
   */
  async updateUserStatus() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { isActive } = ctx.request.body;

    const user = await ctx.service.admin.updateUserStatus(id, isActive);

    ctx.body = {
      code: 0,
      message: isActive ? '用户已启用' : '用户已禁用',
      data: user,
    };
  }
}

module.exports = AdminController;
