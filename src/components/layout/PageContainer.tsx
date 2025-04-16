import React from 'react';
import Navbar from './Navbar';
import ChatbotButton from '../chatbot/ChatbotButton';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-stockflow-navy">
      <Navbar />
      <main className={cn("flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8", className)}>
        {children}
      </main>
      <ChatbotButton />
    </div>
  );
};

export default PageContainer;
