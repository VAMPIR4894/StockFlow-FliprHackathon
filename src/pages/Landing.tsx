import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChartBar, Brain, TrendingUp, Lock, LineChart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-stockflow-navy">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full"
        style={{
          backgroundImage: 'url("/uploads/landingpage.png")',
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          height: 'calc(100vw * 0.5625)', // This maintains the aspect ratio for 16:9
        }}
      >
        {/* Logo */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col"
        >
          <img 
            src="/uploads/99fb7d4f-0028-459f-99af-71f6fd8541a9.png" 
            alt="StockFlow Logo" 
            className="h-8 sm:h-16 md:h-52 w-auto"
          />
        </motion.div>

        {/* Text content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute left-6 sm:left-12 md:left-24 top-[30%] sm:top-[45%] -translate-y-1/2 w-[45%] sm:w-[50%] md:max-w-none"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#FDB813] text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
          >
            StockFlow
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white text-lg sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-4 whitespace-normal sm:whitespace-nowrap leading-snug"
          >
            Fuel Your Finances, Flow with Confidence
          </motion.p>
        </motion.div>

        {/* Get Started Button with Text */}
        <div className="absolute top-1/2 -translate-y-1/2 right-[5%] md:right-[8%]">
          <motion.div 
            className="flex flex-col items-end"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-[#FDB813] hover:bg-[#FFA500] text-stockflow-navy font-bold px-4 md:px-20 py-1.5 md:py-8 text-sm md:text-3xl rounded-md md:rounded-xl transition-colors duration-300 shadow-lg"
                onClick={() => navigate('/auth?mode=register')}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="w-full bg-gradient-to-b from-stockflow-navy to-[#0A1929] py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Empower Your Trading Journey
          </h2>
          <p className="text-lg md:text-xl text-center text-gray-300 mb-12 md:mb-16 max-w-3xl mx-auto">
            StockFlow combines advanced AI technology with real-time market data to provide you with powerful insights and trading opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1A2B3C]/40 backdrop-blur-sm rounded-xl p-6 border border-[#FDB813]/20 hover:border-[#FDB813]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-[#FDB813] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 md:mt-20 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ready to Transform Your Trading Strategy?
            </h3>
            <Button 
              className="bg-[#FDB813] hover:bg-[#FFA500] text-stockflow-navy font-semibold px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-lg transition-colors duration-300"
              onClick={() => navigate('/auth?mode=register')}
            >
              Start Trading Now
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0A1929] py-6 md:py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm md:text-base text-gray-400">
            © 2024 StockFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <ChartBar className="w-8 h-8" />,
    title: "Real-Time Analytics",
    description: "Access live market data, price movements, and trading volumes with our advanced analytics dashboard."
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Insights",
    description: "Leverage machine learning algorithms to predict market trends and identify profitable trading opportunities."
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Technical Analysis",
    description: "Comprehensive technical indicators and chart patterns to support your trading decisions."
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Secure Platform",
    description: "Enterprise-grade security measures to protect your investments and personal information."
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Portfolio Management",
    description: "Track and optimize your investment portfolio with our intuitive management tools."
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Educational Resources",
    description: "Access comprehensive learning materials and market insights to improve your trading strategies."
  }
];

export default Landing;
