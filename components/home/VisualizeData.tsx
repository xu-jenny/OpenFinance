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
        <div>
            <Table data={data} columns={columns} />
        </div>
    )
}

export const VisualizeData = ({ data }: { data: any }) => {
    const chart = data.length > 5 ? <TimeSeriesChart data={data}/> : <DynamicTable data={data} />
    return chart
}

