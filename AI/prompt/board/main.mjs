import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});

const getCompletion = async(prompt,model="gpt-3.5-turbo") => {

    const messages = [{
        role: "user",
        content: prompt
    }]

    const resopnse = await client.chat.completions.create({
        model:model,
        messages:messages,

        temperature:0.1
    })
    return resopnse.choices[0].message.content
};

const main = async () => {
  const user_messages = [
    "La performance du système est plus lente que d'habitude.", //系统的性能比平时慢         
    "Mi monitor tiene píxeles que no se iluminan.", //我的显示器有些像素点不亮。
    "Il mio mouse non funziona", // 我的鼠标坏了
    "Mój klawisz Ctrl jest zepsuty", // 我的Ctrl键坏了
    "我的屏幕在闪烁"                    
    ]
    //for of es6 的遍历
    //计数循环 有什么好的地方？
    for(let issue of user_messages){
        //简洁，代码可读性的提升
        console.log(issue);
        const prompt = `
        Tell me what language this is :"${issue}"
        `
        const country_language = await getCompletion(prompt);
        // console.log(country_language);
        const resultPrompt = `
        帮我翻译以下的文字成中文："${issue}"
        `
        const result = await getCompletion(resultPrompt);
        console.log(`${country_language},翻译结果是:${result}}`);
    }
};

main();