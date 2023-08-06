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

type TableName = 'WARN' | 'CrimeRate' | 'UseOfForce';

const SampleTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [tableName, setTableName] = useState<TableName>('CrimeRate');
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
      .then((data) => {
        console.log(data);
        setData(data);
        console.log(Object.keys(data[0]));
        const cols = Object.keys(data[0]).map((field) => ({
          Header: field,
          accessor: field,
        }));
        console.log(cols);
        // @ts-ignore
        setColumns(cols);
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
