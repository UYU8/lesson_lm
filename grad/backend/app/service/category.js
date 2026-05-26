/**
 * 分类服务
 */

const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');

class CategoryService extends Service {
  /**
   * 获取分类列表
   * @param {string} userId - 用户 ID
   * @param {string} type - 分类类型（income/expense），可选
   * @returns {Promise<Array>} 分类列表
   */
  async getCategories(userId, type) {
    const { ctx } = this;
    const { Category } = ctx.model;

    const where = { userId };
    if (type) {
      where.type = type;
    }

    const categories = await Category.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      raw: true,
    });

    return categories;
  }

  /**
   * 根据 ID 获取分类
   * @param {string} id - 分类 ID
   * @param {string} userId - 用户 ID（用于权限检查）
   * @returns {Promise<Object>} 分类对象
   */
  async getCategoryById(id, userId) {
    const { ctx } = this;
    const { Category } = ctx.model;

    const category = await Category.findOne({
      where: { id, userId },
      raw: true,
    });

    return category;
  }

  /**
   * 创建分类
   * @param {string} userId - 用户 ID
   * @param {Object} data - 分类数据
   * @returns {Promise<Object>} 创建的分类对象
   */
  async createCategory(userId, data) {
    const { ctx } = this;
    const { Category } = ctx.model;

    // 检查分类名称是否已存在
    const existing = await Category.findOne({
      where: { userId, name: data.name },
    });

    if (existing) {
      ctx.throw(400, '分类名称已存在');
    }

    const category = await Category.create({
      id: uuidv4(),
      userId,
      name: data.name,
      type: data.type,
      icon: data.icon,
      color: data.color,
      isDefault: false,
      sortOrder: 0,
    });

    return category.toJSON();
  }

  /**
   * 更新分类
   * @param {string} id - 分类 ID
   * @param {string} userId - 用户 ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的分类对象
   */
  async updateCategory(id, userId, data) {
    const { ctx } = this;
    const { Category } = ctx.model;

    const category = await Category.findOne({
      where: { id, userId },
    });

    if (!category) {
      ctx.throw(404, '分类不存在');
    }

    // 如果修改了名称，检查是否重复
    if (data.name && data.name !== category.name) {
      const existing = await Category.findOne({
        where: { userId, name: data.name },
      });

      if (existing) {
        ctx.throw(400, '分类名称已存在');
      }
    }

    // 不允许修改默认分类的类型
    if (category.isDefault && data.type && data.type !== category.type) {
      ctx.throw(400, '不能修改默认分类的类型');
    }

    await category.update(data);
    return category.toJSON();
  }

  /**
   * 删除分类
   * @param {string} id - 分类 ID
   * @param {string} userId - 用户 ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteCategory(id, userId) {
    const { ctx } = this;
    const { Category, Transaction } = ctx.model;

    const category = await Category.findOne({
      where: { id, userId },
    });

    if (!category) {
      ctx.throw(404, '分类不存在');
    }

    // 不允许删除默认分类
    if (category.isDefault) {
      ctx.throw(400, '不能删除默认分类');
    }

    // 检查是否有交易使用该分类
    const transactionCount = await Transaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      ctx.throw(400, '该分类下有交易记录，无法删除');
    }

    await category.destroy();
    return true;
  }

  /**
   * 获取用户的所有分类（按 userId 查询，含默认分类）
   * @param {string} userId - 用户 ID
   * @returns {Promise<Object>} 按类型分组的分类 { income: [], expense: [] }
   */
  async getCategoriesByUser(userId) {
    const { ctx } = this;
    const { Category } = ctx.model;

    const categories = await Category.findAll({
      where: { userId },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
      raw: true,
    });

    // 按类型分组
    const grouped = { income: [], expense: [] };
    categories.forEach((cat) => {
      if (grouped[cat.type]) grouped[cat.type].push(cat);
    });

    return grouped;
  }
}

module.exports = CategoryService;
