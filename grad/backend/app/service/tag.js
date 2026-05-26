'use strict';

/**
 * 标签服务
 * 处理标签的业务逻辑
 */

const Service = require('egg').Service;

class TagService extends Service {
  /**
   * 获取用户的所有标签
   * @param {string} userId - 用户 ID
   * @returns {Promise<Array>} 标签列表
   */
  async getTagsByUser(userId) {
    const { ctx } = this;
    const tags = await ctx.model.Tag.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return tags;
  }

  /**
   * 根据 ID 获取标签
   * @param {string} id - 标签 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @returns {Promise<Object>} 标签对象
   */
  async getTagById(id, userId) {
    const { ctx } = this;
    const tag = await ctx.model.Tag.findOne({
      where: { id, userId },
    });
    if (!tag) {
      ctx.throw(404, '标签不存在');
    }
    return tag;
  }

  /**
   * 创建标签
   * @param {string} userId - 用户 ID
   * @param {Object} data - 标签数据 { name, color }
   * @returns {Promise<Object>} 创建的标签
   */
  async createTag(userId, data) {
    const { ctx } = this;
    const { name, color } = data;

    // 验证必填字段
    if (!name || !name.trim()) {
      ctx.throw(400, '标签名称不能为空');
    }

    // 检查标签名称是否已存在（同一用户下）
    const existingTag = await ctx.model.Tag.findOne({
      where: { userId, name: name.trim() },
    });
    if (existingTag) {
      ctx.throw(400, '该标签名称已存在');
    }

    // 创建标签
    const tag = await ctx.model.Tag.create({
      userId,
      name: name.trim(),
      color: color || '#999999',
    });

    return tag;
  }

  /**
   * 更新标签
   * @param {string} id - 标签 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @param {Object} data - 更新数据 { name, color }
   * @returns {Promise<Object>} 更新后的标签
   */
  async updateTag(id, userId, data) {
    const { ctx } = this;
    const { name, color } = data;

    // 获取标签并验证权限
    const tag = await this.getTagById(id, userId);

    // 如果更新名称，检查是否重复
    if (name && name.trim() && name.trim() !== tag.name) {
      const existingTag = await ctx.model.Tag.findOne({
        where: { userId, name: name.trim() },
      });
      if (existingTag) {
        ctx.throw(400, '该标签名称已存在');
      }
    }

    // 更新标签
    if (name && name.trim()) {
      tag.name = name.trim();
    }
    if (color) {
      tag.color = color;
    }
    tag.updatedAt = new Date();

    await tag.save();
    return tag;
  }

  /**
   * 删除标签
   * @param {string} id - 标签 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteTag(id, userId) {
    const { ctx } = this;

    // 获取标签并验证权限
    const tag = await this.getTagById(id, userId);

    // 检查是否有交易使用该标签
    const transactionTagCount = await ctx.model.TransactionTag.count({
      where: { tagId: id },
    });

    if (transactionTagCount > 0) {
      ctx.throw(400, '该标签已被使用，无法删除');
    }

    // 删除标签
    await tag.destroy();
    return true;
  }

  /**
   * 批量获取标签（根据 ID 列表）
   * @param {Array<string>} tagIds - 标签 ID 列表
   * @param {string} userId - 用户 ID（用于权限验证）
   * @returns {Promise<Array>} 标签列表
   */
  async getTagsByIds(tagIds, userId) {
    const { ctx } = this;
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return [];
    }

    const tags = await ctx.model.Tag.findAll({
      where: {
        id: tagIds,
        userId,
      },
    });

    return tags;
  }
}

module.exports = TagService;
