/**
 * 数据库初始化脚本
 * 用法: node database/init.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function initDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
  };

  const dbName = process.env.DB_NAME || 'mobile_accounting';

  try {
    // 连接到 MySQL
    const connection = await mysql.createConnection(config);
    console.log('✓ 已连接到 MySQL');

    // 创建数据库
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ 数据库 ${dbName} 已创建或已存在`);

    // 选择数据库（使用 query 而不是 execute，因为 USE 不支持预处理语句）
    await connection.query(`USE ${dbName}`);

    // 读取并执行迁移脚本
    const migrationFile = path.join(__dirname, 'migrations', '001-init-schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    // 分割 SQL 语句并执行
    const statements = sql.split(';').filter((stmt) => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✓ 数据库 schema 已初始化');

    // 初始化预设分类（可选，跳过外键约束问题）
    // await initializeDefaultCategories(connection);

    // 关闭连接
    await connection.end();
    console.log('✓ 数据库初始化完成');
  } catch (error) {
    console.error('✗ 数据库初始化失败:', error.message);
    console.error('\n详细错误信息:');
    console.error(error);
    console.error('\n可能的原因:');
    console.error('1. MySQL 服务未启动');
    console.error('2. 数据库连接信息不正确（检查 .env 文件）');
    console.error('3. MySQL 用户没有创建数据库的权限');
    console.error('4. 迁移脚本文件不存在或格式错误');
    process.exit(1);
  }
}

/**
 * 初始化预设分类
 */
async function initializeDefaultCategories(connection) {
  const { v4: uuidv4 } = require('uuid');

  // 预设分类数据
  const defaultCategories = [
    // 支出分类
    { name: '食物', type: 'expense', icon: 'food', color: '#FF6B6B' },
    { name: '交通', type: 'expense', icon: 'transport', color: '#4ECDC4' },
    { name: '娱乐', type: 'expense', icon: 'entertainment', color: '#FFE66D' },
    { name: '购物', type: 'expense', icon: 'shopping', color: '#95E1D3' },
    { name: '医疗', type: 'expense', icon: 'medical', color: '#F38181' },
    { name: '其他', type: 'expense', icon: 'other', color: '#CCCCCC' },
    // 收入分类
    { name: '工资', type: 'income', icon: 'salary', color: '#34C759' },
    { name: '奖金', type: 'income', icon: 'bonus', color: '#00C7BE' },
    { name: '兼职', type: 'income', icon: 'parttime', color: '#30B0C0' },
    { name: '其他', type: 'income', icon: 'other', color: '#CCCCCC' },
  ];

  try {
    // 检查是否已经初始化过
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM categories WHERE is_default = 1'
    );

    if (rows[0].count > 0) {
      console.log('✓ 预设分类已存在，跳过初始化');
      return;
    }

    // 插入预设分类
    for (const category of defaultCategories) {
      const id = uuidv4();
      // 使用系统用户 ID（为了演示，使用固定的 UUID）
      const systemUserId = '00000000-0000-0000-0000-000000000000';

      await connection.execute(
        'INSERT INTO categories (id, user_id, name, type, icon, color, is_default) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [id, systemUserId, category.name, category.type, category.icon, category.color]
      );
    }

    console.log('✓ 预设分类已初始化');
  } catch (error) {
    console.error('✗ 预设分类初始化失败:', error.message);
    // 不中断初始化流程
  }
}

initDatabase();
