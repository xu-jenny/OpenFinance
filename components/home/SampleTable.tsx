import { useEffect, useState } from 'react';
import { Table } from '../common/Table';

const SampleTable = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/warn/sample')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold">Sample Data</h1>
      <Table data={data} />
    </>
  );
};

export default SampleTable;
