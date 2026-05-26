/**
 * 默认配置
 */

exports.keys = 'mobile-accounting-secret-key';

// 中间件配置
exports.middleware = ['errorHandler'];

// CORS 配置
exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
};

// Sequelize 配置
exports.sequelize = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mobile_accounting',
  define: {
    timestamps: false,
    underscored: true,
  },
  timezone: '+08:00',
  logging: false,
};

// JWT 配置
exports.jwt = {
  secret: process.env.JWT_SECRET || 'mobile-accounting-jwt-secret',
  enable: true,
  match: [], // 禁用全局 JWT 验证，由自定义中间件处理
};

// 日志配置
exports.logger = {
  level: 'info',
  consoleLevel: 'info',
};

// 安全配置
exports.security = {
  csrf: {
    enable: false,
  },
};

// 验证配置
exports.validate = {
  convert: true,
  strip: true,
};
