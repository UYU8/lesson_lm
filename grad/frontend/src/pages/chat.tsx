import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import './chat.css';

marked.setOptions({ breaks: true });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const SUGGESTIONS = [
  '本月支出情况怎么样？',
  '帮我分析一下消费习惯',
  '这个月哪类支出最多？',
  '帮我制定一个储蓄计划',
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:7001/api';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    resizeTextarea();
  };

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', streaming: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content });

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) throw new Error('请求失败');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const { content: delta } = JSON.parse(data);
            if (delta) {
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: m.content + delta } : m
              ));
            }
          } catch (_) {}
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: m.content || '抱歉，出现了错误，请稍后再试。', streaming: false }
            : m
        ));
      }
    } finally {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ));
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
  };

  const formatTime = (id: string) => {
    const ts = parseInt(id);
    if (isNaN(ts)) return '';
    return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      {/* 顶部导航 */}
      <div className="chat-nav">
        <button className="chat-nav-back" onClick={() => navigate(-1)}>
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1.5 8.5L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="chat-nav-title">AI 助手</span>
        <button className="chat-nav-action" onClick={handleClear} disabled={messages.length === 0}>
          新建对话
        </button>
      </div>

      {/* 消息区域 */}
      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-avatar"><span>✦</span></div>
            <div className="chat-empty-title">有什么可以帮你？</div>
            <div className="chat-empty-sub">基于你的账单数据，我可以帮你分析收支、规划预算</div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg chat-msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="chat-msg-avatar">✦</div>
                )}
                <div className="chat-msg-wrap">
                  <div className="chat-msg-bubble">
                    {msg.role === 'assistant' ? (
                      msg.streaming && msg.content === '' ? (
                        <span className="chat-msg-typing"><span /><span /><span /></span>
                      ) : (
                        <>
                          <div
                            className="chat-md"
                            dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                          />
                          {msg.streaming && <span className="chat-cursor" />}
                        </>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                  {!msg.streaming && (
                    <div className="chat-msg-time">{formatTime(msg.id)}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入栏 */}
      <div className="chat-input-bar">
        <form className="chat-input-inner" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="发消息给 AI 助手..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`chat-send-btn${inputValue.trim() ? ' active' : ''}`}
            disabled={isLoading || !inputValue.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
