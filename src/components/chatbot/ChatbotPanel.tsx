
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeminiApi } from '@/lib/geminiApi';

interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

interface Message {
  id: number;
  isUser: boolean;
  text: string;
  timestamp: Date;
}

interface ChatbotPanelProps {
  onClose: () => void;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 1,
    isUser: false,
    text: "👋 Hi there! I'm StockBuddy powered by Gemini AI. How can I help you with Indian stocks today?",
    timestamp: new Date(),
  },
];

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [geminiMessages, setGeminiMessages] = useState<GeminiMessage[]>([
    {
      role: "model",
      parts: [{ 
        text: "You are StockBuddy, an AI assistant for StockFlow, an Indian stock market tracking application. Help users with information about Indian stocks, market trends, and how to use the platform. Always provide information relevant to the Indian market context."
      }]
    }
  ]);
  
  const { sendMessage } = useGeminiApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      isUser: true,
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Update Gemini messages for context
    const updatedGeminiMessages: GeminiMessage[] = [
      ...geminiMessages,
      {
        role: "user",
        parts: [{ text: input }]
      }
    ];
    
    setGeminiMessages(updatedGeminiMessages);
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Get response from Gemini API
    try {
      const aiResponse = await sendMessage(input, geminiMessages);
      
      // Add AI response to messages
      const botMessage: Message = {
        id: messages.length + 2,
        isUser: false,
        text: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      // Update Gemini messages with AI response for conversation context
      setGeminiMessages([
        ...updatedGeminiMessages,
        {
          role: "model",
          parts: [{ text: aiResponse }]
        }
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        isUser: false,
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-stockflow-gold/10 dark:bg-stockflow-gold/20">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-stockflow-gold mr-2" />
          <div>
            <h3 className="font-medium">StockBuddy</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-stockflow-gold text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex">
          <Input
            type="text"
            placeholder="Ask about Indian stocks, markets, or how to use StockFlow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 mr-2"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-stockflow-gold hover:bg-stockflow-darkGold"
            disabled={isTyping || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotPanel;
