/**
 * 分享模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, ENUM, TEXT, INTEGER, DATE } = app.Sequelize;

  const Share = app.model.define('share', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户ID',
    },
    shareType: {
      type: ENUM('single', 'monthly'),
      allowNull: false,
      comment: '分享类型：单条账单/当月收支概览',
    },
    title: {
      type: STRING(100),
      defaultValue: '我的账单分享',
      comment: '分享标题',
    },
    content: {
      type: TEXT,
      comment: '内容快照（JSON字符串）',
    },
    isDeleted: {
      type: INTEGER(1),
      defaultValue: 0,
      comment: '软删除标记：0正常 1已删除',
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
    tableName: 'shares',
    timestamps: false,
    underscored: true,
  });

  Share.associate = function() {
    app.model.Share.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
  };

  return Share;
};
