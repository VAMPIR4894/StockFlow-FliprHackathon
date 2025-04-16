
import React from 'react';
import { Link } from 'react-router-dom';
import { Stock } from '@/lib/mockData';
import SparklineChart from '../charts/SparklineChart';
import { generateMockHistoricalData } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

interface StockListItemProps {
  stock: Stock;
  showSparkline?: boolean;
}

const StockListItem: React.FC<StockListItemProps> = ({ 
  stock, 
  showSparkline = true 
}) => {
  const isPositive = stock.change >= 0;
  const sparklineData = React.useMemo(() => {
    return generateMockHistoricalData(stock.symbol, 30);
  }, [stock.symbol]);

  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div className="mr-4 flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md font-medium text-sm">
            {stock.symbol.substring(0, 3)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {stock.symbol}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {stock.name}
            </p>
          </div>
        </div>
      </div>

      {showSparkline && (
        <div className="hidden sm:block w-24 mx-2">
          <SparklineChart 
            data={sparklineData} 
            isPositive={isPositive} 
          />
        </div>
      )}

      <div className="flex flex-col items-end ml-2">
        <span className="font-medium text-gray-900 dark:text-white flex items-center">
          <IndianRupee className="h-3.5 w-3.5 mr-1" />
          {stock.price.toFixed(2)}
        </span>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
          )}
          {Math.abs(stock.changePercent).toFixed(2)}%
        </div>
      </div>
    </Link>
  );
};

export default StockListItem;
