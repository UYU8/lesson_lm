/**
 * 生产环境配置
 */

exports.logger = {
  level: 'warn',
  consoleLevel: 'warn',
};

exports.sequelize = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: false,
    underscored: true,
  },
  timezone: '+08:00',
  logging: false,
};

exports.jwt = {
  secret: process.env.JWT_SECRET,
};
