import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stock } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown, IndianRupee } from 'lucide-react';
import SparklineChart from '../charts/SparklineChart';
import { generateMockHistoricalData } from '@/lib/mockData';

interface StockTableProps {
  stocks: Stock[];
  onSort?: (key: keyof Stock) => void;
  sortKey?: keyof Stock;
  sortDirection?: 'asc' | 'desc';
}

const StockTable: React.FC<StockTableProps> = ({ 
  stocks, 
  onSort, 
  sortKey, 
  sortDirection = 'asc' 
}) => {
  const navigate = useNavigate();

  if (!stocks || stocks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No stocks found matching your criteria.
      </div>
    );
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1_000_000_000_000) {
      return `₹${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
    } else if (marketCap >= 1_000_000_000) {
      return `₹${(marketCap / 1_000_000_000).toFixed(2)}B`;
    } else if (marketCap >= 1_000_000) {
      return `₹${(marketCap / 1_000_000).toFixed(2)}M`;
    } else {
      return `₹${marketCap.toLocaleString()}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) {
      return `${(volume / 1_000_000_000).toFixed(2)}B`;
    } else if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    } else if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(2)}K`;
    } else {
      return volume.toLocaleString();
    }
  };

  const handleSort = (key: keyof Stock) => {
    if (onSort) {
      onSort(key);
    }
  };

  const renderSortIcon = (key: keyof Stock) => {
    if (sortKey !== key) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('symbol')}
            >
              Symbol
              {renderSortIcon('symbol')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Company
              {renderSortIcon('name')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('price')}
            >
              Price
              {renderSortIcon('price')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('changePercent')}
            >
              Change %
              {renderSortIcon('changePercent')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('volume')}
            >
              Volume
              {renderSortIcon('volume')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('marketCap')}
            >
              Market Cap
              {renderSortIcon('marketCap')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Chart
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const sparklineData = generateMockHistoricalData(stock.symbol, 30);
            
            return (
              <tr 
                key={stock.symbol}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white hover:text-stockflow-gold">
                    {stock.symbol}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500 dark:text-gray-400 hover:text-stockflow-gold">
                    {stock.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  <span className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {stock.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {formatVolume(stock.volume)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {formatMarketCap(stock.marketCap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-20">
                    <SparklineChart 
                      data={sparklineData} 
                      isPositive={isPositive} 
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
