import OpenAI from 'openai';// 如果文件为js后缀则会报错
//es5 js没有模块化能力 在以前前端比较简单 不需要模块化 交给函数就可以了
//入口文件
//mjs es6的模块化

const client = new OpenAI({
    //付费
    apiKey: 'sk-tNolsYgcZZLfGQL0s19mgNC3WlOw3TjoUgnD4N0jS3x1gXXn',
    //国内转发 不需要梯子
    baseURL:'https://api.302.ai/v1'
});
const main = async()=> {
    //AIGC 图片
    const response = await client.images.generate({
        model:'dall-e-3',// 使用这个模型
        prompt:'A spaceship flying through the universe.',
        n:1,//生成几张图片
        size:'1024x1024',//图片大小
    })
    console.log(response.data[0].url);
}
main();