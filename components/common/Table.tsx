import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

export const Table = ({
  data,
  columns,
  paginate = false,
}: {
  data: any[];
  columns: ColumnDef<any, any>[];
  paginate?: boolean;
}) => {
  if (!data) {
    return null;
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(paginate ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  });
  return (
    <>
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
      {paginate && (
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          {/* <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
        </div>
      )}
    </>
  );
};
