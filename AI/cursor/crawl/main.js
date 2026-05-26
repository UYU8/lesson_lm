// main.js
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');

// 目标URL
const url = 'https://tophub.today/n/KqndgxeLl9';

// 发送HTTP请求获取网页内容
request(url)
  .then(html => {
    // 使用cheerio加载HTML
    const $ = cheerio.load(html);

    // 存储热榜数据
    const hotList = [];

    // 遍历表格中的每一行
    $('table.table tbody tr').each((index, element) => {
      // 提取排名、标题、热度、链接
      const rank = $(element).find('td:nth-child(1)').text().trim();
      const title = $(element).find('td:nth-child(2) a').text().trim();
      const heat = $(element).find('td:nth-child(3)').text().trim();
      const link = 'https://tophub.today' + $(element).find('td:nth-child(2) a').attr('href');

      // 将数据添加到数组中
      hotList.push({ rank, title, heat, link });
    });

    // 将数据保存到CSV文件
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(hotList);

    fs.writeFileSync('weibo_hotlist.csv', csv, 'utf8');

    console.log('热榜数据已保存到 weibo_hotlist.csv');
  })
  .catch(err => {
    console.error(err);
  });

// Removed the call to an undefined function
// apeTopHub();