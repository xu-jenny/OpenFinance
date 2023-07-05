import { useMemo } from 'react';
import { Table } from '../common/Table';
import { createColumnHelper } from '@tanstack/react-table';

const DynamicTable = ({ data }: { data: any }) => {
  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(() => {
    if (data.length > 0) {
      return Object.keys(data[0]).map((key) =>
        columnHelper.accessor(key, {
          cell: (info) => info.getValue(),
        }),
      );
    }
    return [];
  }, [columnHelper, data]);

  return (
    <>
      <Table data={data} columns={columns} paginate={true} />
    </>
  );
};

export default DynamicTable;
