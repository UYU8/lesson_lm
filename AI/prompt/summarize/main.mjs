import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();// 找到根目录下env文件，读取其中的配置信息，添加到process.env对象上
//main.mjs 启动时就会启动一个进程 proccess 后端
//env 对象 环境对象
//进程是分配资源的最小单位
console.log(process.env);
const client = new OpenAI({
    //process 是node里的进程对象
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});
// es6 默认参数值 model="gpt-3.5-turbo" 
// 通用的LLM大模型 聊天完成接口函数，可复用
const getCompletion = async(prompt,model="gpt-3.5-turbo") => {
    // 用户提的问题
    const messages = [{
        role: "user",
        content: prompt
    }]
    // AIGC chat 接口
    const resopnse = await client.chat.completions.create({
        model:model,
        messages:messages,
        // LLM 生成内容的随机性
        temperature:0
    })
    return resopnse.choices[0].message.content
};
const main = async() => {
    const prod_review = `
    我玩完艾尔登法环后久久难以释怀，觉得再也没有比这更好玩的游戏了，
    好想要一个没有玩过它的脑子。
  `;
// 初级prompt 设计原则
// 准确表达任务
// 给他一个角色
// 减少出错的可能
// 商品评论prompt 模板
  const prompt = `
  你的任务是从steam游戏评论页面中提取出玩家高质量评论，
  并对此进行一个摘要。
  总结下面用三个反引号分隔的评论，最多15个字。
  评论:'''${prod_review}'''
  `;
    const response = await getCompletion(prompt)
    console.log(response);
};

main()