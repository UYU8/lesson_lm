'use strict';

/**
 * 交易服务
 * 处理交易的业务逻辑
 */

const Service = require('egg').Service;
const { Op } = require('sequelize');

class TransactionService extends Service {
  /**
   * 获取用户的交易列表（分页）
   * @param {string} userId - 用户 ID
   * @param {Object} options - 查询选项 { page, limit, startDate, endDate, categoryId, type }
   * @returns {Promise<Object>} { rows, count, page, limit }
   */
  async getTransactions(userId, options = {}) {
    const { ctx } = this;
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      categoryId,
      type,
    } = options;

    const where = { userId };

    // 日期范围筛选
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) {
        where.transactionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.transactionDate[Op.lte] = new Date(endDate);
      }
    }

    // 分类筛选
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // 类型筛选
    if (type && ['income', 'expense'].includes(type)) {
      where.type = type;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await ctx.model.Transaction.findAndCountAll({
      where,
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'color'],
        },
        {
          model: ctx.model.Tag,
          as: 'tags',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
      ],
      order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']],
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
   * 根据 ID 获取交易详情
   * @param {string} id - 交易 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @returns {Promise<Object>} 交易对象
   */
  async getTransactionById(id, userId) {
    const { ctx } = this;
    const transaction = await ctx.model.Transaction.findOne({
      where: { id, userId },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'color'],
        },
        {
          model: ctx.model.Tag,
          as: 'tags',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
      ],
    });

    if (!transaction) {
      ctx.throw(404, '交易不存在');
    }

    return transaction;
  }

  /**
   * 创建交易
   * @param {string} userId - 用户 ID
   * @param {Object} data - 交易数据 { categoryId, amount, type, description, transactionDate, tagIds }
   * @returns {Promise<Object>} 创建的交易
   */
  async createTransaction(userId, data) {
    const { ctx } = this;
    const {
      categoryId,
      amount,
      type,
      description,
      transactionDate,
      tagIds = [],
    } = data;

    // 验证必填字段
    if (!categoryId) {
      ctx.throw(400, '分类 ID 不能为空');
    }
    if (!amount || amount <= 0) {
      ctx.throw(400, '金额必须大于 0');
    }
    if (!type || !['income', 'expense'].includes(type)) {
      ctx.throw(400, '交易类型必须是 income 或 expense');
    }
    if (!transactionDate) {
      ctx.throw(400, '交易日期不能为空');
    }

    // 验证分类是否存在且属于该用户
    const category = await ctx.model.Category.findOne({
      where: { id: categoryId, userId },
    });
    if (!category) {
      ctx.throw(400, '分类不存在或无权限访问');
    }

    // 创建交易
    const transaction = await ctx.model.Transaction.create({
      userId,
      categoryId,
      amount,
      type,
      description: description || null,
      transactionDate: new Date(transactionDate),
    });

    // 添加标签关联
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      // 验证标签是否存在且属于该用户
      const tags = await ctx.model.Tag.findAll({
        where: {
          id: tagIds,
          userId,
        },
      });

      if (tags.length > 0) {
        await transaction.addTags(tags);
      }
    }

    // 重新获取交易，包含关联数据
    const result = await this.getTransactionById(transaction.id, userId);
    return result;
  }

  /**
   * 更新交易
   * @param {string} id - 交易 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @param {Object} data - 更新数据 { categoryId, amount, type, description, transactionDate, tagIds }
   * @returns {Promise<Object>} 更新后的交易
   */
  async updateTransaction(id, userId, data) {
    const { ctx } = this;
    const {
      categoryId,
      amount,
      type,
      description,
      transactionDate,
      tagIds,
    } = data;

    // 获取交易并验证权限
    const transaction = await this.getTransactionById(id, userId);

    // 如果更新分类，验证分类是否存在
    if (categoryId && categoryId !== transaction.categoryId) {
      const category = await ctx.model.Category.findOne({
        where: { id: categoryId, userId },
      });
      if (!category) {
        ctx.throw(400, '分类不存在或无权限访问');
      }
      transaction.categoryId = categoryId;
    }

    // 更新其他字段
    if (amount !== undefined && amount > 0) {
      transaction.amount = amount;
    }
    if (type && ['income', 'expense'].includes(type)) {
      transaction.type = type;
    }
    if (description !== undefined) {
      transaction.description = description || null;
    }
    if (transactionDate) {
      transaction.transactionDate = new Date(transactionDate);
    }

    transaction.updatedAt = new Date();
    await transaction.save();

    // 更新标签关联
    if (Array.isArray(tagIds)) {
      // 先移除所有标签
      await transaction.setTags([]);

      // 添加新标签
      if (tagIds.length > 0) {
        const tags = await ctx.model.Tag.findAll({
          where: {
            id: tagIds,
            userId,
          },
        });

        if (tags.length > 0) {
          await transaction.addTags(tags);
        }
      }
    }

    // 重新获取交易，包含关联数据
    const result = await this.getTransactionById(id, userId);
    return result;
  }

  /**
   * 删除交易
   * @param {string} id - 交易 ID
   * @param {string} userId - 用户 ID（用于权限验证）
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteTransaction(id, userId) {
    const { ctx } = this;

    // 获取交易并验证权限
    const transaction = await this.getTransactionById(id, userId);

    // 删除标签关联
    await transaction.setTags([]);

    // 删除交易
    await transaction.destroy();
    return true;
  }

  /**
   * 获取特定日期的交易
   * @param {string} userId - 用户 ID
   * @param {string} date - 日期（YYYY-MM-DD 格式）
   * @returns {Promise<Array>} 交易列表
   */
  async getTransactionsByDate(userId, date) {
    const { ctx } = this;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'type', 'color'],
        },
        {
          model: ctx.model.Tag,
          as: 'tags',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
      ],
      order: [['transactionDate', 'DESC']],
    });

    return transactions;
  }

  /**
   * 获取日期范围内的交易统计
   * @param {string} userId - 用户 ID
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Promise<Object>} { income, expense, net }
   */
  async getTransactionStats(userId, startDate, endDate) {
    const { ctx } = this;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const transactions = await ctx.model.Transaction.findAll({
      where: {
        userId,
        transactionDate: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      attributes: ['type', 'amount'],
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    return {
      income,
      expense,
      net: income - expense,
    };
  }
}

module.exports = TransactionService;
