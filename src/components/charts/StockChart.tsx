
import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { StockHistoryData } from '@/lib/mockData';

interface StockChartProps {
  data: StockHistoryData[];
  symbol: string;
  type?: 'line' | 'area' | 'bar';
  timeRange?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'MAX';
  height?: number | string;
  className?: string;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  symbol,
  type = 'area',
  timeRange = '1M',
  height = 400,
  className = '',
}) => {
  // Filter data based on timeRange
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case '1D':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'MAX':
      default:
        return data;
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    return data.filter(d => d.date >= startDateStr);
  }, [data, timeRange]);
  
  // Determine if the overall trend is positive or negative
  const isPositive = React.useMemo(() => {
    if (filteredData.length < 2) return true;
    return filteredData[filteredData.length - 1].close > filteredData[0].close;
  }, [filteredData]);
  
  // Colors based on trend
  const colors = {
    stroke: isPositive ? '#10B981' : '#EF4444',
    fill: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number) => [`₹${value.toFixed(2)}`, 'Price'];
  
  // For X-axis ticks, show fewer labels for better readability
  const getXAxisTicks = () => {
    if (filteredData.length <= 10) return filteredData.map(d => d.date);
    
    const interval = Math.ceil(filteredData.length / 10);
    return filteredData
      .filter((_, index) => index % interval === 0)
      .map(d => d.date);
  };
  
  const renderChart = () => {
    switch(type) {
      case 'line':
        return (
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              ticks={getXAxisTicks()}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke={colors.stroke} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
        
      case 'bar':
        return (
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              ticks={getXAxisTicks()}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="close" fill={colors.stroke} barSize={5} radius={[2, 2, 0, 0]} />
          </BarChart>
        );
        
      case 'area':
      default:
        return (
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`color-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              ticks={getXAxisTicks()}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke={colors.stroke} 
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${symbol})`}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
