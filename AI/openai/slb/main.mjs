// 引入OpenAI模块
// AI模块 es6 推出的模块化能力
import OpenAI from 'openai';

//实例化Openai
const openai = new OpenAI({
    //付费
    apiKey: 'sk-5PUDrQhFqCVr0KluhSbYcCgIx6S21dNcxGJOxhpo3BEtIhRw',
    //国内转发 不需要梯子
    baseURL:'https://api.302.ai/v1'
});
// 完成生成 GC
const response = await openai.completions.create({
    model:'gpt-3.5-turbo-instruct',
    max_tokens:256,
    prompt:`假如你是林夕这样的爱情歌曲作词大家，
    请你写一首100字主题为爱上森林北的摇滚歌曲,
    歌词必须全部压韵。森林北是一位美丽、洒脱、有活力的女孩.`
})

console.log(response);