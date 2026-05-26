/**
 * 预算模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, DECIMAL, INTEGER, DATE } = app.Sequelize;

  const Budget = app.model.define('budget', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '预算 ID',
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    categoryId: {
      type: STRING(36),
      allowNull: false,
      comment: '分类 ID',
    },
    amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: '预算金额',
    },
    year: {
      type: INTEGER,
      allowNull: false,
      comment: '年份',
    },
    month: {
      type: INTEGER,
      allowNull: false,
      comment: '月份',
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
    tableName: 'budgets',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['category_id'],
      },
      {
        fields: ['year', 'month'],
      },
      {
        fields: ['user_id', 'category_id', 'year', 'month'],
        unique: true,
      },
    ],
  });

  Budget.associate = function() {
    app.model.Budget.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
    app.model.Budget.belongsTo(app.model.Category, { foreignKey: 'categoryId', as: 'category' });
  };

  return Budget;
};
