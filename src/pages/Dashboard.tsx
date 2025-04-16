import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import MarketOverviewCard from '@/components/dashboard/MarketOverviewCard';
import TopMoversCard from '@/components/dashboard/TopMoversCard';
import SectorPerformanceCard from '@/components/dashboard/SectorPerformanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTopGainers, generateMockHistoricalData } from '@/lib/mockData';
import StockChart from '@/components/charts/StockChart';
import { IndianRupee } from 'lucide-react';

const Dashboard = () => {
  // Get data for the featured chart (using the top gainer)
  const featuredStock = getTopGainers(1)[0];
  const stockHistory = generateMockHistoricalData(featuredStock.symbol, 180);
  
  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Market Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track market trends and discover investment opportunities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200">
          <MarketOverviewCard />
        </div>
        
        <Card className="shadow-lg md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Featured Stock: {featuredStock.name} ({featuredStock.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {featuredStock.price.toFixed(2)}
                </span>
                <span className={`ml-2 ${
                  featuredStock.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {featuredStock.change >= 0 ? '+' : ''}
                  {featuredStock.changePercent.toFixed(2)}%
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last 6 months
              </span>
            </div>
            <StockChart 
              data={stockHistory} 
              symbol={featuredStock.symbol}
              type="area"
              height={250}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200">
          <TopMoversCard />
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200">
          <SectorPerformanceCard />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
