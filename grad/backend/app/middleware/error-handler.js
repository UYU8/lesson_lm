/**
 * 错误处理中间件
 */

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.app.logger.error('Error:', error);

      // 处理验证错误
      if (error.status === 422) {
        return (ctx.body = {
          code: 422,
          message: '参数验证失败',
          data: error.errors,
        });
      }

      // 处理认证错误
      if (error.status === 401) {
        return (ctx.body = {
          code: 401,
          message: error.message || '认证失败',
        });
      }

      // 处理授权错误
      if (error.status === 403) {
        return (ctx.body = {
          code: 403,
          message: error.message || '无权限访问',
        });
      }

      // 处理其他 HTTP 错误
      if (error.status) {
        return (ctx.body = {
          code: error.status,
          message: error.message || '请求失败',
        });
      }

      // 处理未知错误
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器内部错误',
      };
    }
  };
};
