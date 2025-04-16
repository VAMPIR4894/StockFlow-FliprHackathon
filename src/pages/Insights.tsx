import React, { useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart3 } from 'lucide-react';
import { mockStocks } from '@/lib/mockData';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Insights = () => {
  // Calculate sector distribution
  const sectorData = useMemo(() => {
    const sectorTotals = mockStocks.reduce((acc, stock) => {
      acc[stock.sector] = (acc[stock.sector] || 0) + stock.marketCap;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(sectorTotals).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(sectorTotals).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100)
    }));
  }, []);

  // Prepare price vs P/E ratio data
  const priceVsPEData = useMemo(() => {
    const filteredStocks = [...mockStocks] // Create a copy before sorting
      .filter(stock => stock.peRatio !== undefined && stock.peRatio > 0) // Only include stocks with valid PE ratio
      .sort((a, b) => b.marketCap - a.marketCap) // Sort by market cap
      .slice(0, 7); // Take top 7 stocks

    console.log('PE Ratio Data:', filteredStocks.map(s => `${s.symbol}: PE=${s.peRatio}`)); // Debug log
      
    return filteredStocks.map(stock => ({
      name: stock.symbol,
      price: stock.price,
      peRatio: stock.peRatio
    }));
  }, []);

  // Prepare volume data
  const volumeData = useMemo(() => {
    return [...mockStocks] // Create a copy before sorting
      .sort((a, b) => b.volume - a.volume) // Sort by volume
      .slice(0, 10) // Take top 10 stocks
      .map(stock => ({
        name: stock.symbol,
        volume: Math.round(stock.volume / 1000000) // Convert to millions
      }));
  }, []);

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Market Insights</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Analyze Indian market trends and sector performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Sector Distribution by Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Price vs P/E Ratio (Top Companies)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceVsPEData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="#8b5cf6"
                    name="Price (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="peRatio"
                    stroke="#10b981"
                    name="P/E Ratio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Trading Volume (Top 10 Stocks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8b5cf6"
                  fill="url(#volumeGradient)"
                  name="Volume (M)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Insights; 