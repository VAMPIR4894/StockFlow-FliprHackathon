// Mock stock data for Indian market
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  high52Week: number;
  low52Week: number;
  peRatio?: number;
  eps?: number;
  dividend?: number;
  beta?: number;
}

export interface StockHistoryData {
  date: string;
  time?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Import the actual data files
import dayData from '../dataCP/day';
import weekData from '../dataCP/week';
import monthData from '../dataCP/month';
import yearData from '../dataCP/year';
import maxData from '../dataCP/max';

// Create a list of stock symbols from the data
const stockSymbols = Object.keys(dayData);

// Create mock stock information based on the actual data
export const mockStocks: Stock[] = stockSymbols.map(symbol => {
  // Get the latest data point for this stock
  const latestData = dayData[symbol] && dayData[symbol].length > 0 
    ? dayData[symbol][dayData[symbol].length - 1] 
    : null;
  
  // Get the previous data point for calculating change
  const previousData = dayData[symbol] && dayData[symbol].length > 1 
    ? dayData[symbol][dayData[symbol].length - 2] 
    : null;
  
  // Calculate change and change percent
  const change = latestData && previousData 
    ? latestData.close - previousData.close 
    : 0;
  
  const changePercent = previousData && previousData.close !== 0 
    ? (change / previousData.close) * 100 
    : 0;
  
  // Get the company name from the symbol (remove .NS suffix)
  const name = symbol.replace('.NS', '');
  
  // Generate some mock data for fields not in the actual data
  const marketCap = Math.floor(Math.random() * 1000000000000) + 1000000000;
  const sector = getRandomSector();
  const high52Week = latestData ? latestData.close * 1.2 : 0;
  const low52Week = latestData ? latestData.close * 0.8 : 0;
  
  return {
    symbol: symbol.replace('.NS', ''), // Remove .NS suffix for display
    name: `${name} Ltd.`,
    price: latestData ? latestData.close : 0,
    previousClose: previousData ? previousData.close : 0,
    change,
    changePercent,
    volume: latestData ? latestData.volume : 0,
    marketCap,
    sector,
    high52Week,
    low52Week,
    peRatio: Math.random() * 30 + 10,
    eps: Math.random() * 100 + 10,
    dividend: Math.random() * 50,
    beta: Math.random() * 1.5 + 0.5
  };
});

// Helper function to get a random sector
function getRandomSector(): string {
  const sectors = [
    "IT", "Banking", "Oil & Gas", "Automotive", 
    "FMCG", "Pharmaceutical", "Real Estate", "Telecom",
    "Metals", "Consumer Durables", "Capital Goods", "Healthcare"
  ];
  return sectors[Math.floor(Math.random() * sectors.length)];
}

// Function to get historical data for a stock
export const generateMockHistoricalData = (symbol: string, days: number = 365): StockHistoryData[] => {
  // Add .NS suffix if not present
  const fullSymbol = symbol.includes('.NS') ? symbol : `${symbol}.NS`;
  
  // Check if we have data for this symbol
  if (!dayData[fullSymbol]) {
    return [];
  }
  
  // Return the appropriate data based on the requested days
  if (days <= 1) {
    return dayData[fullSymbol] || [];
  } else if (days <= 7) {
    return weekData[fullSymbol] || [];
  } else if (days <= 30) {
    return monthData[fullSymbol] || [];
  } else if (days <= 365) {
    return yearData[fullSymbol] || [];
  } else {
    return maxData[fullSymbol] || [];
  }
};

// Function to get top gainers and losers
export const getTopGainers = (limit: number = 5): Stock[] => {
  return [...mockStocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit);
};

export const getTopLosers = (limit: number = 5): Stock[] => {
  return [...mockStocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit);
};

// Function to filter stocks based on search criteria
export const filterStocks = (
  search: string = "",
  sector?: string,
  minPrice?: number,
  maxPrice?: number
): Stock[] => {
  return mockStocks.filter((stock) => {
    const matchesSearch =
      search === "" ||
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase());
      
    const matchesSector = !sector || stock.sector === sector;
    
    const matchesMinPrice = !minPrice || stock.price >= minPrice;
    const matchesMaxPrice = !maxPrice || stock.price <= maxPrice;
    
    return matchesSearch && matchesSector && matchesMinPrice && matchesMaxPrice;
  });
};

// Get market summary stats
export const getMarketSummary = () => {
  const totalStocks = mockStocks.length;
  const gainers = mockStocks.filter(stock => stock.change > 0).length;
  const losers = mockStocks.filter(stock => stock.change < 0).length;
  const unchanged = totalStocks - gainers - losers;
  
  const averageChange = mockStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / totalStocks;
  
  return {
    gainers,
    losers,
    unchanged,
    averageChange: parseFloat(averageChange.toFixed(2))
  };
};

// Get unique sectors from our stock data
export const getUniqueSectors = (): string[] => {
  const sectors = new Set<string>();
  mockStocks.forEach(stock => sectors.add(stock.sector));
  return Array.from(sectors);
};

// Mock watchlist data
let watchlist: string[] = ["RELIANCE", "TCS", "HDFCBANK"];

export const getWatchlist = (): Stock[] => {
  return mockStocks.filter(stock => watchlist.includes(stock.symbol));
};

export const addToWatchlist = (symbol: string): boolean => {
  if (!watchlist.includes(symbol)) {
    watchlist.push(symbol);
    return true;
  }
  return false;
};

export const removeFromWatchlist = (symbol: string): boolean => {
  const initialLength = watchlist.length;
  watchlist = watchlist.filter(s => s !== symbol);
  return watchlist.length !== initialLength;
};

export const isInWatchlist = (symbol: string): boolean => {
  return watchlist.includes(symbol);
};

// Mock chat responses
export const getChatResponse = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes("hello") || message.includes("hi ")) {
    return "Hello! I'm your StockFlow assistant. How can I help you with Indian stock market information today?";
  }
  
  if (message.includes("what is") && message.includes("rsi")) {
    return "RSI (Relative Strength Index) is a momentum oscillator that measures the speed and change of price movements. It ranges from 0 to 100, with readings above 70 indicating overbought conditions and readings below 30 indicating oversold conditions.";
  }
  
  if (message.includes("how") && message.includes("stock")) {
    return "You can search for Indian stocks using the search bar at the top, browse the explorer page, or check the market overview on the dashboard. When you find a stock you're interested in, click on it to see detailed information and charts.";
  }
  
  if (message.includes("best performing stock")) {
    const topGainer = getTopGainers(1)[0];
    return `Currently, ${topGainer.name} (${topGainer.symbol}) is the best performing stock in the Indian market with a gain of ${topGainer.changePercent.toFixed(2)}%.`;
  }
  
  if (message.includes("worst performing stock")) {
    const topLoser = getTopLosers(1)[0];
    return `Currently, ${topLoser.name} (${topLoser.symbol}) is the worst performing stock in the Indian market with a drop of ${Math.abs(topLoser.changePercent).toFixed(2)}%.`;
  }
  
  if (message.includes("it stock") || message.includes("technology stock")) {
    const techStocks = mockStocks.filter(stock => stock.sector === "IT");
    return `There are ${techStocks.length} IT stocks available in the Indian market. Some examples include: ${techStocks.slice(0, 3).map(s => s.symbol).join(", ")}. Would you like me to recommend a specific IT stock?`;
  }
  
  if (message.includes("recommend") || message.includes("suggestion")) {
    const randomStock = mockStocks[Math.floor(Math.random() * mockStocks.length)];
    return `You might want to check out ${randomStock.name} (${randomStock.symbol}). It's currently trading at ₹${randomStock.price.toFixed(2)} and is in the ${randomStock.sector} sector of the Indian market.`;
  }
  
  return "I'm not sure how to help with that. You can ask me about specific Indian stocks, market trends, or how to use the StockFlow platform for the Indian market.";
};
