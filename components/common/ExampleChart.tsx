import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];


const colors = ["#8884d8", "#82ca9d", "rose", "sky", "slate", "yellow"]

export const TimeSeriesChart = ({ data }: { data: any}) => {
  if (data == null || data.length < 3){
    return null
  }

  function getLines(data: any) {
    let lines = []
    for (const key in data) {
      if (typeof data[key] === 'number') {
        lines.push({ key, color: colors[lines.length] })
      }
    }
    return lines;
  }

  const transformedData = data.map((item: { [x: string]: any; }) => ({
    ...item,
    // @ts-ignore
    name: item['month'],
  }));

  return (
    <LineChart
      width={500}
      height={300}
      data={transformedData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {getLines(data[0]).map(line => <Line key={line.key} stroke={line.color} type="monotone" dataKey={line.key} />)}
    </LineChart>
  );
}
