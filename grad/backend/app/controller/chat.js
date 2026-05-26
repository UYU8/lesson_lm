'use strict';

const Controller = require('egg').Controller;
const https = require('https');

const ZHIPU_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL = 'glm-4-flash';

class ChatController extends Controller {
  async stream() {
    const { ctx, app } = this;
    const userId = ctx.state.user.id;
    const { messages } = ctx.request.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'messages 不能为空' };
      return;
    }

    let contextText = '';
    try {
      const now = new Date();
      const months = [];
      for (let i = 0; i < 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }
      const statsArr = await Promise.all(months.map(ym => ctx.service.report.getMonthlyStats(userId, ym)));
      const lines = statsArr.map((s, i) => {
        if (!s) return null;
        return `${months[i]}：收入 ${s.income ?? 0} 元，支出 ${s.expense ?? 0} 元，共 ${s.transactionCount ?? 0} 笔`;
      }).filter(Boolean);
      if (lines.length) contextText = `用户近期账单：\n${lines.join('\n')}`;
    } catch (_) {}

    const systemPrompt = [
      '你是用户的私人财务 AI 助手，帮助分析账单、制定预算、提供储蓄建议。',
      '回答简洁、亲切，使用中文，适当使用 emoji。',
      contextText,
    ].filter(Boolean).join('\n');

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const apiKey = app.config.zhipuApiKey || process.env.ZHIPU_API_KEY;

    const reqBody = JSON.stringify({
      model: MODEL,
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    ctx.respond = false;
    const res = ctx.res;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    await new Promise((resolve, reject) => {
      const url = new URL(ZHIPU_URL);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(reqBody),
        },
      }, (zhipuRes) => {
        zhipuRes.on('data', (chunk) => {
          for (const line of chunk.toString().split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') { res.write('data: [DONE]\n\n'); continue; }
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
            } catch (_) {}
          }
        });
        zhipuRes.on('end', () => { res.end(); resolve(); });
        zhipuRes.on('error', reject);
      });
      req.on('error', (e) => { res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`); res.end(); resolve(); });
      req.write(reqBody);
      req.end();
    });
  }

  async ocrBill() {
    const { ctx, app } = this;
    const { imageBase64 } = ctx.request.body;

    if (!imageBase64) {
      ctx.body = { code: 1, message: '缺少图片数据' };
      return;
    }

    const apiKey = app.config.zhipuApiKey || process.env.ZHIPU_API_KEY;
    const today = new Date().toISOString().split('T')[0];

    const prompt = `请识别这张账单/支付截图，提取以下信息并严格以 JSON 格式返回，不要包含任何其他文字：
{"amount":金额数字,"type":"expense或income","categoryName":"中文分类名如餐饮交通购物娱乐医疗日用工资","description":"商家或描述（简短）","date":"${today}"}
只返回 JSON。`;

    const reqBody = JSON.stringify({
      model: 'glm-4v-flash',
      messages: [{ role: 'user', content: [
        { type: 'image_url', image_url: { url: imageBase64 } },
        { type: 'text', text: prompt },
      ]}],
      temperature: 0.1,
    });

    try {
      const result = await new Promise((resolve, reject) => {
        const url = new URL(ZHIPU_URL);
        const req = https.request({
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(reqBody),
          },
        }, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            try {
              const content = JSON.parse(data).choices?.[0]?.message?.content || '';
              const match = content.match(/\{[\s\S]*\}/);
              if (!match) { reject(new Error('无法解析识别结果')); return; }
              resolve(JSON.parse(match[0]));
            } catch (e) {
              reject(new Error('解析失败: ' + e.message));
            }
          });
        });
        req.on('error', reject);
        req.write(reqBody);
        req.end();
      });

      ctx.body = { code: 0, message: 'success', data: result };
    } catch (e) {
      ctx.body = { code: 1, message: e.message || '识别失败' };
    }
  }
}

module.exports = ChatController;
