import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService.js';
import { Conversation, ChatMessage } from '../types/index.js';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../contexts/AuthContext.js';
import {
  Send,
  Paperclip,
  Plus,
  Bot,
  MoreVertical,
  ChevronLeft,
  MessageSquare,
  Zap,
  Layers,
  Code,
} from 'lucide-react';
import { cn } from '../lib/utils.js';

export const AIMentorPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await aiService.getConversations();
      if (res.success && res.data.conversations.length > 0) {
        setConversations(res.data.conversations);
        if (!activeConvId) {
          const defaultConv = res.data.conversations[0];
          setActiveConvId(defaultConv.id);
          loadConversation(defaultConv.id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const res = await aiService.getConversation(id);
      if (res.success && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadConversation(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateNewChat = async () => {
    try {
      const res = await aiService.createConversation({
        title: 'New Mentoring Session',
      });
      if (res.success) {
        setConversations([res.data, ...conversations]);
        setActiveConvId(res.data.id);
        setMessages(res.data.messages || []);
        setMobileShowSidebar(false);
      }
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await aiService.sendMessage({
        conversationId: activeConvId || undefined,
        message: userText,
      });

      if (res.success) {
        if (!activeConvId) {
          setActiveConvId(res.conversationId);
          fetchConversations();
        }
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          res.userMessage,
          res.aiMessage,
        ]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const todayList = conversations.filter((c) => c.timeGroup === 'TODAY');
  const yesterdayList = conversations.filter((c) => c.timeGroup === 'YESTERDAY');

  const renderFormattedMessage = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = ['css', 'js', 'javascript', 'html', 'tsx', 'ts'].includes(firstLine.toLowerCase());
        const codeText = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <pre
            key={index}
            className="my-3 p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800"
          >
            <code>{codeText}</code>
          </pre>
        );
      }

      const subparts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index} className="whitespace-pre-wrap">
          {subparts.map((sub, sIdx) => {
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={sIdx} className="font-bold text-slate-900 dark:text-slate-100">
                  {sub.slice(2, -2)}
                </strong>
              );
            }
            const codeParts = sub.split(/(`.*?`)/g);
            return codeParts.map((cp, cpIdx) => {
              if (cp.startsWith('`') && cp.endsWith('`')) {
                return (
                  <code
                    key={cpIdx}
                    className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs"
                  >
                    {cp.slice(1, -1)}
                  </code>
                );
              }
              return cp;
            });
          })}
        </span>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex gap-4 lg:gap-6 max-w-7xl mx-auto relative">
      {/* Left Column: Chat Conversations Sidebar */}
      <div
        className={cn(
          'w-72 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm transition-all duration-200',
          'fixed inset-y-20 left-4 z-30 lg:relative lg:inset-auto',
          mobileShowSidebar ? 'flex' : 'hidden lg:flex'
        )}
      >
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCreateNewChat}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs select-none">
          {todayList.length > 0 && (
            <div>
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                TODAY
              </span>
              <div className="mt-1.5 space-y-1">
                {todayList.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setMobileShowSidebar(false);
                      }}
                      type="button"
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all truncate block cursor-pointer',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      )}
                    >
                      {conv.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {yesterdayList.length > 0 && (
            <div>
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                YESTERDAY
              </span>
              <div className="mt-1.5 space-y-1">
                {yesterdayList.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setMobileShowSidebar(false);
                      }}
                      type="button"
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all truncate block cursor-pointer',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      )}
                    >
                      {conv.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {mobileShowSidebar && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-20 lg:hidden"
          onClick={() => setMobileShowSidebar(false)}
        />
      )}

      {/* Right Column: Main Chat Window */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        {/* Chat Window Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileShowSidebar(!mobileShowSidebar)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                {activeConv?.title || 'CSS Flexbox Mastery'}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  AI Mentor Online
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant' || msg.role === 'system';

            if (isBot) {
              return (
                <div key={msg.id} className="flex items-start gap-2.5 sm:gap-3.5 max-w-2xl">
                  <div className="w-7 h-7 sm:w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                      AI Mentor
                    </span>
                    <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                      {renderFormattedMessage(msg.content)}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col items-end space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>You</span>
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>

                <div className="max-w-xl p-3 sm:p-4 rounded-2xl bg-blue-600 text-white text-xs sm:text-sm leading-relaxed shadow-sm">
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-2.5 sm:gap-3.5 max-w-xl">
              <div className="w-7 h-7 sm:w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40">
          <button
            onClick={() => {
              setInputMessage('Can you explain the difference between Promise.all and Promise.allSettled?');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap cursor-pointer transition-colors"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Promise.all vs allSettled</span>
          </button>
          <button
            onClick={() => {
              setInputMessage('Show me how to horizontally and vertically center an element with Flexbox.');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap cursor-pointer transition-colors"
          >
            <Layers className="w-3 h-3 text-blue-500" />
            <span>Flexbox Centering</span>
          </button>
          <button
            onClick={() => {
              setInputMessage('How do I handle React cleanup inside useEffect with AbortController?');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap cursor-pointer transition-colors"
          >
            <Code className="w-3 h-3 text-purple-500" />
            <span>AbortController</span>
          </button>
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleSendMessage} className="space-y-1.5">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <button
                type="button"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Attach file or code"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message AI Mentor..."
                disabled={isSending}
                className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <p className="text-center text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
              AI Mentor can make mistakes. Consider verifying important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
