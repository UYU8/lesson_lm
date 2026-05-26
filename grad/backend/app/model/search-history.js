/**
 * 搜索历史模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, DATE } = app.Sequelize;

  const SearchHistory = app.model.define('search_history', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '搜索历史 ID',
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    query: {
      type: STRING(255),
      allowNull: false,
      comment: '搜索查询',
    },
    createdAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '创建时间',
    },
  }, {
    tableName: 'search_history',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  });

  SearchHistory.associate = function() {
    app.model.SearchHistory.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
  };

  return SearchHistory;
};
