import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const chatApi = async (message) => {
  // 请求行 method + url + http 版本
  // 5173 -> 3000 跨域？同源策略 cors 服务器端， jsonp? 
  // get 简单请求 
  // post 复杂请求
  const response = await axios.post('http://localhost:3000/chatai', 
    // 请求体 json
    message, {
      // 请求头 
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data;
}

// react 内置 hooks 函数  副作用
const App = () => {
  // input question react 全面hooks 
  const [question, setQuestion] = useState('');
  // llm history 
  const [conversation, setConversation] = useState([]);
  // 
  const [loading, setLoading] = useState(false);

  // useEffect 不能直接使用 async await
  useEffect(() => {
    // 本地存储
    const storedConversation = localStorage.getItem('conversation');
    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));
    }

    // 副作用 mounted  updated unmouted 。。。。
    // await chatApi()
    // const callChatAPI = async () => {
    //   await chatApi({message: '你好'})
    // }
    // callChatAPI()
  }, [])

  const askQuestion = async () => {
    // 参数校验
    if (!question.trim()) {
      return ;
    }
    // setConversation([

    // ])
    // 高级语法 函数式更新
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        question: question,
        answer: '等待回答...'
      }
    ])

    setLoading(true);
    // LLM 程序健壮性
    try {
      const message = `你是一个聪明的机器人, 我想知道${question}`;
      const response = await chatApi({message});
      // console.log(response);
      setConversation((prevConversation) => {
        prevConversation[prevConversation.length - 1].answer = response
        localStorage.setItem('conversation', JSON.stringify(prevConversation))
        // 返回一个全新的状态 独立状态
        return [
          ...prevConversation
        ]
      })
    } catch(error) {
      console.warn(error);
    } finally {
      // 一定最后执行
      setLoading(false);
      setQuestion('');
    }

  }

  return (
    <div className="chat-container" style={{position: 'relative'}}>
      <p className="chat-title">我是ollama + deepseek 本地大模型</p>
      {
        conversation.map((item, index) => (
          <div key={index} className="chat-message">
            <div className="chat-question">
              <span className="el-tag el0tag--large">me:</span> {item.question}
            </div>
            <div className="chat-answer">
              {item.answer.content}
              <span className="el-tag el-tag--large">ai:</span>
            </div>
          </div>
        ))
      }
      <div className="chat-input">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)}
          // @keyup.enter={askQuestion}
          onKeyUp={(e) => e.key === 'Enter' && askQuestion()}
          style={{width: '80%'}} 
        />
        <button onClick={askQuestion}>提交</button>
      </div>
      { loading && (
        <div className="loading-container">
          <p>加载中...</p>
        </div>
      )}
    </div>
  )
}

export default App