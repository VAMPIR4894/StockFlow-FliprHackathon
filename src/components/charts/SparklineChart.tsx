
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { StockHistoryData } from '@/lib/mockData';

interface SparklineChartProps {
  data: StockHistoryData[];
  dataKey?: string;
  width?: number | string;
  height?: number | string;
  isPositive?: boolean;
  className?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  dataKey = 'close',
  width = '100%',
  height = 40,
  isPositive: forcedPositive,
  className = '',
}) => {
  const isPositive = forcedPositive !== undefined 
    ? forcedPositive 
    : data.length > 1 
      ? data[data.length - 1][dataKey as keyof StockHistoryData] > data[0][dataKey as keyof StockHistoryData]
      : true;

  return (
    <div className={className} style={{ width }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;
