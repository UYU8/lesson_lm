/** DOM 树ready 之后 onLoad 晚了， DOMContentLoaded html节点
 *  事件监听
 *  请求....
 * 不出问题， 最快的时机（onLoad 早）
 */
// 常量配置
const MESSAGE_LIMIT = 50;

document.addEventListener('DOMContentLoaded', function() {
  // console.log('DOMContentLoaded')
  const backToTopButton = document.getElementById('back-to-top');
  const chatLogElement = document.getElementById('chat-log');
  const conversationListElement = document.getElementById('conversation-list');
  const messageInput = document.getElementById('message');
  const loadingIndicator = document.querySelector('.loading-indicator');
  // scrollTop 
  chatLogElement.addEventListener('scroll', () => {
    if (chatLogElement.scrollTop > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  })

  backToTopButton.addEventListener('click', () => {
    chatLogElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
  // 打字机效果
  const  typeMessage = (bubble, content, callback) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < content.length) {
        bubble.textContent += content.charAt(index++);
      } else {
        // 严谨
        clearInterval(intervalId)
        if (typeof callback === 'function') {
          callback()
        }
      }
    }, 50)
  }
  // 添加复制按钮
  const addCopyButton = (messageWrapper, content) => {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.classList.add('copy-button');

    copyButton.addEventListener('click', () => {
      // BOM Browser Object Model 浏览器对象模型
      // 向剪贴板中写入内容
      navigator.clipboard.writeText(content)
        .then(() => {
          alert('内容已复制到剪贴板');
        })
        .catch(err => {
          console.error('无法复制文本：', err);
          alert('复制失败，清尝试手动选择并复制。');
        })
    })

    messageWrapper.appendChild(copyButton);
  }
  // 保存聊天记录
  const saveChatLog = (role, content) => {
    // localStorage 字符串 JSON.stringify JSON.parse
    const chatLog = JSON.parse(localStorage.getItem('chatLog')) || [];
    chatLog.push({
      role,
      content
    })
    localStorage.setItem('chatLog', JSON.stringify(chatLog))
  }

  // 添加消息 chat-log
  const appendMessage = (role, content, type='save') => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message', role); 

    const bubble = document.createElement('div');
    bubble.classList.add('bubble', `${role}-bubble`);
    
    if (role === 'assistant') {
      // 流式输出
      typeMessage(
        bubble, 
        content, 
        ()=>addCopyButton(messageWrapper, content)
      )
    } else {
      bubble.textContent = content;
      messageWrapper.appendChild(bubble);
    }
    messageWrapper.appendChild(bubble);
    chatLogElement.appendChild(messageWrapper);
    chatLogElement.scrollTop = chatLogElement.scrollHeight;
    if (type === 'save') {
      saveChatLog(role, content) // bug 原因
    }
    
  } 
  // 发送消息 调用接口
  const sendMessage = (message) => {
    // fetch promise 的实例
    return fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {"role": "user", "content": message}
        ],
        temperature: 0.7
      })
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data, '/////')
      return data.message
    })
    // 链式调用
  }

  // 显示加载中
  const showLoadingIndicator = () => {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }
  }
  // 隐藏加载中
  const hideLoadingIndicator = () => {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }

  

  // 发送消息
  document.querySelector('.send-icon').addEventListener('click', async () => {
    const messageText = messageInput.value.trim();

    if (messageText) {
      appendMessage('user', messageText); // 封装 
      messageInput.value = '';
      // llm 接口调用
      try {
        showLoadingIndicator();
        // await 返回promise的耗时任务
        const assistantMessage = await sendMessage(messageText)
        hideLoadingIndicator();
        appendMessage('assistant', assistantMessage);
      } catch(error) {
        console.error('发送消息时出错:', error)
        appendMessage('assistant', '抱歉，我遇到了一个问题，无法回复。')
      }
    }

  })
  // enter 发送消息
  messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) { // 回车， 并且没有同时按下shift 
      event.preventDefault(); // 阻止默认行为
      document.querySelector('.send-icon').click(); // 触发点击事件
    }
  })

  // 对话历史加载 
  const loadChatLog = () => {
    const chatLog = JSON.parse(localStorage.getItem('chatLog')) || [];
    // 负值， 后面开始
    chatLog.slice(-MESSAGE_LIMIT).forEach(
      ({ role, content }) => appendMessage(role, content, 'init')
    )
  }
  // 保存当前对话 to be continue 
  const saveCurrentConversation = () => {
    const currentChatLog = JSON.parse(localStorage.getItem("chatLog")) || [];
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const timestamp = new Date().toLocaleString();
    chatHistory.push({
      // 产品需求 实现
      name: `对话 ${chatHistory.length + 1} (${timestamp})`,
      messages: currentChatLog
    })
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }

  // 创建新的对话
  const startNewConversation = () => {
    // console.log('new conversation')
    saveCurrentConversation();
    localStorage.removeItem('chatLog');
    chatLogElement.innerHTML = '';
  }

  const loadConversationList = () => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach((conversation, index) => {
      const button = document.createElement('button');
      button.setAttribute('data-index', index);
      button.innerHTML = `${conversation.name} <span class="delete-btn" data-index="${index}">x</span>`;
      // 性能不好
      // button.onclick = function() {
      //   console.log(this.innerHTML);
      // }
      conversationListElement.appendChild(button);
    })
  }

  const loadConversation = (index) => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const conversation = chatHistory[index].messages || [];
    chatLogElement.innerHTML = '';
    conversation.slice(-MESSAGE_LIMIT).forEach(({
      role,
      content
    }) => appendMessage(role, content));
    localStorage.setItem('chatLog', JSON.stringify(conversation)); 
  }
  // 删除聊天历史
const deleteChatHistory = (index) => {
  // 从 localStorage 中获取聊天历史记录
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  
  // 检查索引是否有效
  if (index >= 0 && index < chatHistory.length) {
    // 删除指定索引的聊天历史记录
    chatHistory.splice(index, 1);
    
    // 将更新后的聊天历史记录保存到 localStorage 中
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // 重新加载对话列表
    const conversationListElement = document.getElementById('conversation-list');
    conversationListElement.innerHTML = '';
    loadConversationList();
  }
};
  conversationListElement.addEventListener('click', function(event) {
    console.log(event.target);
    const index = event.target.getAttribute('data-index') || 0;
    // remove history 删除历史 
    if (event.target.nodeName === 'SPAN') {
      // console.log('/////')
      deleteChatHistory(index);
      return;
    }
    // 加载历史
    
    loadConversation(index);
  })

  const main = () => {
    loadChatLog();
    loadConversationList();
  }

  main();

  window.startNewConversation = startNewConversation;
  window.saveCurrentConversation = saveCurrentConversation;
})
/* 所有的资源加载完了 */
// window.addEventListener('load', function(event) {
//   // 当所有资源（包括样式表、图片等）加载完毕后执行的代码
//   // console.log('All resources finished loading');
// });