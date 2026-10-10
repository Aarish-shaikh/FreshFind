import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, PageView } from '../types';
import chatbotData from '../data/chatbot.json';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  RotateCcw, 
  Bot, 
  User as UserIcon,
  HelpCircle
} from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen, navigateTo } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: chatbotData.welcomeMessage.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: chatbotData.welcomeMessage.quickReplies
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatbotOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [chatbotOpen, messages]);

  const findRuleMatch = (text: string) => {
    const lower = text.toLowerCase();
    for (const rule of chatbotData.rules) {
      for (const kw of rule.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          return rule;
        }
      }
    }
    return null;
  };

  const handleSendMessage = (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Rule-based processing with a brief human-like 400ms delay
    setTimeout(() => {
      const match = findRuleMatch(trimmed);

      let botReply: ChatMessage;
      if (match) {
        botReply = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: match.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: match.quickReplies,
          actionLink: match.actionLink ? {
            label: match.actionLink.label,
            page: match.actionLink.page as PageView,
            targetId: match.actionLink.targetId
          } : undefined
        };
      } else {
        botReply = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: chatbotData.fallbackResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: chatbotData.fallbackResponse.quickReplies
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botReply]);
    }, 450);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleActionClick = (actionLink: NonNullable<ChatMessage['actionLink']>) => {
    if (actionLink.page === 'market-detail' && actionLink.targetId) {
      navigateTo('market-detail', { marketId: actionLink.targetId });
    } else if (actionLink.page === 'produce-guide' && actionLink.targetId) {
      navigateTo('produce-guide', { produceId: actionLink.targetId });
    } else {
      navigateTo(actionLink.page);
    }
    // Optionally keep chatbot open or minimize
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text: chatbotData.welcomeMessage.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: chatbotData.welcomeMessage.quickReplies
      }
    ]);
  };

  return (
    <>
      {/* Floating launcher button available across all pages */}
      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
          aria-label="Open FreshFind Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-100" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-950" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight">FreshFind Bot</span>
            <span className="text-[10px] text-emerald-100/90 leading-tight">Ask market questions</span>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {chatbotOpen && (
        <div 
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[85vh] h-[540px] bg-white rounded-2xl shadow-2xl border border-emerald-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="FreshFind Assistant Chat"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center border border-emerald-400">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-sm font-bold flex items-center gap-1.5 leading-none">
                  <span>FreshFind Assistant</span>
                  <span className="text-[9px] font-semibold bg-emerald-600/80 px-1.5 py-0.5 rounded text-emerald-100">
                    Rule-Based Q&amp;A
                  </span>
                </h2>
                <span className="text-[11px] text-emerald-200/80">Always ready · Instant answers</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
                title="Restart conversation"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick topics bar */}
          <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Common queries loaded from dataset</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-mono">SPA Mode</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-stone-50/50 text-xs sm:text-sm">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white text-stone-800 border border-emerald-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Contextual Action Link Button */}
                  {msg.actionLink && (
                    <button
                      onClick={() => handleActionClick(msg.actionLink!)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-700" />
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Suggested Quick Reply Chips */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-full px-2.5 py-1 transition-all hover:scale-102 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-emerald-100 rounded-2xl px-3 py-2 w-16 text-emerald-600 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask about markets, hours, produce..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
