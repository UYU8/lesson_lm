/**
 * 用户模型
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    username: {
      type: STRING(255),
      allowNull: false,
      unique: true,
      comment: '用户名',
    },
    email: {
      type: STRING(255),
      allowNull: false,
      unique: true,
      comment: '邮箱',
    },
    password: {
      type: STRING(255),
      allowNull: false,
      comment: '密码（加密）',
    },
    createdAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '更新时间',
    },
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true,
  });

  /**
   * 密码加密钩子
   */
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  /**
   * 密码更新钩子
   */
  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  /**
   * 验证密码
   */
  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  /**
   * 获取用户信息（不包含密码）
   */
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.associate = function() {
    app.model.User.hasMany(app.model.Category, { foreignKey: 'userId', as: 'categories' });
    app.model.User.hasMany(app.model.Transaction, { foreignKey: 'userId', as: 'transactions' });
    app.model.User.hasMany(app.model.Tag, { foreignKey: 'userId', as: 'tags' });
    app.model.User.hasMany(app.model.Budget, { foreignKey: 'userId', as: 'budgets' });
    app.model.User.hasMany(app.model.ChatMessage, { foreignKey: 'userId', as: 'chatMessages' });
    app.model.User.hasMany(app.model.SearchHistory, { foreignKey: 'userId', as: 'searchHistory' });
    app.model.User.hasMany(app.model.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
  };

  return User;
};
