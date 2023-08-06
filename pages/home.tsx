import { useRef, useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout';
import { format } from 'sql-formatter';
import SampleTable from '@/components/home/SampleTable';
import { LLM } from '@/components/common/LLM';
import { VisualizeData } from '@/components/home/VisualizeData';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '@/utils/supabase-client';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [sql, setSql] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const user = await supabaseClient.auth.getUser();
  //       setUser(user['data']['user']);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

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
            <div className="bg-blue-100 p-3 max-w-[50%]">
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
                user={user}
              />

              {loading && (
                <div className="items-center justify-center p-6 mt-3">
                  <LoadingSpinner />
                  <p className="mt-3">Asking AI...</p>
                </div>
              )}
              {error.length > 0 && <p>{error}</p>}
              {aggregatedData != null && aggregatedData.length > 0 && (
                <div className="mt-3">
                  <VisualizeData data={aggregatedData} />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div>
          <button
            onClick={async () =>
              await fetch('/api/test', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uid: user?.id,
                }),
              })
                .then((res) => res.json())
                .then((data) => console.log(data))
            }
          >
            Test
          </button>
        </div> */}
      </Layout>
    </>
  );
}
