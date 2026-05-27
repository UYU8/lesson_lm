/**
 * 分享服务
 */

'use strict';

const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');

class ShareService extends Service {
  /**
   * 创建分享
   */
  async createShare(userId, data) {
    const { ctx } = this;
    const { shareType, title, content } = data;

    if (!shareType) {
      ctx.throw(400, '分享类型不能为空');
    }

    if (!content) {
      ctx.throw(400, '分享内容不能为空');
    }

    const share = await ctx.model.Share.create({
      id: uuidv4(),
      userId,
      shareType,
      title: title || '我的账单分享',
      content: typeof content === 'string' ? content : JSON.stringify(content),
    });

    return share;
  }

  /**
   * 获取广场列表（公开分享）
   */
  async getPlazaList(page = 1, limit = 20) {
    const { ctx } = this;
    const offset = (page - 1) * limit;

    const { rows, count } = await ctx.model.Share.findAndCountAll({
      where: { isDeleted: 0 },
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * 获取我的分享列表
   */
  async getMyShares(userId, page = 1, limit = 20) {
    const { ctx } = this;
    const offset = (page - 1) * limit;

    const { rows, count } = await ctx.model.Share.findAndCountAll({
      where: { userId, isDeleted: 0 },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * 获取分享详情
   */
  async getShareById(id) {
    const { ctx } = this;

    const share = await ctx.model.Share.findOne({
      where: { id, isDeleted: 0 },
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!share) {
      ctx.throw(404, '分享不存在');
    }

    return share;
  }

  /**
   * 删除自己的分享（软删除）
   */
  async deleteShare(id, userId) {
    const { ctx } = this;

    const share = await ctx.model.Share.findOne({
      where: { id, userId, isDeleted: 0 },
    });

    if (!share) {
      ctx.throw(404, '分享不存在');
    }

    share.isDeleted = 1;
    share.updatedAt = new Date();
    await share.save();

    return true;
  }

  /**
   * 管理员删除分享（软删除）
   */
  async adminDeleteShare(id) {
    const { ctx } = this;

    const share = await ctx.model.Share.findOne({
      where: { id, isDeleted: 0 },
    });

    if (!share) {
      ctx.throw(404, '分享不存在');
    }

    share.isDeleted = 1;
    share.updatedAt = new Date();
    await share.save();

    return true;
  }

  /**
   * 管理员获取所有分享列表
   */
  async getAllShares(page = 1, limit = 20) {
    const { ctx } = this;
    const offset = (page - 1) * limit;

    const { rows, count } = await ctx.model.Share.findAndCountAll({
      where: { isDeleted: 0 },
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

module.exports = ShareService;
