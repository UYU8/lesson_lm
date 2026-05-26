/**
 * 演示数据种子脚本
 * 用法: node database/seed.js
 */

const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const DB = { host: 'localhost', port: 3306, user: 'root', password: '123456', database: 'mobile_accounting' };

// 用户 kaiiyu 的分类映射
const CAT = {
  // 支出
  食物:   '03bafd8f-8e30-4c0a-9f3a-25bff75a3dbf',
  餐饮:   'b7f4d21f-bb83-4acc-854f-8f0a29343394',
  交通:   '34862cbe-f18d-48b9-a805-051e6e61d447',
  娱乐:   '29d9b55a-8e62-4930-8fc0-4ee973beb25a',
  购物:   'e83a332d-42b5-4781-92fc-49761ba0e462',
  服饰:   '50cca0f8-e563-4168-99e6-98f37941bb11',
  住房:   '60a8f087-a677-4ec6-a53e-50aac320897b',
  日用:   '40753473-83ba-4189-9567-80fe2e311e36',
  零食:   '088d9115-9bad-4a93-831f-90785f81af72',
  运动:   '61e7f372-0d85-4939-976a-d202646692c3',
  旅行:   '59b663a5-a90d-49ca-90bb-065085d276b5',
  书籍:   '1fd6d605-361d-41f6-a3c4-39c3d9d63a1e',
  医疗:   '53e77a16-909c-4b89-942b-1158c837ad70',
  社交:   'ed6bca88-1984-4a88-adc3-79f03c6365d9',
  通讯:   'cf62d3ab-2572-44e1-af4f-1c7b1bdf73f1',
  // 收入
  工资:   '38b0fc84-8ca6-477b-a5b7-4f58ec154552',
  奖金:   '9b41afde-0593-433a-ae1e-1972cc83ba60',
  兼职:   '356b8e9f-883b-4e7a-a46f-2a4dcde0a06b',
  理财:   'c6c9e20b-6520-4941-8d38-95bee291bb4f',
  报销:   '9ad9b277-34de-4fe2-90e3-94e46acad032',
};

const USER_ID = '967d00d2-4a57-438e-8e6c-25e17d7a5728';

function d(year, month, day) {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

// 生成每月流水模板
function monthlyTxns(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const maxDay = (year === 2026 && month === 5) ? 2 : daysInMonth;

  const txns = [];

  // 固定收入：工资（1号）
  if (1 <= maxDay) {
    txns.push({ cat: '工资', type: 'income', amount: 12800 + Math.floor(Math.random()*2000), desc: '月薪', date: d(year, month, 1) });
  }

  // 固定支出：房租（1号）
  if (1 <= maxDay) {
    txns.push({ cat: '住房', type: 'expense', amount: 2800, desc: '月租金', date: d(year, month, 1) });
  }

  // 手机话费（3号）
  if (3 <= maxDay) {
    txns.push({ cat: '通讯', type: 'expense', amount: 99, desc: '手机套餐', date: d(year, month, 3) });
  }

  // 每日餐饮、交通等随机生成
  const dailyTemplates = [
    () => ({ cat: '餐饮', type: 'expense', amount: 18 + Math.floor(Math.random()*30), desc: ['早餐', '午餐', '晚餐', '外卖'][Math.floor(Math.random()*4)] }),
    () => ({ cat: '餐饮', type: 'expense', amount: 25 + Math.floor(Math.random()*40), desc: ['和同事吃饭', '午饭', '外卖', '自助餐'][Math.floor(Math.random()*4)] }),
    () => ({ cat: '交通', type: 'expense', amount: 3 + Math.floor(Math.random()*15), desc: ['地铁', '公交', '打车'][Math.floor(Math.random()*3)] }),
    () => ({ cat: '零食', type: 'expense', amount: 12 + Math.floor(Math.random()*30), desc: ['奶茶', '咖啡', '零食', '饮料'][Math.floor(Math.random()*4)] }),
  ];

  for (let day = 1; day <= maxDay; day++) {
    // 每天 1-3 笔餐饮/交通
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const fn = dailyTemplates[Math.floor(Math.random() * dailyTemplates.length)];
      const t = fn();
      txns.push({ ...t, date: d(year, month, day) });
    }
  }

  // 周末娱乐（根据月份随机几次）
  const weekendDays = [];
  for (let day = 1; day <= maxDay; day++) {
    const dow = new Date(year, month - 1, day).getDay();
    if (dow === 0 || dow === 6) weekendDays.push(day);
  }
  weekendDays.slice(0, Math.min(4, weekendDays.length)).forEach(day => {
    txns.push({ cat: '娱乐', type: 'expense', amount: 50 + Math.floor(Math.random()*150), desc: ['电影', '游戏', 'KTV', '密室逃脱', '展览'][Math.floor(Math.random()*5)], date: d(year, month, day) });
  });

  // 购物（每月 2-4 次）
  const shopDays = Array.from({length: Math.min(maxDay, 28)}, (_,i) => i+1).sort(() => Math.random()-0.5).slice(0, 3);
  shopDays.forEach(day => {
    txns.push({ cat: '购物', type: 'expense', amount: 100 + Math.floor(Math.random()*500), desc: ['淘宝购物', '京东下单', '超市', '便利店'][Math.floor(Math.random()*4)], date: d(year, month, day) });
  });

  // 日用品（每月 1-2 次）
  if (Math.min(maxDay, 10) >= 5) {
    txns.push({ cat: '日用', type: 'expense', amount: 30 + Math.floor(Math.random()*80), desc: '日用品', date: d(year, month, Math.min(5, maxDay)) });
  }

  return txns;
}

// 特殊月份数据（更丰富）
function extraTxns() {
  return [
    // 1月：年终奖
    { cat: '奖金', type: 'income', amount: 18000, desc: '年终奖', date: '2026-01-08' },
    { cat: '旅行', type: 'expense', amount: 3200, desc: '春节回家机票', date: '2026-01-22' },
    { cat: '社交', type: 'expense', amount: 680, desc: '年会聚餐', date: '2026-01-15' },
    { cat: '服饰', type: 'expense', amount: 899, desc: '冬季外套', date: '2026-01-18' },
    // 2月：情人节、春节
    { cat: '社交', type: 'expense', amount: 520, desc: '情人节晚餐', date: '2026-02-14' },
    { cat: '购物', type: 'expense', amount: 1280, desc: '春节置办年货', date: '2026-02-08' },
    { cat: '兼职', type: 'income', amount: 2400, desc: '设计稿酬', date: '2026-02-18' },
    // 3月：健身、报销
    { cat: '运动', type: 'expense', amount: 599, desc: '健身房年卡', date: '2026-03-02' },
    { cat: '报销', type: 'income', amount: 860, desc: '差旅报销', date: '2026-03-20' },
    { cat: '医疗', type: 'expense', amount: 265, desc: '体检', date: '2026-03-12' },
    { cat: '书籍', type: 'expense', amount: 198, desc: '技术书籍', date: '2026-03-25' },
    // 4月：旅行
    { cat: '旅行', type: 'expense', amount: 2800, desc: '清明出游', date: '2026-04-04' },
    { cat: '旅行', type: 'expense', amount: 680, desc: '住宿', date: '2026-04-05' },
    { cat: '理财', type: 'income', amount: 540, desc: '基金收益', date: '2026-04-15' },
    { cat: '服饰', type: 'expense', amount: 456, desc: '春季新款', date: '2026-04-20' },
    // 5月（本月）
    { cat: '社交', type: 'expense', amount: 320, desc: '朋友聚餐', date: '2026-05-01' },
    { cat: '运动', type: 'expense', amount: 88, desc: '羽毛球场地', date: '2026-05-01' },
    { cat: '兼职', type: 'income', amount: 1800, desc: '周末兼职', date: '2026-05-02' },
  ];
}

async function seed() {
  const conn = await mysql.createConnection(DB);
  console.log('✓ 连接数据库成功');

  // 检查是否已有大量数据
  const [[{cnt}]] = await conn.execute('SELECT COUNT(*) as cnt FROM transactions WHERE user_id = ?', [USER_ID]);
  if (cnt > 50) {
    console.log(`⚠ 用户已有 ${cnt} 条记录，跳过（删除后重新运行可清空）`);
    await conn.end();
    return;
  }

  const allTxns = [];

  // 生成 1-5 月每月数据
  [[2026,1],[2026,2],[2026,3],[2026,4],[2026,5]].forEach(([y, m]) => {
    allTxns.push(...monthlyTxns(y, m));
  });

  // 追加特殊数据
  allTxns.push(...extraTxns());

  // 去重过滤（特殊数据和日常数据同一天可能重叠，不影响）
  let inserted = 0;
  for (const t of allTxns) {
    await conn.execute(
      'INSERT INTO transactions (id, user_id, category_id, amount, type, description, date) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), USER_ID, CAT[t.cat], t.amount, t.type, t.desc, t.date]
    );
    inserted++;
  }

  console.log(`✓ 成功插入 ${inserted} 条交易记录`);
  await conn.end();
}

seed().catch(err => { console.error('✗ 失败:', err.message); process.exit(1); });
