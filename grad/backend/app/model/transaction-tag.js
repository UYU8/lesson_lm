/**
 * 交易-标签关联模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, DATE } = app.Sequelize;

  const TransactionTag = app.model.define('transaction_tag', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '关联 ID',
    },
    transactionId: {
      type: STRING(36),
      allowNull: false,
      comment: '交易 ID',
    },
    tagId: {
      type: STRING(36),
      allowNull: false,
      comment: '标签 ID',
    },
    createdAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '创建时间',
    },
  }, {
    tableName: 'transaction_tags',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['transaction_id'],
      },
      {
        fields: ['tag_id'],
      },
      {
        fields: ['transaction_id', 'tag_id'],
        unique: true,
      },
    ],
  });

  TransactionTag.associate = function() {
    app.model.TransactionTag.belongsTo(app.model.Transaction, { foreignKey: 'transactionId', as: 'transaction' });
    app.model.TransactionTag.belongsTo(app.model.Tag, { foreignKey: 'tagId', as: 'tag' });
  };

  return TransactionTag;
};
