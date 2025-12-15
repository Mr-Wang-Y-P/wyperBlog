import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const API_URL = 'https://wyperblognode.wyper.cloud/api/talk';

const ChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const messagesEndRef = useRef(null);
  const autoScroll = useRef(true);

  // 获取当前用户的加密IP
  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/current-user`);
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const msgs = await response.json();
      setMessages(msgs);
      
      // 只有在启用自动滚动时才滚动到底部
      if (autoScroll.current && isOpen) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to local storage if backend fails
      const localMessages = JSON.parse(localStorage.getItem('wyper_chat') || '[]');
      setMessages(localMessages);
    }
  };

  // Polling mechanism
  useEffect(() => {
    getCurrentUser(); // 获取当前用户
    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 300); // Poll every 2s

    return () => clearInterval(interval);
  }, []);

  // 处理滚动事件，如果用户手动滚动则禁用自动滚动
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // 如果接近底部，则重新启用自动滚动
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      autoScroll.current = true;
    } else {
      // 如果用户向上滚动，则禁用自动滚动
      autoScroll.current = false;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const newMsg = await response.json();
      setMessages(prev => [...prev, newMsg]);
      setInput('');
      
      // 发送消息后重新启用自动滚动
      autoScroll.current = true;
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to local storage if backend fails
      const newMsg = {
        id: Date.now(),
        time: new Date().toISOString(),
        user: "guest",
        avatar: "https://www.weavefox.cn/api/bolt/unsplash_image?keyword=cat&width=100&height=100&random=guest",
        content: input,
      };

      // Save to localStorage as fallback
      const chats = JSON.parse(localStorage.getItem('wyper_chat') || '[]');
      chats.push(newMsg);
      if (chats.length > 50) chats.shift();
      localStorage.setItem('wyper_chat', JSON.stringify(chats));
      
      setMessages(prev => [...prev, newMsg]);
      setInput('');
      
      // 发送消息后重新启用自动滚动
      autoScroll.current = true;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--secondary)] rounded-full flex items-center justify-center shadow-[0_0_20px_var(--shadow-color)] z-40 hover:bg-[var(--primary)] transition-colors duration-300"
        >
          <MessageSquare size={24} className="text-[var(--bg-body)]" />
        </motion.button>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 w-full md:w-80 bg-[var(--bg-card)]/95 backdrop-blur-xl border-l border-[var(--border-color)] z-40 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                <span className="font-bold text-[var(--text-main)]">实时讨论</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4"
              onScroll={handleScroll}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${msg.user === currentUser ? 'flex-row-reverse' : ''}`}
                >
                  <img 
                    src={msg.avatar} 
                    alt={msg.user} 
                    className="w-8 h-8 rounded-full border border-[var(--border-color)] object-cover"
                  />
                  <div className={`flex flex-col max-w-[75%] ${msg.user === currentUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--text-muted)]">{msg.user}</span>
                      <span className="text-[10px] text-[var(--text-muted)] opacity-70">
                        {formatDistanceToNow(new Date(msg.time), { addSuffix: true, locale: zhCN })}
                      </span>
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-sm transition-colors duration-300 ${
                      msg.user === currentUser
                        ? 'bg-[var(--primary)] text-[var(--bg-body)] rounded-tr-none' 
                        : 'bg-[var(--bg-input)] text-[var(--text-main)] rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-body)]/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入消息..."
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full py-2.5 pl-4 pr-12 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[var(--secondary)] rounded-full text-white hover:bg-[var(--primary)] hover:text-[var(--bg-body)] transition-all disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatDrawer;