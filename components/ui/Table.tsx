import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { WarnNotice } from '@prisma/client';

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
  // const [data, setData] = React.useState(preloadData);
  if (!data) {
    return null; // or return a loading spinner
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead className="border-black border">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-grey border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
