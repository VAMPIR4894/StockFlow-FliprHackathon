import { useToast } from "@/hooks/use-toast";

// Gemini API key
const API_KEY = "AIzaSyB0DGKZgzgWh9EcQ7xho5i5-3clHWzeqKs"; 

interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// SYSTEM PROMPTS (Prompt Engineering)
const GENERAL_SYSTEM_PROMPT = `You are an intelligent and helpful AI assistant. 
Answer clearly, concisely, and accurately. Use friendly and professional language.
If the question is unclear, ask for clarification.`;

const STOCK_AGENT_PROMPT = `You are a specialized financial advisor and stock market expert.
Your role is to provide accurate, well-researched information about stocks, market trends, and investment strategies.
Always include relevant data points, market context, and potential risks when discussing investments.
If you're unsure about specific stock information, acknowledge the limitations of your knowledge.
Remember to include appropriate disclaimers about not providing financial advice.`;

const SUPPORT_AGENT_PROMPT = `You are a helpful customer support specialist for StockFlow AI Insights.
Your role is to assist users with account-related issues, login problems, and general platform support.
Provide clear, step-by-step instructions for resolving common issues.
If you can't resolve a specific issue, guide users to contact human support.
Always maintain a professional, patient, and helpful tone.`;

// Function to send request to Gemini
export const getGeminiResponse = async (messages: GeminiMessage[], agentType: 'general' | 'stock' | 'support' = 'general'): Promise<string> => {
  try {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    // Select the appropriate system prompt based on agent type
    let systemPrompt = GENERAL_SYSTEM_PROMPT;
    if (agentType === 'stock') {
      systemPrompt = STOCK_AGENT_PROMPT;
    } else if (agentType === 'support') {
      systemPrompt = SUPPORT_AGENT_PROMPT;
    }

    // Prepend the system prompt (prompt engineering)
    const engineeredMessages: GeminiMessage[] = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...messages,
    ];

    const response = await fetch(`${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: engineeredMessages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("No response generated");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
  }
};

// Hook with toast notifications
export const useGeminiApi = () => {
  const { toast } = useToast();

  const sendMessage = async (
    message: string, 
    previousMessages: GeminiMessage[] = [],
    agentType: 'general' | 'stock' | 'support' = 'general'
  ): Promise<string> => {
    try {
      const updatedMessages = [
        ...previousMessages,
        {
          role: "user" as const,
          parts: [{ text: message }],
        },
      ];

      const response = await getGeminiResponse(updatedMessages, agentType);
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant",
        variant: "destructive",
      });
      console.error("Gemini API error:", error);
      return "Sorry, I encountered an error. Please try again later.";
    }
  };

  return { sendMessage };
};
