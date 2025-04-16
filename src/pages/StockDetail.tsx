import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StockChart from '@/components/charts/StockChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  BarChart4, 
  LineChart, 
  CandlestickChart,
  AlertCircle,
  IndianRupee,
  Loader2
} from 'lucide-react';
import { 
  Stock, 
  mockStocks, 
  generateMockHistoricalData,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { watchlistAPI } from '@/lib/api';

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the stock by symbol
  const stock = mockStocks.find(s => s.symbol === symbol);
  
  // State for chart options
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'MAX'>('1M');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get historical data
  const stockHistory = symbol ? generateMockHistoricalData(symbol, 365) : [];

  // Check if stock is in watchlist on component mount
  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const watchlist = await watchlistAPI.getWatchlist();
        setInWatchlist(watchlist.some(item => item.symbol === symbol));
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };

    if (symbol) {
      checkWatchlist();
    }
  }, [symbol]);
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle watchlist toggle
  const toggleWatchlist = async () => {
    if (!stock) return;

    try {
      setIsLoading(true);
      
      if (inWatchlist) {
        await watchlistAPI.removeFromWatchlist(stock.symbol);
        setInWatchlist(false);
        toast({
          title: "Removed from Watchlist",
          description: `${stock.symbol} has been removed from your watchlist.`,
          variant: "default",
        });
      } else {
        await watchlistAPI.addToWatchlist(stock.symbol, stock.name);
        setInWatchlist(true);
        toast({
          title: "Added to Watchlist",
          description: `${stock.symbol} has been added to your watchlist.`,
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error toggling watchlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update watchlist",
        variant: "destructive",
      });

      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // If stock not found
  if (!stock) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Stock Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find any stock with the symbol "{symbol}".
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </PageContainer>
    );
  }
  
  const isPositive = stock.change >= 0;
  
  return (
    <PageContainer>
      {/* Header with back button and title */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2" 
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-2">{stock.symbol}</h1>
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                {stock.name}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-semibold mr-2 flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {stock.price.toFixed(2)}
              </span>
              <div className={`flex items-center ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <ArrowUpRight className="h-5 w-5 mr-1" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 mr-1" />
                )}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant={inWatchlist ? "default" : "outline"}
            className={`mt-2 sm:mt-0 ${inWatchlist ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            onClick={toggleWatchlist}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Star className={`h-4 w-4 mr-2 ${inWatchlist ? 'fill-white' : 'fill-none'}`} />
            )}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Button>
        </div>
      </div>
      
      {/* Chart section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-1">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className={chartType === 'area' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Area
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className={chartType === 'bar' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}
            >
              <BarChart4 className="h-4 w-4 mr-1" />
              Bar
            </Button>
          </div>
          
          <div className="flex">
            <Button
              variant={timeRange === '1D' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1D')}
              className={`px-2 ${timeRange === '1D' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              1D
            </Button>
            <Button
              variant={timeRange === '1W' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1W')}
              className={`px-2 ${timeRange === '1W' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              1W
            </Button>
            <Button
              variant={timeRange === '1M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1M')}
              className={`px-2 ${timeRange === '1M' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              1M
            </Button>
            <Button
              variant={timeRange === '3M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('3M')}
              className={`px-2 ${timeRange === '3M' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              3M
            </Button>
            <Button
              variant={timeRange === '1Y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1Y')}
              className={`px-2 ${timeRange === '1Y' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              1Y
            </Button>
            <Button
              variant={timeRange === 'MAX' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('MAX')}
              className={`px-2 ${timeRange === 'MAX' ? 'bg-stockflow-gold hover:bg-stockflow-darkGold' : ''}`}
            >
              MAX
            </Button>
          </div>
        </div>
        
        <StockChart 
          data={stockHistory} 
          symbol={stock.symbol} 
          type={chartType}
          timeRange={timeRange}
          height={400}
        />
      </div>
      
      {/* Stock info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Previous Close</div>
                <div className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-1" />
                  {stock.previousClose.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
                <div className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-1" />
                  {(stock.price - (stock.change * 0.7)).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Day's Range</div>
                <div className="font-medium">
                  ₹{(stock.price - Math.abs(stock.change * 1.2)).toFixed(2)} - ₹{(stock.price + Math.abs(stock.change * 0.5)).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
                <div className="font-medium">
                  {stock.volume.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
                <div className="font-medium">
                  {stock.marketCap >= 1_000_000_000_000
                    ? `₹${(stock.marketCap / 1_000_000_000_000).toFixed(2)}T`
                    : stock.marketCap >= 1_000_000_000
                    ? `₹${(stock.marketCap / 1_000_000_000).toFixed(2)}B`
                    : `₹${(stock.marketCap / 1_000_000).toFixed(2)}M`}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">52-Week Range</div>
                <div className="font-medium">
                  ₹{stock.low52Week.toFixed(2)} - ₹{stock.high52Week.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Sector</div>
                <div className="font-medium">{stock.sector}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Beta</div>
                <div className="font-medium">{stock.beta?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</div>
                <div className="font-medium">{stock.peRatio?.toFixed(2) || 'N/A'}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">EPS</div>
                <div className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-1" />
                  {stock.eps?.toFixed(2) || 'N/A'}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</div>
                <div className="font-medium">
                  {stock.dividend 
                    ? `${((stock.dividend / stock.price) * 100).toFixed(2)}%` 
                    : 'N/A'}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">1-Year Return</div>
                <div className={`font-medium ${
                  stock.price > stock.low52Week * 1.2
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stock.price > stock.low52Week * 1.2
                    ? `+${(((stock.price / stock.low52Week) - 1) * 100).toFixed(2)}%`
                    : `-${(((stock.low52Week / stock.price) - 1) * 100).toFixed(2)}%`}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Volume</div>
                <div className="font-medium">
                  {(stock.volume * 0.85).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Shares Outstanding</div>
                <div className="font-medium">
                  {Math.round(stock.marketCap / stock.price).toLocaleString()}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default StockDetail;
