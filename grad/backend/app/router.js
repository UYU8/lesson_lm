/**
 * 路由配置
 */

module.exports = (app) => {
  const { router, controller } = app;

  // 健康检查
  router.get('/health', controller.home.index);

  // 认证相关路由（不需要认证）
  router.post('/api/auth/register', controller.auth.register);
  router.post('/api/auth/login', controller.auth.login);
  router.post('/api/auth/refresh', controller.auth.refresh);

  // 认证相关路由（需要认证）
  router.get('/api/auth/me', app.middleware.auth({ secret: app.config.jwt.secret }), controller.auth.getCurrentUser);
  router.post('/api/auth/change-password', app.middleware.auth({ secret: app.config.jwt.secret }), controller.auth.changePassword);
  router.post('/api/auth/logout', app.middleware.auth({ secret: app.config.jwt.secret }), controller.auth.logout);

  // 分类相关路由（需要认证）
  const authMiddleware = app.middleware.auth({ secret: app.config.jwt.secret });
  router.get('/api/categories', authMiddleware, controller.category.list);
  router.get('/api/categories/all', authMiddleware, controller.category.all);
  router.post('/api/categories/init-defaults', authMiddleware, controller.category.initDefaults);
  router.get('/api/categories/:id', authMiddleware, controller.category.show);
  router.post('/api/categories', authMiddleware, controller.category.create);
  router.put('/api/categories/:id', authMiddleware, controller.category.update);
  router.delete('/api/categories/:id', authMiddleware, controller.category.destroy);

  // 标签相关路由（需要认证）
  router.get('/api/tags', authMiddleware, controller.tag.list);
  router.get('/api/tags/:id', authMiddleware, controller.tag.show);
  router.post('/api/tags', authMiddleware, controller.tag.create);
  router.put('/api/tags/:id', authMiddleware, controller.tag.update);
  router.delete('/api/tags/:id', authMiddleware, controller.tag.destroy);

  // 交易相关路由（需要认证）
  router.get('/api/transactions', authMiddleware, controller.transaction.list);
  router.post('/api/transactions', authMiddleware, controller.transaction.create);
  router.get('/api/transactions/:id', authMiddleware, controller.transaction.detail);
  router.put('/api/transactions/:id', authMiddleware, controller.transaction.update);
  router.delete('/api/transactions/:id', authMiddleware, controller.transaction.delete);
  router.get('/api/transactions/by-date/:date', authMiddleware, controller.transaction.getByDate);

  // 报表相关路由（需要认证）
  router.get('/api/reports/daily', authMiddleware, controller.report.getDailyStats);
  router.get('/api/reports/monthly', authMiddleware, controller.report.getMonthlyStats);
  router.get('/api/reports/category-stats', authMiddleware, controller.report.getCategoryStats);
  router.get('/api/reports/trend', authMiddleware, controller.report.getTrendData);
  router.get('/api/reports/yearly', authMiddleware, controller.report.getYearlyStats);

  // 搜索相关路由（需要认证）
  router.post('/api/search', authMiddleware, controller.search.search);
  router.get('/api/search/history', authMiddleware, controller.search.getHistory);
  router.delete('/api/search/history/:id', authMiddleware, controller.search.deleteHistory);
  router.delete('/api/search/history', authMiddleware, controller.search.clearHistory);

  // AI 对话路由（需要认证）
  router.post('/api/chat/stream', authMiddleware, controller.chat.stream);
  router.post('/api/chat/ocr-bill', authMiddleware, controller.chat.ocrBill);

  // 预算相关路由（需要认证）
  router.get('/api/budgets', authMiddleware, controller.budget.list);
  router.get('/api/budgets/suggestion', authMiddleware, controller.budget.getSuggestion);
  router.get('/api/budgets/:id', authMiddleware, controller.budget.show);
  router.post('/api/budgets', authMiddleware, controller.budget.create);
  router.put('/api/budgets/:id', authMiddleware, controller.budget.update);
  router.delete('/api/budgets/:id', authMiddleware, controller.budget.destroy);
  router.get('/api/budgets/:id/status', authMiddleware, controller.budget.getStatus);
  router.get('/api/budgets/status/monthly', authMiddleware, controller.budget.getMonthlyStatus);
};
