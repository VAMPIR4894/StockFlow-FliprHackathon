
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getMarketSummary } from '@/lib/mockData';
import { TrendingUp, TrendingDown, MinusCircle, BarChart } from 'lucide-react';

const MarketOverviewCard = () => {
  const marketSummary = getMarketSummary();
  const isMarketPositive = marketSummary.averageChange >= 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-stockflow-gold" />
          Market Overview
        </CardTitle>
        <CardDescription>Today's market summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Gainers</span>
            <span className="text-xl font-semibold text-green-600 dark:text-green-400">
              {marketSummary.gainers}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 mb-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Losers</span>
            <span className="text-xl font-semibold text-red-600 dark:text-red-400">
              {marketSummary.losers}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MinusCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mb-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Unchanged</span>
            <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              {marketSummary.unchanged}
            </span>
          </div>
          
          <div className={`flex flex-col items-center p-3 ${
            isMarketPositive
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          } rounded-lg`}>
            {isMarketPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 mb-1" />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Change</span>
            <span className={`text-xl font-semibold ${
              isMarketPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {isMarketPositive ? '+' : ''}{marketSummary.averageChange}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverviewCard;
