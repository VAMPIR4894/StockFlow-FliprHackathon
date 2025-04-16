import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { watchlistAPI } from '@/lib/api';
import { Loader2, Star, StarOff } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  companyName: string;
  addedAt: string;
}

const Watchlist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const data = await watchlistAPI.getWatchlist();
      setWatchlist(data);
    } catch (error: any) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load watchlist',
        variant: 'destructive',
      });

      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      setIsLoading(true);
      await watchlistAPI.removeFromWatchlist(symbol);
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      
      toast({
        title: 'Success',
        description: 'Stock removed from watchlist',
      });
    } catch (error: any) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove from watchlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  if (isLoading) {
    return (
      <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Watchlist</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your favorite stocks and monitor their performance
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <StarOff className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">Your watchlist is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Add stocks to your watchlist to track them easily
            </p>
          </CardContent>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <div 
              key={item.symbol}
              className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => handleCardClick(item.symbol)}
            >
              <div className="p-4">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium">
                    {item.symbol}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWatchlist(item.symbol);
                    }}
                    disabled={isLoading}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <div className="text-2xl font-bold">{item.companyName}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Watchlist;
