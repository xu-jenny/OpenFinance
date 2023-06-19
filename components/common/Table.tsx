import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { WarnNotice } from '@prisma/client';
import { format, isValid } from 'date-fns';

type Notice = {
  companyName: string;
  noticeDate: Date;
  layOffDate: Date;
  num_affected: number;
};

const defaultData: Notice[] = [
  {
    companyName: 'Meta',
    noticeDate: new Date(2021, 1, 1),
    layOffDate: new Date(2021, 2, 2),
    num_affected: 321,
  },
  {
    companyName: 'Google',
    noticeDate: new Date(2021, 4, 1),
    layOffDate: new Date(2021, 6, 15),
    num_affected: 99,
  },
  {
    companyName: 'Apple',
    noticeDate: new Date(2021, 3, 1),
    layOffDate: new Date(2021, 4, 15),
    num_affected: 2000,
  },
];

const columnHelper = createColumnHelper<WarnNotice>();

const dataFormatter = (value: any) => {
  console.log(value, typeof value, isValid(value), value instanceof Date);
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

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('noticeDate', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('state', {
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('layoffDate', {
  //   cell: (info) => info.getValue().toLocaleDateString(),
  // }),
  columnHelper.accessor('numAffected', {
    cell: (info) => info.getValue(),
  }),
];

export const Table = ({ data }: { data: WarnNotice[] }) => {
  if (!data) {
    return null; // or return a loading spinner
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const formatDate = (date: number | Date) => {
    return format(date, 'MM/dd/yy');
  };

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
                  {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
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
