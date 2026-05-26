/**
 * 首页控制器
 */

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      code: 0,
      message: 'success',
      data: {
        message: '移动端记账本 API 服务',
        version: '0.1.0',
      },
    };
  }
}

module.exports = HomeController;
