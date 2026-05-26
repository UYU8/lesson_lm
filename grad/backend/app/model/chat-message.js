/**
 * 聊天消息模型
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  const { STRING, ENUM, TEXT, DATE } = app.Sequelize;

  const ChatMessage = app.model.define('chat_message', {
    id: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
      comment: '消息 ID',
    },
    userId: {
      type: STRING(36),
      allowNull: false,
      comment: '用户 ID',
    },
    role: {
      type: ENUM('user', 'assistant'),
      allowNull: false,
      comment: '角色：用户或助手',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '消息内容',
    },
    createdAt: {
      type: DATE,
      defaultValue: () => new Date(),
      comment: '创建时间',
    },
  }, {
    tableName: 'chat_messages',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['user_id', 'created_at'],
      },
    ],
  });

  ChatMessage.associate = function() {
    app.model.ChatMessage.belongsTo(app.model.User, { foreignKey: 'userId', as: 'user' });
  };

  return ChatMessage;
};
