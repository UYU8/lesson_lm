/**
 * 分类模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, ENUM, BOOLEAN, INTEGER, DATE } = app.Sequelize;

  const Category = app.model.define('category', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '分类 ID',
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    name: {
      type: STRING(255),
      allowNull: false,
      comment: '分类名称',
    },
    type: {
      type: ENUM('income', 'expense'),
      allowNull: false,
      comment: '分类类型：收入或支出',
    },
    icon: {
      type: STRING(255),
      comment: '分类图标',
    },
    color: {
      type: STRING(20),
      comment: '分类颜色',
    },
    isDefault: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '是否为默认分类',
    },
    sortOrder: {
      type: INTEGER,
      defaultValue: 0,
      comment: '排序顺序',
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
    tableName: 'categories',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['user_id', 'name'],
        unique: true,
      },
    ],
  });

  Category.associate = function() {
    app.model.Category.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
    app.model.Category.hasMany(app.model.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
    app.model.Category.hasMany(app.model.Budget, { foreignKey: 'categoryId', as: 'budgets' });
  };

  return Category;
};
