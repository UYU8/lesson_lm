/**
 * 用户服务
 */

const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');

class UserService extends Service {
  /**
   * 根据 ID 获取用户
   */
  async getUserById(id) {
    const user = await this.ctx.model.User.findByPk(id);
    return user ? user.toJSON() : null;
  }

  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email) {
    const user = await this.ctx.model.User.findOne({ where: { email } });
    return user;
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username) {
    const user = await this.ctx.model.User.findOne({ where: { username } });
    return user;
  }

  /**
   * 创建用户
   */
  async createUser(data) {
    const { username, email, password } = data;

    // 检查用户名是否已存在
    const existingUsername = await this.getUserByUsername(username);
    if (existingUsername) {
      this.ctx.throw(400, '用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.getUserByEmail(email);
    if (existingEmail) {
      this.ctx.throw(400, '邮箱已被注册');
    }

    const user = await this.ctx.model.User.create({
      id: uuidv4(),
      username,
      email,
      password,
    });

    // 为新用户创建预设分类
    await this.createDefaultCategories(user.id);

    return user.toJSON();
  }

  /**
   * 为用户创建预设分类（含完整支出/收入分类，与参考 UI 对齐）
   */
  async createDefaultCategories(userId) {
    const { Category } = this.ctx.model;

    const defaultCategories = [
      // ── 支出分类（32个）
      { name: '餐饮',   type: 'expense', icon: 'food',        color: '#FF6B6B', sortOrder: 1 },
      { name: '购物',   type: 'expense', icon: 'shopping',    color: '#FF9500', sortOrder: 2 },
      { name: '日用',   type: 'expense', icon: 'daily',       color: '#FFCC00', sortOrder: 3 },
      { name: '交通',   type: 'expense', icon: 'transport',   color: '#4ECDC4', sortOrder: 4 },
      { name: '蔬菜',   type: 'expense', icon: 'vegetable',   color: '#34C759', sortOrder: 5 },
      { name: '水果',   type: 'expense', icon: 'fruit',       color: '#FF6B6B', sortOrder: 6 },
      { name: '零食',   type: 'expense', icon: 'snack',       color: '#FF9500', sortOrder: 7 },
      { name: '运动',   type: 'expense', icon: 'sport',       color: '#007AFF', sortOrder: 8 },
      { name: '娱乐',   type: 'expense', icon: 'entertainment', color: '#AF52DE', sortOrder: 9 },
      { name: '通讯',   type: 'expense', icon: 'telecom',     color: '#5AC8FA', sortOrder: 10 },
      { name: '服饰',   type: 'expense', icon: 'clothes',     color: '#FF2D55', sortOrder: 11 },
      { name: '美容',   type: 'expense', icon: 'beauty',      color: '#FF2D55', sortOrder: 12 },
      { name: '住房',   type: 'expense', icon: 'house',       color: '#FF9500', sortOrder: 13 },
      { name: '居家',   type: 'expense', icon: 'home',        color: '#34C759', sortOrder: 14 },
      { name: '孩子',   type: 'expense', icon: 'child',       color: '#FFD60A', sortOrder: 15 },
      { name: '长辈',   type: 'expense', icon: 'elder',       color: '#FF6B6B', sortOrder: 16 },
      { name: '社交',   type: 'expense', icon: 'social',      color: '#007AFF', sortOrder: 17 },
      { name: '旅行',   type: 'expense', icon: 'travel',      color: '#5AC8FA', sortOrder: 18 },
      { name: '烟酒',   type: 'expense', icon: 'tobacco',     color: '#636366', sortOrder: 19 },
      { name: '数码',   type: 'expense', icon: 'digital',     color: '#007AFF', sortOrder: 20 },
      { name: '汽车',   type: 'expense', icon: 'car',         color: '#4ECDC4', sortOrder: 21 },
      { name: '医疗',   type: 'expense', icon: 'medical',     color: '#FF3B30', sortOrder: 22 },
      { name: '书籍',   type: 'expense', icon: 'book',        color: '#FF9500', sortOrder: 23 },
      { name: '学习',   type: 'expense', icon: 'education',   color: '#34C759', sortOrder: 24 },
      { name: '宠物',   type: 'expense', icon: 'pet',         color: '#FF9500', sortOrder: 25 },
      { name: '礼金',   type: 'expense', icon: 'gift_money',  color: '#FF2D55', sortOrder: 26 },
      { name: '礼物',   type: 'expense', icon: 'gift',        color: '#FF2D55', sortOrder: 27 },
      { name: '办公',   type: 'expense', icon: 'office',      color: '#636366', sortOrder: 28 },
      { name: '维修',   type: 'expense', icon: 'repair',      color: '#636366', sortOrder: 29 },
      { name: '捐赠',   type: 'expense', icon: 'donate',      color: '#FF2D55', sortOrder: 30 },
      { name: '彩票',   type: 'expense', icon: 'lottery',     color: '#FF9500', sortOrder: 31 },
      { name: '亲友',   type: 'expense', icon: 'family',      color: '#FF6B6B', sortOrder: 32 },
      { name: '其他支出', type: 'expense', icon: 'other',     color: '#AEAEB2', sortOrder: 99 },
      // ── 收入分类（8个）
      { name: '工资',   type: 'income', icon: 'salary',       color: '#34C759', sortOrder: 1 },
      { name: '兼职',   type: 'income', icon: 'parttime',     color: '#30B0C0', sortOrder: 2 },
      { name: '理财',   type: 'income', icon: 'finance',      color: '#FF9500', sortOrder: 3 },
      { name: '奖金',   type: 'income', icon: 'bonus',        color: '#00C7BE', sortOrder: 4 },
      { name: '红包',   type: 'income', icon: 'red_envelope', color: '#FF2D55', sortOrder: 5 },
      { name: '报销',   type: 'income', icon: 'reimburse',    color: '#007AFF', sortOrder: 6 },
      { name: '租金',   type: 'income', icon: 'rent',         color: '#4ECDC4', sortOrder: 7 },
      { name: '其他收入', type: 'income', icon: 'other',      color: '#AEAEB2', sortOrder: 99 },
    ];

    try {
      for (let i = 0; i < defaultCategories.length; i++) {
        const category = defaultCategories[i];
        // 忽略重复分类（用户可能已存在）
        const existing = await Category.findOne({ where: { userId, name: category.name } });
        if (!existing) {
          await Category.create({
            id: uuidv4(),
            userId,
            name: category.name,
            type: category.type,
            icon: category.icon,
            color: category.color,
            isDefault: true,
            sortOrder: category.sortOrder,
          });
        }
      }
    } catch (error) {
      this.ctx.logger.error('创建预设分类失败:', error);
    }
  }

  /**
   * 更新用户
   */
  async updateUser(id, data) {
    const user = await this.ctx.model.User.findByPk(id);
    if (!user) {
      this.ctx.throw(404, '用户不存在');
    }

    await user.update(data);
    return user.toJSON();
  }

  /**
   * 修改密码
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.ctx.model.User.findByPk(userId);
    if (!user) {
      this.ctx.throw(404, '用户不存在');
    }

    // 验证旧密码
    const isValid = await user.validatePassword(oldPassword);
    if (!isValid) {
      this.ctx.throw(400, '旧密码错误');
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    return { message: '密码修改成功' };
  }

  /**
   * 删除用户
   */
  async deleteUser(id) {
    const user = await this.ctx.model.User.findByPk(id);
    if (!user) {
      this.ctx.throw(404, '用户不存在');
    }

    await user.destroy();
    return { message: '用户已删除' };
  }

  /**
   * 生成 Access Token
   */
  generateAccessToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // Access Token 有效期 15 分钟
    const token = this.app.jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: '15m',
    });

    return token;
  }

  /**
   * 生成 Refresh Token
   */
  async generateRefreshToken(userId) {
    const payload = {
      id: userId,
      type: 'refresh',
    };

    // Refresh Token 有效期 7 天
    const token = this.app.jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: '7d',
    });

    // 保存到数据库
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.ctx.model.RefreshToken.create({
      id: uuidv4(),
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  /**
   * 验证 Refresh Token
   */
  async verifyRefreshToken(token) {
    try {
      const decoded = this.app.jwt.verify(token, this.config.jwt.secret);

      // 检查数据库中的令牌
      const refreshToken = await this.ctx.model.RefreshToken.findOne({
        where: { token },
      });

      if (!refreshToken) {
        this.ctx.throw(401, 'Refresh Token 无效');
      }

      if (refreshToken.isExpired()) {
        this.ctx.throw(401, 'Refresh Token 已过期');
      }

      return decoded;
    } catch (error) {
      this.ctx.throw(401, 'Refresh Token 验证失败');
    }
  }

  /**
   * 撤销 Refresh Token
   */
  async revokeRefreshToken(token) {
    await this.ctx.model.RefreshToken.destroy({
      where: { token },
    });
  }

  /**
   * 撤销用户的所有 Refresh Token
   */
  async revokeAllRefreshTokens(userId) {
    await this.ctx.model.RefreshToken.destroy({
      where: { userId },
    });
  }
}

module.exports = UserService;
