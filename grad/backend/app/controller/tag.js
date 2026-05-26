'use strict';

/**
 * 标签控制器
 * 处理标签相关的 HTTP 请求
 */

const Controller = require('egg').Controller;

class TagController extends Controller {
  /**
   * 获取用户的所有标签
   * GET /api/tags
   */
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    const tags = await ctx.service.tag.getTagsByUser(userId);

    ctx.body = {
      code: 0,
      message: 'success',
      data: tags,
    };
  }

  /**
   * 获取单个标签
   * GET /api/tags/:id
   */
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    const tag = await ctx.service.tag.getTagById(id, userId);

    ctx.body = {
      code: 0,
      message: 'success',
      data: tag,
    };
  }

  /**
   * 创建标签
   * POST /api/tags
   * 请求体：{ name, color }
   */
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { name, color } = ctx.request.body;

    const tag = await ctx.service.tag.createTag(userId, {
      name,
      color,
    });

    ctx.status = 201;
    ctx.body = {
      code: 0,
      message: 'success',
      data: tag,
    };
  }

  /**
   * 更新标签
   * PUT /api/tags/:id
   * 请求体：{ name, color }
   */
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { name, color } = ctx.request.body;

    const tag = await ctx.service.tag.updateTag(id, userId, {
      name,
      color,
    });

    ctx.body = {
      code: 0,
      message: 'success',
      data: tag,
    };
  }

  /**
   * 删除标签
   * DELETE /api/tags/:id
   */
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    await ctx.service.tag.deleteTag(id, userId);

    ctx.body = {
      code: 0,
      message: 'success',
      data: null,
    };
  }
}

module.exports = TagController;
