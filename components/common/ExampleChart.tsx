import moment from 'moment';
import React, { PureComponent, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const colors = ['#8884d8', '#82ca9d', 'rose', 'sky', 'slate', 'yellow'];

export const TimeSeriesChart = ({ data }: { data: any }) => {
  let [breakPosition, setBreakPosition] = useState<number>(0);

  if (data == null || data.length < 3) {
    return null;
  }

  function getLines(data: any) {
    let lines = [];
    if ('value' in data) {
      lines.push({ key: 'value', color: colors[lines.length] });
      return lines;
    }
    for (const key in data) {
      if (typeof data[key] === 'number') {
        lines.push({ key, color: colors[lines.length] });
      }
    }
    return lines;
  }

  const formatDate = (time: string, isWeek: boolean = false): Date | string => {
    if (isWeek) {
      const [year, week] = time.split('-');
      const date = moment().year(parseInt(year)).week(parseInt(week)).startOf('week');
      return date.toDate()
      // const date = new Date(`${year}-01-01`);
      // date.setDate(date.getDate() + (parseInt(week) - 1) * 7);
      // // const options = { week: '2-digit', year: 'numeric' };
      // return new Date(date);
    }
    let date = moment(time)
    console.log(time)
    return date.isValid() ? date.toDate() : time
  };

  const transformedData = data.map((item: { [x: string]: any }) => ({
    ...item,
    // @ts-ignore
    time:
    'time' in item ? formatDate(item['time']) :
    'week' in item
        ? formatDate(item['week'], true)
        : formatDate(item['month'] || item['day']),
  }));
  let breakDate = null;
  let max = 0
  const generatePaddedData = (data: any[]): any[] => {
    const paddedData = [];
    data.sort((a, b) => a.time.getTime() - b.time.getTime());
    const startDate = data[0].time;
    const endDate = data[data.length - 1].time;

    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 7); // Start with the first padded date

    let consecutiveZeros = 0; // Track consecutive zeros
    while (currentDate < endDate) {
      const week = currentDate.getWeek().toString().padStart(2, '0');
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const paddedTime = `${year}-${week}`;

      const isFirstOfMonth = currentDate.getDate() === 1;
      const isRequiredMonth = [3, 6, 9, 12].includes(month);

      if (isFirstOfMonth && isRequiredMonth) {
        paddedData.push({ time: new Date(`${year}-${month}-01`), value: 0 });
      }
      const existingDataPoint = data.find((point) => point.time === paddedTime);

      if (existingDataPoint && existingDataPoint.value === 0) {
        consecutiveZeros++;
        if (consecutiveZeros > 30) {
          breakDate = existingDataPoint;
          break; // Stop adding padded data after encountering more than 30 consecutive zeros
        }
      } else {
        consecutiveZeros = 0; // Reset consecutive zeros
        if (existingDataPoint) {
          paddedData.push(existingDataPoint); // Add non-zero data point
        }
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to the next padded date
    }
    // if (position != paddedData.length) {
    //   setBreakPosition(position);
    // }

    return [...data, ...paddedData];
  };

  const paddedData = generatePaddedData(transformedData);
  console.log(paddedData);
  const maxVal = Math.max(...data.map(item => item.value));
  // console.log(breakPosition, paddedData[breakPosition]);

  function formatXAxis(timeStr) {
    // Check if it's a year only
    if ((/^\d{4}$/).test(timeStr)) {
      return timeStr; 
    }
    
    if (moment(timeStr, moment.ISO_8601, true).isValid()) {
      return moment(timeStr).format('MM/YYYY');
    }
  
    // Default case: Return the input as is
    return timeStr;
  }

  return (
    <>
      <LineChart
        width={500}
        height={500}
        data={paddedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          tickFormatter={formatXAxis}
          // type="number"
          // scale="time"
          // domain={['auto', 'auto']} 
        />
        <YAxis domain={[0, maxVal * 1.1]} />
        <Tooltip />
        <Legend />
        {getLines(data[0]).map((line) => (
          <Line
            key={line.key}
            stroke={line.color}
            type="monotone"
            dataKey={line.key}
          />
        ))}
      </LineChart>
      {/* {breakPosition != 0 && (
        <p>
          Note: for chart scaling purposes, we cut off data from{' '}
          {data[breakPosition]} onwards. Please refer the table for more details
        </p>
      )} */}
    </>
  );
};

const formatMonthDate = (time: Date): string => {
  const month = time.getMonth() + 1;
  const year = time.getFullYear();
  return `${year}-${month.toString().padStart(2, '0')}`;
};

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  const formattedTime = formatMonthDate(payload.value);
  return (
    <text x={x} y={y} dy={16} textAnchor="middle">
      {formattedTime}
    </text>
  );
};

// Declare the additional method
declare global {
  interface Date {
    getWeek(): number;
  }
}

// Extend Date object to get the week number
Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return weekNo;
};
