import { BarChart, Legend, LineChart } from '@tremor/react';
import React from 'react';
import { ResponsiveContainer } from 'recharts';

export type Color =
  | 'blue'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink';
interface ChartProps {
  data: any;
  chartType: string;
  color?: Color;
  showLegend?: boolean;
}

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({
  data,
  chartType,
  color,
  showLegend = true,
}) => {
  const value = data.length > 0 ? Object.keys(data[0])[1] : 'value';

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat('us').format(number).toString();
  };

  const renderChart = () => {
    chartType = chartType.toLowerCase();
    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            className="h-[350px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || 'blue']}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
            layout={'vertical'}
            yAxisWidth={100}
          />
        );
      case 'line':
        return (
          <LineChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || 'blue']}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default Chart;
