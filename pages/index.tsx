import { useRef, useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout';
import { format } from 'sql-formatter';
import SampleTable from '@/components/home/SampleTable';
import { LLM } from '@/components/common/LLM';
import Chart from '@/components/common/Chart';
import { TimeSeriesChart } from '@/components/common/ExampleChart';
import { VisualizeData } from '@/components/home/VisualizeData';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const chartData = [
  {
      "time": "2018",
      "numlayoffs": "30932",
      "previousnumlayoffs": null,
      "value": null
  },
  {
      "time": "2019",
      "numlayoffs": "58771",
      "previousnumlayoffs": "30932",
      "value": "0"
  },
  {
      "time": "2020",
      "numlayoffs": "414138",
      "previousnumlayoffs": "58771",
      "value": "600"
  },
  {
      "time": "2021",
      "numlayoffs": "55001",
      "previousnumlayoffs": "414138",
      "value": "0"
  },
  {
      "time": "2022",
      "numlayoffs": "67641",
      "previousnumlayoffs": "55001",
      "value": "0"
  },
  {
      "time": "2023",
      "numlayoffs": "108181",
      "previousnumlayoffs": "67641",
      "value": "0"
  },
  {
      "time": "2024",
      "numlayoffs": "410",
      "previousnumlayoffs": "108181",
      "value": "0"
  },
  {
      "time": "2025",
      "numlayoffs": "1050",
      "previousnumlayoffs": "410",
      "value": "100"
  }
]

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [sql, setSql] = useState<string>('');
  const [error, setError] = useState<string>('');

  function setResponse(response: any) {
    let aggData = response['data'].map(JSON.parse);
    setAggregatedData(aggData);
    setSql(response['sql']);
  }

  return (
    <>
      <Layout>
        <div className="grid grid-flow-col gap-3 p-3 m-3">
          <div className="col-span-3">
            <div className='bg-blue-100 p-3'>
              <SampleTable />
              {/* <VisualizeData data={chartData} /> */}
            </div>
            {sql.length > 0 && (
              <>
                <hr className="my-3 h-0.5 border-t-0 bg-neutral-100 opacity-500 dark:opacity-50" />
                <h2>Source SQL:</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre>
                    <code>
                      {format(sql, {
                        language: 'postgresql',
                      })}
                    </code>
                  </pre>
                </div>
              </>
            )}
          </div>
          <div className="col-span-10">
            <div className="p-3 flex flex-col">
              <LLM
                setResponse={setResponse}
                setParentLoading={setLoading}
                setError={setError}
              />

              {loading && <div className="items-center justify-center p-6 mt-3"><LoadingSpinner /><p className='mt-3'>Asking AI...</p></div>}
              {error.length > 0 && <p>{error}</p>}
              {aggregatedData != null && aggregatedData.length > 0 && (
                <div className="mt-3">
                    <VisualizeData data={aggregatedData} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() =>
              fetch('/api/test')
                .then((res) => res.json())
                .then((data) => console.log(data))
            }
          >
            Test
          </button>
        </div>
      </Layout>
    </>
  );
}
