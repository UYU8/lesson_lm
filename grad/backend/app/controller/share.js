/**
 * 分享控制器
 */

'use strict';

const Controller = require('egg').Controller;

class ShareController extends Controller {
  /**
   * 发起分享
   */
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { shareType, title, content } = ctx.request.body;

    const share = await ctx.service.share.createShare(userId, {
      shareType,
      title,
      content,
    });

    ctx.status = 201;
    ctx.body = {
      code: 0,
      message: '分享成功',
      data: share,
    };
  }

  /**
   * 获取广场列表
   */
  async plaza() {
    const { ctx } = this;
    const { page = 1, limit = 20 } = ctx.query;

    const result = await ctx.service.share.getPlazaList(
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
   * 获取我的分享列表
   */
  async mine() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { page = 1, limit = 20 } = ctx.query;

    const result = await ctx.service.share.getMyShares(
      userId,
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
   * 获取分享详情
   */
  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;

    const share = await ctx.service.share.getShareById(id);

    ctx.body = {
      code: 0,
      message: 'success',
      data: share,
    };
  }

  /**
   * 删除自己的分享
   */
  async delete() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    await ctx.service.share.deleteShare(id, userId);

    ctx.body = {
      code: 0,
      message: '删除成功',
    };
  }
}

module.exports = ShareController;
