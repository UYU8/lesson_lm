/**
 * JWT 认证中间件
 */

module.exports = (options) => {
  return async (ctx, next) => {
    const token = ctx.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return ctx.throw(401, '未提供认证令牌');
    }

    try {
      const decoded = ctx.app.jwt.verify(token, options.secret);
      ctx.state.user = decoded;

      // 管理员权限校验
      if (options.requireAdmin && decoded.role !== 'admin') {
        return ctx.throw(403, '需要管理员权限');
      }

      await next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return ctx.throw(401, 'Token 已过期');
      }
      return ctx.throw(401, '无效的认证令牌');
    }
  };
};
