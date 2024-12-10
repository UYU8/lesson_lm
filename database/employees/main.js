// CommonJs  模块化规范  node早期的模块化方案
// JS 早期没有模块化的方案 
// 函数，类（js没有），js业务简单 页面交互等
// 幻灯片 js 就干这个事
// 越来越复杂了，文件分离，模块化方案需要
// import是关键字 require是函数方法

const sqlite3 = require('sqlite3');
// db是什么？
// 数据库连接对象
// 后端逻辑和数据库逻辑是分开的
// 数据库操作句柄
// 路径
// I/O 操作  
// 涉及到I/O操作，err是否出错，容错是关键
// node js 快 ms级别
// 数据库 别的服务器/硬盘上  慢 s 响应级别是秒级别
// await
const db = new sqlite3.Database('./mydatabase.db',
    async (err) => {

        if (err) {
            console.log('数据库链接失败', err);
            return;
        }
        console.log('数据库链接成功');
        // 风筝  数据库操作句柄
        await db.run(`
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT NOT NULL,
                salary  INTEGER NOT NULL
                )
            `)

    })
