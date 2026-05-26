'use strict';

const Service = require('egg').Service;

class SearchService extends Service {
  /**
   * 搜索交易记录
   * @param {string} userId - 用户 ID
   * @param {object} options - 搜索选项
   * @param {string} options.keyword - 搜索关键词（金额、备注、分类名称）
   * @param {number} options.minAmount - 最小金额
   * @param {number} options.maxAmount - 最大金额
   * @param {string} options.categoryId - 分类 ID
   * @param {string} options.type - 交易类型（income/expense）
   * @param {string} options.startDate - 开始日期
   * @param {string} options.endDate - 结束日期
   * @param {number} options.page - 页码（默认 1）
   * @param {number} options.pageSize - 每页数量（默认 20）
   * @returns {Promise<object>} 搜索结果
   */
  async search(userId, options = {}) {
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
    } = options;

    const { Transaction, Category, Tag, TransactionTag } = this.app.model;
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const where = { userId };

    // 金额范围筛选
    if (minAmount !== undefined || maxAmount !== undefined) {
      const amountWhere = {};
      if (minAmount !== undefined) amountWhere[this.app.Sequelize.Op.gte] = minAmount;
      if (maxAmount !== undefined) amountWhere[this.app.Sequelize.Op.lte] = maxAmount;
      where.amount = amountWhere;
    }

    // 交易类型筛选
    if (type) {
      where.type = type;
    }

    // 日期范围筛选
    if (startDate || endDate) {
      const dateWhere = {};
      if (startDate) dateWhere[this.app.Sequelize.Op.gte] = new Date(startDate);
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        dateWhere[this.app.Sequelize.Op.lte] = endDateObj;
      }
      where.transactionDate = dateWhere;
    }

    // 分类筛选
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // 关键词搜索（备注 + 分类名）
    let categoryIncludeWhere = null;
    if (keyword) {
      const likeKeyword = `%${keyword}%`;
      const { Op } = this.app.Sequelize;
      // 先查出名称匹配的分类 ID
      const matchedCategories = await Category.findAll({
        where: { name: { [Op.like]: likeKeyword } },
        attributes: ['id'],
      });
      const matchedIds = matchedCategories.map(c => c.id);

      if (matchedIds.length > 0) {
        where[Op.or] = [
          { description: { [Op.like]: likeKeyword } },
          { categoryId: { [Op.in]: matchedIds } },
        ];
      } else {
        where.description = { [Op.like]: likeKeyword };
      }
    }

    // 查询交易记录
    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'icon'],
        },
        {
          model: TransactionTag,
          include: [
            {
              model: Tag,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['date', 'DESC']],
      limit: pageSize,
      offset,
    });

    // 保存搜索历史
    if (keyword) {
      await this.saveSearchHistory(userId, keyword);
    }

    return {
      total: count,
      page,
      pageSize,
      data: rows.map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.transactionDate,
        note: transaction.description,
        category: transaction.Category,
        tags: transaction.TransactionTags?.map(tt => tt.Tag) || [],
      })),
    };
  }

  /**
   * 保存搜索历史
   * @param {string} userId - 用户 ID
   * @param {string} keyword - 搜索关键词
   */
  async saveSearchHistory(userId, keyword) {
    const { SearchHistory } = this.app.model;

    try {
      // 检查是否已存在相同的搜索记录
      const existing = await SearchHistory.findOne({
        where: { userId, keyword },
      });

      if (existing) {
        // 更新搜索时间
        await existing.update({ createdAt: new Date() });
      } else {
        // 创建新的搜索记录
        await SearchHistory.create({
          userId,
          keyword,
        });
      }
    } catch (error) {
      this.logger.error('保存搜索历史失败:', error);
      // 不影响主流程
    }
  }

  /**
   * 获取搜索历史
   * @param {string} userId - 用户 ID
   * @param {number} limit - 返回数量（默认 10）
   * @returns {Promise<array>} 搜索历史列表
   */
  async getSearchHistory(userId, limit = 10) {
    const { SearchHistory } = this.app.model;

    const history = await SearchHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      attributes: ['id', 'keyword', 'createdAt'],
    });

    return history;
  }

  /**
   * 删除搜索历史
   * @param {string} userId - 用户 ID
   * @param {string} historyId - 搜索历史 ID
   */
  async deleteSearchHistory(userId, historyId) {
    const { SearchHistory } = this.app.model;

    const result = await SearchHistory.destroy({
      where: {
        id: historyId,
        userId,
      },
    });

    return result > 0;
  }

  /**
   * 清除所有搜索历史
   * @param {string} userId - 用户 ID
   */
  async clearSearchHistory(userId) {
    const { SearchHistory } = this.app.model;

    await SearchHistory.destroy({
      where: { userId },
    });
  }
}

module.exports = SearchService;
