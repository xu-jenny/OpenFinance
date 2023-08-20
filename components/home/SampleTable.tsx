import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  MinneapolisCrimeRate,
  MinneapolisPoliceUseOfForce,
  WarnNotice,
} from '@prisma/client';
import { Table } from '@tremor/react';
import { prismaCli } from '@/prisma/prisma';
import DynamicTable from './DynamicTable';

export type TableName = 'WARN' | 'MN_CRIME' | 'MN_CRIME_FORCE';

type Props = {
  tableName: TableName;
};

const SampleTable = ({ tableName }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch('/api/sample', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableName,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res != null && 'data' in res && res.data.length > 0) {
          setData(res.data);
          const cols = Object.keys(res.data[0]).map((field) => ({
            Header: field,
            accessor: field,
          }));
          // @ts-ignore
          setColumns(cols);
        }
      });
  }, [tableName]);

  // const columnHelper = createColumnHelper<
  //   WarnNotice | MinneapolisCrimeRate | MinneapolisPoliceUseOfForce
  // >();

  // const columns = [
  //   columnHelper.accessor('companyName', {
  //     cell: (info) => info.getValue(),
  //   }),
  //   columnHelper.accessor('layoffDate', {
  //     cell: (info) => info.getValue(),
  //   }),
  //   columnHelper.accessor('numAffected', {
  //     cell: (info) => info.getValue(),
  //   }),
  //   columnHelper.accessor('state', {
  //     cell: (info) => info.getValue(),
  //   }),
  // ];

  return (
    <div className="p-2 overflow-x-auto max-w-full">
      <h1 className="text-xl font-bold">Sample {tableName} Data</h1>
      <DynamicTable data={data} paginate={false} />
    </div>
  );
};

export default SampleTable;
