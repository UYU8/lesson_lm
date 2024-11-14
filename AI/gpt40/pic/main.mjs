import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config();
// 实例化openai 客户端
const client = new OpenAI({
    apiKey:process.env.OpenAI_API_KEY,
    baseURL: 'https://api.302.ai/v1'  //负责转发
})

// 函数申明
// function main(){
//   console.log('ai 全栈开始了')
// }
// 良好的编程风格 
// 主函数 执行的入口 单点入口
// es6 箭头函数 比传统函数更加简洁
// 赋值语句 弱类型语言 
// 在JavaScript中函数也是对象
// 函数表达式 没赋值之前main是undefined 赋值之后是一个函数对象
// async 是函数修饰符，async和await 是一对
const main = async() => {
    // openai 的调用是异步的 
    // await 等会儿 等openai 给我返回结果了 再继续往下执行
    // 异步函数 必须使用await 等待返回结果 否则会报错
    // chat 聊天的方式调用
    // completions 完成问答
    // create 创建

    const resopnse = await client.chat.completions.create({
        model:'gpt-4o',
        messages:[
            {
                role:'user',  //角色
                content:[
                    {
                        type:'text',
                        'text':'请描述以下图片的内容'

                    },
                    {
                        type:'image_url',
                        'image_url':{
                            'url':'https://n.sinaimg.cn/sinakd20101/695/w1215h1080/20211113/4987-211e2dada196797d5ec42e8f747255ce.jp'
                        }
                    }
                ]

            }
        ],
        max_tokens:300
    })
    try{
        const resopnse = await client.chat.completions.create({
            model:'gpt-4o',
            messages:[
                {
                    role:'user',  //角色
                    content:[
                        {
                            type:'text',
                            'text':'请描述以下图片的内容'
    
                        },
                        {
                            type:'image_url',
                            'image_url':{
                                'url':'https://n.sinaimg.cn/sinakd20101/695/w1215h1080/20211113/4987-211e2dada196797d5ec42e8f747255ce.jp'
                            }
                        }
                    ]
    
                }
            ],
            max_tokens:300
        })
        console.log(resopnse.choices[0].message.content)
    }catch(err){
        console.log('err')
    }
}

// main()