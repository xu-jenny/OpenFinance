import React from "react";
import { Table } from "../common/Table"
import { Column, createColumnHelper } from "@tanstack/react-table";
import { TimeSeriesChart } from "../common/ExampleChart";
import { format, isValid } from 'date-fns';
import moment from "moment";

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
    console.log(data)
    const formatDate = (time: string, isWeek: boolean = false) => {
        // date.isValid() ? date : time
        // let date = moment(time, 'MM/dd/yy')
        if (isValid(time)){
            if (isWeek) {
                const [year, week] = time.split('-');
                const date = new Date(`${year}-01-01`);
                date.setDate(date.getDate() + (parseInt(week) - 1) * 7);
                // const options = { week: '2-digit', year: 'numeric' };
                return new Date(date);
            }
            return new Date(time);
        } else {
            return time;
        }
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
    transformedData.sort((a, b) => a.time - b.time);
    const filteredData = transformedData.filter((item: { value: any }) => item.value !== null && item.value > 0);
    return (<div className="flex flex-row justify-center items-center">
        <div className="flex flex-col items-center">
            <DynamicTable data={transformedData} />
        </div>
        {filteredData.length > 4 && <TimeSeriesChart data={filteredData} />}
    </div>)
}

