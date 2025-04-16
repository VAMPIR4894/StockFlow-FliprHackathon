import React, { useState, useRef, useEffect } from "react";
import { useGeminiApi } from "@/lib/geminiApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockStocks, getTopGainers, getTopLosers, getMarketSummary } from "@/lib/mockData";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useGeminiApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Get current market data
      const marketSummary = getMarketSummary();
      const topGainers = getTopGainers(3);
      const topLosers = getTopLosers(3);

      // Create context message about current market state
      const contextMessage = `Current Indian Stock Market Status:
- Market Overview: ${marketSummary.gainers} stocks up, ${marketSummary.losers} stocks down, average change ${marketSummary.averageChange}%
- Top Gainers: ${topGainers.map(s => `${s.symbol} (${s.changePercent.toFixed(2)}%)`).join(', ')}
- Top Losers: ${topLosers.map(s => `${s.symbol} (${s.changePercent.toFixed(2)}%)`).join(', ')}

You are StockFlow's AI assistant. Use the above market information to help answer the user's question: ${userMessage}`;

      // Convert messages to Gemini format
      const geminiMessages = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Add the context and new user message
      geminiMessages.push({
        role: "user",
        parts: [{ text: contextMessage }],
      });

      // Get response from Gemini
      const response = await sendMessage(contextMessage, geminiMessages);

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI Assistant</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Chat with our AI assistant for market insights and analysis
          </p>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200 h-[calc(100vh-250px)]">
          <div className="border-b border-gray-200/50 dark:border-gray-700/50 p-4">
            <h2 className="text-lg font-semibold">Chat with AI Assistant</h2>
          </div>
          <div className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 mx-2">
                      <AvatarImage
                        src={
                          message.role === "user"
                            ? "/user-avatar.png"
                            : "/ai-avatar.png"
                        }
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-stockflow-gold text-white"
                          : "bg-gray-100/80 dark:bg-gray-700/80"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-stockflow-gold hover:bg-stockflow-darkGold text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AIChat; 