import { useRef, useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout';
import { format } from 'sql-formatter';
import SampleTable from '@/components/home/SampleTable';
import { LLM } from '@/components/common/LLM';
import Chart from '@/components/common/Chart';
import { TimeSeriesChart } from '@/components/common/ExampleChart';
import { VisualizeData } from '@/components/home/VisualizeData';

const chartData = [
  {
    "month": "2023-05",
    "NJ": 568,
    "CA": 0
  },
  {
    "month": "2023-08",
    "NJ": 709,
    "CA": 0
  },
  {
    "month": "2023-03",
    "NJ": 1243,
    "CA": 7304
  },
  {
    "month": "2023-04",
    "NJ": 2151,
    "CA": 8204
  },
  {
    "month": "2023-07",
    "NJ": 679,
    "CA": 0
  },
  {
    "month": "2023-09",
    "NJ": 67,
    "CA": 0
  },
  {
    "month": "2023-06",
    "NJ": 2001,
    "CA": 0
  }
]

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [sql, setSql] = useState<string>('');

  function setResponse(response: any) {
    setAggregatedData(response['data']);
    setSql(response['sql']);
  }

  return (
    <>
      <Layout>
        <div className="grid grid-flow-col gap-3 p-3 m-3">
          <div className="bg-blue-100 col-span-6 p-3">
            <SampleTable />
            {/* <TimeSeriesChart /> */}
          </div>
          <div className="col-span-6">
            <div className="p-3 flex flex-col">
              <LLM setResponse={setResponse} setParentLoading={setLoading} />
              <div>
              {/* <VisualizeData data={aggregatedData} />   */}
              {/* [{"totalAffected": 123}]} /> */}
              </div>

              {loading && <p>Loading...</p>}
              {aggregatedData.length > 0 && (
                <div className="mt-3">
                  <p>Aggregated Data</p>
                  {/* <p>{JSON.stringify(aggregatedData)}</p> */}
                  <div className='mt-3'>
                    <VisualizeData data={aggregatedData} />
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
