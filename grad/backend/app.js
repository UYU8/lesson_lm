/**
 * 应用启动文件
 */

// 加载环境变量
require('dotenv').config();

module.exports = (app) => {
  app.ready(async () => {
    // 模型关联已在各 model 文件的 associate 方法中定义，由 Egg.js 框架自动加载
    app.logger.info('应用启动成功');
  });
};
