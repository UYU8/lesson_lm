/**
 * 创建管理员用户脚本
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'mobile_accounting'
};

async function createAdmin() {
  try {
    const conn = await mysql.createConnection(DB_CONFIG);
    console.log('✓ 数据库连接成功');

    const adminUsername = 'admin';
    const adminPassword = '123456';
    const adminId = uuidv4();

    // 检查用户是否已存在
    const [[user]] = await conn.execute(
      'SELECT id FROM users WHERE username = ?',
      [adminUsername]
    );

    if (user) {
      console.log(`✓ 用户 ${adminUsername} 已存在，将其设为管理员...`);
      await conn.execute(
        'UPDATE users SET role = "admin" WHERE username = ?',
        [adminUsername]
      );
      console.log(`✓ 用户 ${adminUsername} 已设为管理员！`);
    } else {
      // 密码加密
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 插入管理员用户
      await conn.execute(
        'INSERT INTO users (id, username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [adminId, adminUsername, `${adminUsername}@app.local`, hashedPassword, 'admin', 1]
      );

      console.log(`✓ 管理员账号创建成功！`);
      console.log(`  用户名: ${adminUsername}`);
      console.log(`  密码: ${adminPassword}`);
    }

    await conn.end();
  } catch (error) {
    console.error('✗ 创建失败:', error.message);
    process.exit(1);
  }
}

createAdmin();
