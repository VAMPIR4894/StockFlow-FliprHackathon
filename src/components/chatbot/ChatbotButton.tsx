
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatbotPanel from './ChatbotPanel';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Fixed chatbot trigger button */}
      <Button
        onClick={toggleChatbot}
        className="fixed right-6 bottom-6 shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center bg-stockflow-gold hover:bg-stockflow-darkGold text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chatbot panel */}
      {isOpen && <ChatbotPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotButton;
