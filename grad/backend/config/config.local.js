/**
 * 本地开发环境配置
 */

exports.logger = {
  level: 'debug',
  consoleLevel: 'debug',
};

exports.sequelize = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'mobile_accounting',
  define: {
    timestamps: false,
    underscored: true,
  },
  timezone: '+08:00',
  logging: console.log,
};

exports.jwt = {
  secret: 'mobile-accounting-jwt-secret-dev',
};

exports.zhipuApiKey = 'f220642bac704af7b1cd00bc3abe9e65.kpthI5TO1SU6xNF8';
