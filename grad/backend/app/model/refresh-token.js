/**
 * 刷新令牌模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, DATE } = app.Sequelize;

  const RefreshToken = app.model.define('refresh_token', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    token: {
      type: STRING(500),
      allowNull: false,
      unique: true,
      comment: '刷新令牌',
    },
    expiresAt: {
      type: DATE,
      allowNull: false,
      comment: '过期时间',
    },
    createdAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '创建时间',
    },
  }, {
    tableName: 'refresh_tokens',
    timestamps: false,
    underscored: true,
  });

  /**
   * 检查令牌是否过期
   */
  RefreshToken.prototype.isExpired = function () {
    return new Date() > this.expiresAt;
  };

  RefreshToken.associate = function() {
    app.model.RefreshToken.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
  };

  return RefreshToken;
};
