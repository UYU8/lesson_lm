/**
 * 分类控制器
 */

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  /**
   * 获取分类列表
   * GET /api/categories?type=expense
   */
  async list() {
    const { ctx } = this;
    const { type } = ctx.query;
    const userId = ctx.state.user.id;

    try {
      const categories = await ctx.service.category.getCategories(userId, type);

      ctx.body = {
        code: 0,
        message: 'success',
        data: categories,
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }

  /**
   * 获取用户的所有分类（包括默认分类）
   * GET /api/categories/all
   */
  async all() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    try {
      const categories = await ctx.service.category.getCategoriesByUser(userId);

      ctx.body = {
        code: 0,
        message: 'success',
        data: categories,
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }

  /**
   * 获取单个分类
   * GET /api/categories/:id
   */
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      const category = await ctx.service.category.getCategoryById(id, userId);

      if (!category) {
        ctx.throw(404, '分类不存在');
      }

      ctx.body = {
        code: 0,
        message: 'success',
        data: category,
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }

  /**
   * 创建分类
   * POST /api/categories
   */
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { name, type, icon, color } = ctx.request.body;

    // 验证必填字段
    if (!name || !type) {
      ctx.throw(400, '分类名称和类型不能为空');
    }

    if (!['income', 'expense'].includes(type)) {
      ctx.throw(400, '分类类型只能是 income 或 expense');
    }

    try {
      const category = await ctx.service.category.createCategory(userId, {
        name,
        type,
        icon,
        color,
      });

      ctx.body = {
        code: 0,
        message: 'success',
        data: category,
      };
    } catch (error) {
      if (error.status === 400) {
        ctx.throw(400, error.message);
      }
      ctx.throw(500, error.message);
    }
  }

  /**
   * 更新分类
   * PUT /api/categories/:id
   */
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { name, type, icon, color, sortOrder } = ctx.request.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    if (Object.keys(updateData).length === 0) {
      ctx.throw(400, '没有要更新的字段');
    }

    try {
      const category = await ctx.service.category.updateCategory(id, userId, updateData);

      ctx.body = {
        code: 0,
        message: 'success',
        data: category,
      };
    } catch (error) {
      if (error.status === 400 || error.status === 404) {
        ctx.throw(error.status, error.message);
      }
      ctx.throw(500, error.message);
    }
  }

  /**
   * 删除分类
   * DELETE /api/categories/:id
   */
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      await ctx.service.category.deleteCategory(id, userId);

      ctx.body = {
        code: 0,
        message: 'success',
        data: null,
      };
    } catch (error) {
      if (error.status === 400 || error.status === 404) {
        ctx.throw(error.status, error.message);
      }
      ctx.throw(500, error.message);
    }
  }
  /**
   * 为当前用户初始化/补充默认分类
   * POST /api/categories/init-defaults
   */
  async initDefaults() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    try {
      await ctx.service.user.createDefaultCategories(userId);
      const categories = await ctx.service.category.getCategoriesByUser(userId);
      ctx.body = {
        code: 0,
        message: '默认分类已初始化',
        data: categories,
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
}

module.exports = CategoryController;
