
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Stock, getTopGainers, getTopLosers } from '@/lib/mockData';
import StockListItem from '../stocks/StockListItem';

const TopMoversCard = () => {
  const topGainers = getTopGainers(5);
  const topLosers = getTopLosers(5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top Movers</CardTitle>
        <CardDescription>Biggest daily gainers and losers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="gainers" className="flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
              Losers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="space-y-2 mt-0">
            {topGainers.map((stock) => (
              <StockListItem key={stock.symbol} stock={stock} />
            ))}
          </TabsContent>
          
          <TabsContent value="losers" className="space-y-2 mt-0">
            {topLosers.map((stock) => (
              <StockListItem key={stock.symbol} stock={stock} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopMoversCard;
