import { useRef, useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Table } from '@/components/ui/Table';
import { format } from 'sql-formatter';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [sql, setSql] = useState<string>('');
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
  }>({
    messages: [
      {
        message: 'Hi there its Tom! What would like to learn about notion?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  useEffect(() => {
    fetch('/api/warnNotices')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  const { messages, pending, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setQuery('');
    setMessageState((state) => ({ ...state, pending: '' }));

    const ctrl = new AbortController();
    console.log(question, history);
    try {
      fetchEventSource('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === '[DONE]') {
            setMessageState((state) => ({
              history: [...state.history, [question, state.pending ?? '']],
              messages: [
                ...state.messages,
                {
                  type: 'apiMessage',
                  message: state.pending ?? '',
                },
              ],
              pending: undefined,
            }));
            setLoading(false);
            ctrl.abort();
          } else {
            const data = JSON.parse(event.data);
            setMessageState((state) => ({
              ...state,
              pending: (state.pending ?? '') + data.data,
            }));
          }
        },
      });
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }

  async function handleChat() {
    const question = query.trim();
    console.log(question);
    let response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
    console.log(response);
    console.log(response['data']);
    setAggregatedData(response['data']);
    setSql(response['sql']);
    // console.log(aggregatedData);
    // console.log(sql);
  }
  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      // handleSubmit(e);
      handleChat();
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending ? [{ type: 'apiMessage', message: pending }] : []),
    ];
  }, [messages, pending]);

  return (
    <>
      <Layout>
        <div className="grid grid-flow-col gap-3 p-3 m-3">
          <div className="bg-blue-100 col-span-6 p-3">
            {data != null && <Table data={data} />}
          </div>
          <div className="col-span-6">
            <div className="p-3 flex flex-col">
              <div className="flex flex-row gap-2">
                <textarea
                  disabled={loading}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  autoFocus={false}
                  rows={4}
                  maxLength={512}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    loading
                      ? 'Waiting for response...'
                      : 'How does notion api work?'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="border border-grey mt-3"
                >
                  Submit
                </button>
              </div>
              {aggregatedData.length > 0 && (
                <div className="mt-3">
                  <p>Aggregated Data</p>
                  <p>{JSON.stringify(aggregatedData)}</p>
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
