import { useEffect, useState } from 'react';
import { Table } from '../common/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { WarnNotice } from '@prisma/client';

const SampleTable = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/warn/sample')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const columnHelper = createColumnHelper<WarnNotice>();

  const columns = [
    columnHelper.accessor('companyName', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('layoffDate', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('numAffected', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('state', {
      cell: (info) => info.getValue(),
    }),
  ];

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold">Sample Warn Data</h1>
      <Table data={data} columns={columns} />
    </div>
  );
};

export default SampleTable;
