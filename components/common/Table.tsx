import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format, isValid } from 'date-fns';

const dataFormatter = (value: any) => {
  // Apply specific formatting based on the value's type or other conditions
  if (typeof value === 'string') {
    if (value.includes('http')) {
      return <a href={value}>{value}</a>;
    }
    const parsedDate = Date.parse(value);
    if (!isNaN(parsedDate)) {
      return format(parsedDate, 'MM/dd/yy');
    }
  }
  if (typeof value === 'object' && value instanceof Date) {
    return format(value, 'MM/dd/yy');
  }
  return value;
};


export const Table = ({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) => {
  if (!data) {
    return null; 
  }

  console.log(data)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="p-2">
      <table className="border border-solid border-black">
        <thead className="border border-solid border-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-solid border-black p-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border border-solid border-black">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-solid border-black p-2"
                >
                  {dataFormatter(cell.getValue())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
};

