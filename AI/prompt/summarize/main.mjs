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
  我女儿生日时买了这个熊猫毛绒玩具，她很喜欢，到处都带着。
  它柔软、超级可爱，脸看起来很友好。
  不过，相对于我付的价格来说，它有点小。
  我想，同样的价格，也许还有其他更大的选择。
  它比预期早到了一天，所以我有机会自己玩了一会儿，然后才把它送给她。
  `;
// 初级prompt 设计原则
// 准确表达任务
// 给他一个角色
// 减少出错的可能
// 商品评论prompt 模板
  const prompt = `
  您的任务是生成来自电子商务网站产品评论的简单摘要。
  总结下面用三个反引号分隔的评论，最多30个字。
  评论:'''${prod_review}'''
  `;
    const response = await getCompletion(prompt)
    console.log(response);
};

main()