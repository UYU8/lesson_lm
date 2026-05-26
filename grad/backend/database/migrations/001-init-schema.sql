-- 初始化数据库 schema

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY COMMENT '用户 ID',
  username VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY COMMENT '分类 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  name VARCHAR(255) NOT NULL COMMENT '分类名称',
  type ENUM('income', 'expense') NOT NULL COMMENT '分类类型：收入或支出',
  icon VARCHAR(255) COMMENT '分类图标',
  color VARCHAR(20) COMMENT '分类颜色',
  is_default BOOLEAN DEFAULT FALSE COMMENT '是否为默认分类',
  sort_order INT DEFAULT 0 COMMENT '排序顺序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_category (user_id, name),
  INDEX idx_user_id (user_id),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 交易表
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY COMMENT '交易 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  category_id VARCHAR(36) NOT NULL COMMENT '分类 ID',
  amount DECIMAL(10, 2) NOT NULL COMMENT '金额',
  type ENUM('income', 'expense') NOT NULL COMMENT '交易类型：收入或支出',
  description TEXT COMMENT '交易描述/备注',
  date DATE NOT NULL COMMENT '交易日期',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_date (date),
  INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易表';

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id VARCHAR(36) PRIMARY KEY COMMENT '标签 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  name VARCHAR(100) NOT NULL COMMENT '标签名称',
  color VARCHAR(20) COMMENT '标签颜色',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tag (user_id, name),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 交易-标签关联表
CREATE TABLE IF NOT EXISTS transaction_tags (
  id VARCHAR(36) PRIMARY KEY COMMENT '关联 ID',
  transaction_id VARCHAR(36) NOT NULL COMMENT '交易 ID',
  tag_id VARCHAR(36) NOT NULL COMMENT '标签 ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_transaction_tag (transaction_id, tag_id),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易-标签关联表';

-- 预算表
CREATE TABLE IF NOT EXISTS budgets (
  id VARCHAR(36) PRIMARY KEY COMMENT '预算 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  category_id VARCHAR(36) NOT NULL COMMENT '分类 ID',
  amount DECIMAL(10, 2) NOT NULL COMMENT '预算金额',
  year INT NOT NULL COMMENT '年份',
  month INT NOT NULL COMMENT '月份',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_category_month (user_id, category_id, year, month),
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_year_month (year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算表';

-- 聊天消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(36) PRIMARY KEY COMMENT '消息 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  role ENUM('user', 'assistant') NOT NULL COMMENT '角色：用户或助手',
  content LONGTEXT NOT NULL COMMENT '消息内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天消息表';

-- 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id VARCHAR(36) PRIMARY KEY COMMENT '搜索历史 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  query VARCHAR(255) NOT NULL COMMENT '搜索查询',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- 刷新令牌表（用于 JWT 双 token 模式）
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY COMMENT '令牌 ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户 ID',
  token VARCHAR(500) NOT NULL UNIQUE COMMENT '刷新令牌',
  expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='刷新令牌表';
