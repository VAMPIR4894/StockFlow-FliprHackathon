
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { mockStocks, getUniqueSectors } from '@/lib/mockData';
import { PieChart as PieChartIcon, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SectorData {
  name: string;
  value: number;
  change: number;
}

const COLORS = ['#F5A623', '#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#14B8A6', '#8B5CF6', '#64748B'];

const SectorPerformanceCard = () => {
  // Calculate average change by sector
  const calculateSectorData = (): SectorData[] => {
    const sectors = getUniqueSectors();
    
    return sectors.map(sector => {
      const sectorStocks = mockStocks.filter(stock => stock.sector === sector);
      const totalChange = sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0);
      const avgChange = totalChange / sectorStocks.length;
      
      return {
        name: sector,
        value: sectorStocks.length,
        change: parseFloat(avgChange.toFixed(2))
      };
    });
  };

  const sectorData = calculateSectorData();
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.value} stocks</p>
          <p className={`text-sm ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.change >= 0 ? '+' : ''}{data.change}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-stockflow-gold" />
          Sector Performance
        </CardTitle>
        <CardDescription>Distribution and performance by sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name }) => name}
                labelLine={false}
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          {sectorData.map((sector, index) => (
            <div key={sector.name} className="flex flex-col items-center">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium truncate">{sector.name}</span>
              </div>
              <span className={`text-xs ${
                sector.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {sector.change >= 0 ? '+' : ''}{sector.change}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorPerformanceCard;
