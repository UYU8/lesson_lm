/**
 * 标签模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, DATE } = app.Sequelize;

  const Tag = app.model.define('tag', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '标签 ID',
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: '标签名称',
    },
    color: {
      type: STRING(20),
      comment: '标签颜色',
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
    tableName: 'tags',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['user_id', 'name'],
        unique: true,
      },
    ],
  });

  Tag.associate = function() {
    app.model.Tag.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
    app.model.Tag.belongsToMany(app.model.Transaction, {
      through: app.model.TransactionTag,
      foreignKey: 'tagId',
      otherKey: 'transactionId',
      as: 'tagTransactions',
    });
  };

  return Tag;
};
