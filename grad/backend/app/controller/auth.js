/**
 * 认证控制器
 */

const Controller = require('egg').Controller;

class AuthController extends Controller {
  /**
   * 用户注册
   */
  async register() {
    const { ctx } = this;

    // 验证参数
    ctx.validate({
      username: { type: 'string', required: true, min: 3, max: 255 },
      password: { type: 'string', required: true, min: 6 },
    });

    const { username, password } = ctx.request.body;

    // 创建用户（邮箱为可选，使用 username@app.local 作为默认邮箱）
    const user = await ctx.service.user.createUser({
      username,
      email: `${username}@app.local`,
      password,
    });

    // 生成 tokens
    const accessToken = ctx.service.user.generateAccessToken(user);
    const refreshToken = await ctx.service.user.generateRefreshToken(user.id);

    ctx.body = {
      code: 0,
      message: '注册成功',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * 用户登陆
   */
  async login() {
    const { ctx } = this;

    // 验证参数
    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });

    const { username, password } = ctx.request.body;

    // 查找用户
    const user = await ctx.service.user.getUserByUsername(username);
    if (!user) {
      return ctx.throw(400, '用户名或密码错误');
    }

    // 验证密码
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return ctx.throw(400, '用户名或密码错误');
    }

    // 生成 tokens
    const accessToken = ctx.service.user.generateAccessToken(user);
    const refreshToken = await ctx.service.user.generateRefreshToken(user.id);

    ctx.body = {
      code: 0,
      message: '登陆成功',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * 刷新 token
   */
  async refresh() {
    const { ctx } = this;

    // 验证参数
    ctx.validate({
      refreshToken: { type: 'string', required: true },
    });

    const { refreshToken } = ctx.request.body;

    // 验证 refresh token
    const decoded = await ctx.service.user.verifyRefreshToken(refreshToken);

    // 获取用户信息
    const user = await ctx.service.user.getUserById(decoded.id);
    if (!user) {
      return ctx.throw(401, '用户不存在');
    }

    // 生成新的 access token
    const newAccessToken = ctx.service.user.generateAccessToken(user);

    ctx.body = {
      code: 0,
      message: '刷新成功',
      data: {
        accessToken: newAccessToken,
        refreshToken, // 返回原 refresh token
      },
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const { ctx } = this;

    // 从 JWT 中获取用户 ID
    const userId = ctx.state.user.id;

    const user = await ctx.service.user.getUserById(userId);
    if (!user) {
      return ctx.throw(404, '用户不存在');
    }

    ctx.body = {
      code: 0,
      message: 'success',
      data: user,
    };
  }

  /**
   * 修改密码
   */
  async changePassword() {
    const { ctx } = this;

    // 验证参数
    ctx.validate({
      oldPassword: { type: 'string', required: true },
      newPassword: { type: 'string', required: true, min: 6 },
    });

    const userId = ctx.state.user.id;
    const { oldPassword, newPassword } = ctx.request.body;

    // 修改密码
    const result = await ctx.service.user.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    // 撤销所有 refresh tokens，强制重新登陆
    await ctx.service.user.revokeAllRefreshTokens(userId);

    ctx.body = {
      code: 0,
      message: result.message,
    };
  }

  /**
   * 用户登出
   */
  async logout() {
    const { ctx } = this;

    // 从请求头中获取 refresh token
    const refreshToken = ctx.get('X-Refresh-Token');

    if (refreshToken) {
      // 撤销 refresh token
      await ctx.service.user.revokeRefreshToken(refreshToken);
    }

    ctx.body = {
      code: 0,
      message: '登出成功',
    };
  }
}

module.exports = AuthController;
