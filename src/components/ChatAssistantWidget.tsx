import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Code, Loader2 } from 'lucide-react';
import { gamificationService, ChatSession, ChatMessage } from '../lib/gamification';
import { geminiService } from '../lib/geminiService';

interface ChatAssistantWidgetProps {
  userId: string;
  moduleId?: string;
}

export default function ChatAssistantWidget({ userId, moduleId }: ChatAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  async function handleOpenChat() {
    setIsOpen(true);
    if (!session) {
      try {
        const newSession = await gamificationService.createChatSession(userId, moduleId, 'general');
        setSession(newSession);
        loadMessages(newSession.id);
      } catch (error) {
        console.error('Error creating chat session:', error);
      }
    } else {
      loadMessages(session.id);
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const messagesData = await gamificationService.getChatMessages(sessionId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function handleSendMessage() {
    if (!inputMessage.trim() || !session || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      await gamificationService.addChatMessage(session.id, 'user', userMessage);

      const conversationHistory = messages.map(msg => ({
        role: msg.sender_type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.message_content
      }));

      const response = await geminiService.sendMessage({
        message: userMessage,
        language: 'code',
        conversationHistory
      });

      await gamificationService.addChatMessage(session.id, 'assistant', response.response);

      await loadMessages(session.id);
    } catch (error) {
      console.error('Error sending message:', error);
      await gamificationService.addChatMessage(
        session.id,
        'assistant',
        'Sorry, I encountered an error. Please try again.'
      );
      await loadMessages(session.id);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  async function handleCloseChat() {
    if (session) {
      await gamificationService.endChatSession(session.id);
    }
    setIsOpen(false);
    setSession(null);
    setMessages([]);
  }

  function handleNewChat() {
    setSession(null);
    setMessages([]);
    handleOpenChat();
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        title="Open Coding Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed right-6 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col transition-all z-50 ${
        isMinimized
          ? 'bottom-6 w-80 h-16'
          : 'bottom-6 top-24 w-96'
      }`}
    >
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold">Coding Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="text-white hover:bg-green-500 px-2 py-1 rounded transition-colors text-xs"
            title="New Chat"
          >
            New
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-green-500 p-1 rounded transition-colors"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCloseChat}
            className="text-white hover:bg-green-500 p-1 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p className="text-sm font-medium mb-2">Ask me anything about coding!</p>
                <p className="text-xs">I can help with:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>Programming concepts</li>
                  <li>Debugging assistance</li>
                  <li>Code review</li>
                  <li>Best practices</li>
                  <li>Algorithm explanations</li>
                </ul>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.sender_type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  {msg.code_snippet && (
                    <div className="mb-2 p-2 bg-black/30 rounded text-xs font-mono overflow-x-auto">
                      <code>{msg.code_snippet}</code>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap break-words">{msg.message_content}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-700 p-3 bg-slate-800">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about coding concepts, debugging, or best practices..."
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-colors self-end"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500">
                Press Enter to send, Shift+Enter for new line
              </p>
              <button
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title="Add code snippet"
              >
                <Code className="w-3 h-3" />
                Code
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
