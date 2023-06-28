import React from "react";
import { Table } from "../common/Table"
import { Column, createColumnHelper } from "@tanstack/react-table";
import { TimeSeriesChart } from "../common/ExampleChart";

const DynamicTable = ({ data }: { data: any }) => {
    const columnHelper = createColumnHelper<any>();
    const columns = React.useMemo<Column<Record<string, any>>[]>(() => {
        if (data.length > 0) {
            return Object.keys(data[0]).map((key) => (
                columnHelper.accessor(key, {
                    cell: (info) => info.getValue(),
                }),
            ))
        }
        return [];
    }, [data]);

    return (
        <>
            <Table data={data} columns={columns} paginate={true} />
        </>
    )
}

export const VisualizeData = ({ data }: { data: any }) => {
    const formatDate = (time: string, isWeek: boolean = false): Date => {
        if (isWeek) {
          const [year, week] = time.split('-');
          const date = new Date(`${year}-01-01`);
          date.setDate(date.getDate() + (parseInt(week) - 1) * 7);
          // const options = { week: '2-digit', year: 'numeric' };
          return new Date(date);
        }
        return new Date(time);
      };
    
      const transformedData = data.map((item: { [x: string]: any }) => ({
        ...item,
        // @ts-ignore
        time:
          'week' in item
            ? formatDate(item['week'], true)
            : formatDate(item['month'] || item['day']),
      }));
      transformedData.sort((a, b) => a.time.getTime() - b.time.getTime());
    return (<div className="flex flex-col justify-center items-center gap-4">
        <div className="p-3 flex flex-col items-center">
            <DynamicTable data={transformedData} />
        </div>
        <TimeSeriesChart data={transformedData}/>
    </div>)
}

