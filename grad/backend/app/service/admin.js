/**
 * 管理员服务
 */

'use strict';

const Service = require('egg').Service;
const { Op, fn, col, literal } = require('sequelize');

class AdminService extends Service {
  /**
   * 获取平台统计数据
   */
  async getStats() {
    const { ctx } = this;

    // 总注册用户数
    const totalUsers = await ctx.model.User.count();

    // 今日新增用户数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await ctx.model.User.count({
      where: {
        createdAt: { [Op.gte]: today },
      },
    });

    // 平台总账单条数
    const totalTransactions = await ctx.model.Transaction.count();

    // 平台总分享数
    const totalShares = await ctx.model.Share.count({
      where: { isDeleted: 0 },
    });

    return {
      totalUsers,
      newUsersToday,
      totalTransactions,
      totalShares,
    };
  }

  /**
   * 获取近30天账单趋势
   */
  async getTrend() {
    const { ctx } = this;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const results = await ctx.model.Transaction.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', '*'), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      group: [literal('DATE(created_at)')],
      order: [[literal('DATE(created_at)'), 'ASC']],
      raw: true,
    });

    // 填充没有数据的日期
    const trend = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const found = results.find(r => r.date === dateStr);
      trend.push({
        date: dateStr,
        count: found ? parseInt(found.count) : 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return trend;
  }

  /**
   * 获取所有用户列表
   */
  async getUsers(page = 1, limit = 20) {
    const { ctx } = this;
    const offset = (page - 1) * limit;

    const { rows, count } = await ctx.model.User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    // 为每个用户查询账单数量
    const users = await Promise.all(
      rows.map(async (user) => {
        const transactionCount = await ctx.model.Transaction.count({
          where: { userId: user.id },
        });
        return {
          ...user.toJSON(),
          transactionCount,
        };
      })
    );

    return {
      rows: users,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * 禁用/启用用户
   */
  async updateUserStatus(id, isActive) {
    const { ctx } = this;

    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    if (user.role === 'admin') {
      ctx.throw(400, '不能修改管理员账号状态');
    }

    user.isActive = isActive;
    user.updatedAt = new Date();
    await user.save();

    return user.toJSON();
  }
}

module.exports = AdminService;
