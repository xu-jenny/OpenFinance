import { useState } from 'react';

type Props = {
  setResponse: (response: any) => void;
  setError: (message: string) => void;
  setParentLoading?: (loading: boolean) => void;
};

export const LLM = ({ setResponse, setError, setParentLoading }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  async function handleSubmit() {
    setLoading(true);
    setParentLoading != null && setParentLoading(true);
    const question = message.trim();
    console.log(question);
    let response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
    console.log(response);
    if ('message' in response) {
      setLoading(false);
      return setError(response['message']);
    }
    console.log(response['data']);
    setResponse(response);
    setLoading(false);
    setParentLoading != null && setParentLoading(false);
    // setAggregatedData(response['data']);
    // setSql(response['sql']);
    // console.log(aggregatedData);
    // console.log(sql);
  }
  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && message) {
      handleSubmit();
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        disabled={loading}
        onKeyDown={handleEnter}
        autoFocus={false}
        rows={4}
        maxLength={512}
        id="userInput"
        name="userInput"
        placeholder={
          loading ? 'Waiting for response...' : 'How does notion api work?'
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="border border-grey mt-3 w-fit p-2"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
};
