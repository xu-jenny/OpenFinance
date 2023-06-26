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
    week: '2022-44',
    totalAffected: 3900,
  },
  {
    week: '2023-31',
    totalAffected: 906,
  },
  {
    week: '2022-41',
    totalAffected: 2057,
  },
  {
    week: '2023-28',
    totalAffected: 1064,
  },
  {
    week: '2023-01',
    totalAffected: 6079,
  },
  {
    week: '2022-42',
    totalAffected: 1384,
  },
  {
    week: '2024-40',
    totalAffected: 1,
  },
  {
    week: '2025-09',
    totalAffected: 1050,
  },
  {
    week: '2023-27',
    totalAffected: 264,
  },
  {
    week: '2022-43',
    totalAffected: 1809,
  },
  {
    week: '2023-05',
    totalAffected: 4349,
  },
  {
    week: '2023-21',
    totalAffected: 2438,
  },
  {
    week: '2024-01',
    totalAffected: 72,
  },
  {
    week: '2023-11',
    totalAffected: 6784,
  },
  {
    week: '2023-18',
    totalAffected: 3781,
  },
  {
    week: '2023-10',
    totalAffected: 2506,
  },
  {
    week: '2022-51',
    totalAffected: 2869,
  },
  {
    week: '2023-15',
    totalAffected: 13387,
  },
  {
    week: '2023-39',
    totalAffected: 111,
  },
  {
    week: '2023-52',
    totalAffected: 289,
  },
  {
    week: '2023-08',
    totalAffected: 1141,
  },
  {
    week: '2023-03',
    totalAffected: 1061,
  },
  {
    week: '2023-35',
    totalAffected: 233,
  },
  {
    week: '2023-30',
    totalAffected: 787,
  },
  {
    week: '2023-38',
    totalAffected: 1,
  },
  {
    week: '2023-44',
    totalAffected: 123,
  },
  {
    week: '2023-26',
    totalAffected: 5356,
  },
  {
    week: '2023-19',
    totalAffected: 1280,
  },
  {
    week: '2023-36',
    totalAffected: 125,
  },
  {
    week: '2023-43',
    totalAffected: 2,
  },
  {
    week: '2023-14',
    totalAffected: 4338,
  },
  {
    week: '2023-25',
    totalAffected: 2705,
  },
  {
    week: '2023-22',
    totalAffected: 6022,
  },
  {
    week: '2023-12',
    totalAffected: 4304,
  },
  {
    week: '2023-04',
    totalAffected: 1666,
  },
  {
    week: '2024-15',
    totalAffected: 61,
  },
  {
    week: '2023-07',
    totalAffected: 3605,
  },
  {
    week: '2023-23',
    totalAffected: 2499,
  },
  {
    week: '2022-45',
    totalAffected: 1170,
  },
  {
    week: '2024-13',
    totalAffected: 91,
  },
  {
    week: '2023-02',
    totalAffected: 7389,
  },
  {
    week: '2022-48',
    totalAffected: 3601,
  },
  {
    week: '2023-29',
    totalAffected: 228,
  },
  {
    week: '2022-50',
    totalAffected: 1313,
  },
  {
    week: '2023-09',
    totalAffected: 2055,
  },
  {
    week: '2023-06',
    totalAffected: 2143,
  },
  {
    week: '2024-09',
    totalAffected: 1,
  },
  {
    week: '2024-38',
    totalAffected: 1,
  },
  {
    week: '2023-20',
    totalAffected: 1360,
  },
  {
    week: '2022-52',
    totalAffected: 3526,
  },
  {
    week: '2023-17',
    totalAffected: 5088,
  },
  {
    week: '2023-51',
    totalAffected: 76,
  },
  {
    week: '2022-46',
    totalAffected: 3123,
  },
  {
    week: '2023-16',
    totalAffected: 2235,
  },
  {
    week: '2023-33',
    totalAffected: 301,
  },
  {
    week: '2023-24',
    totalAffected: 886,
  },
  {
    week: '2024-02',
    totalAffected: 183,
  },
  {
    week: '2023-32',
    totalAffected: 10,
  },
  {
    week: '2022-49',
    totalAffected: 1371,
  },
  {
    week: '2023-34',
    totalAffected: 646,
  },
  {
    week: '2023-13',
    totalAffected: 8005,
  },
  {
    week: '2022-47',
    totalAffected: 2558,
  },
];

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [sql, setSql] = useState<string>('');
  const [error, setError] = useState<string>('');

  function setResponse(response: any) {
    setAggregatedData(response['data']);
    setSql(response['sql']);
  }

  return (
    <>
      <Layout>
        <div className="grid grid-flow-col gap-3 p-3 m-3">
          <div className="bg-blue-100 col-span-3">
            <SampleTable />
            <VisualizeData data={chartData} />
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

              {loading && <p>Loading...</p>}
              {error.length > 0 && <p>{error}</p>}
              {aggregatedData != null && aggregatedData.length > 0 && (
                <div className="mt-3">
                  <p>Aggregated Data</p>
                  {/* <p>{JSON.stringify(aggregatedData)}</p> */}
                  <div className="mt-3">
                    <VisualizeData data={chartData} />
                  </div>
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
