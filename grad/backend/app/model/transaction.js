/**
 * 交易模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, ENUM, DECIMAL, TEXT, DATE } = app.Sequelize;

  const Transaction = app.model.define('transaction', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '交易 ID',
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
      comment: '金额',
    },
    type: {
      type: ENUM('income', 'expense'),
      allowNull: false,
      comment: '交易类型：收入或支出',
    },
    description: {
      type: TEXT,
      comment: '交易描述/备注',
    },
    transactionDate: {
      type: DATE,
      allowNull: false,
      comment: '交易日期',
      field: 'date',
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
    tableName: 'transactions',
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
        fields: ['transaction_date'],
      },
      {
        fields: ['user_id', 'transaction_date'],
      },
    ],
  });

  Transaction.associate = function() {
    // Transaction 属于一个分类
    app.model.Transaction.belongsTo(app.model.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    // Transaction 属于一个用户
    app.model.Transaction.belongsTo(app.model.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    // Transaction 与 Tag 多对多
    app.model.Transaction.belongsToMany(app.model.Tag, {
      through: app.model.TransactionTag,
      foreignKey: 'transactionId',
      otherKey: 'tagId',
      as: 'tags',
    });
  };

  return Transaction;
};
