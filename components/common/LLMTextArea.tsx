import { useState } from 'react';
import { post } from './util';

type Props = {
  setResponse: (response: any) => void;
  setError: (message: string) => void;
  url?: string;
  setParentLoading?: (loading: boolean) => void;
  arg?: any | null;
};

export default function LLMTextArea({
  setResponse,
  setError,
  setParentLoading,
  url = '/api/chat',
  arg = null,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  async function handleSubmit() {
    setLoading(true);
    setParentLoading != null && setParentLoading(true);
    let response = await post(url, { message: message.trim() });
    if (!('message' in response)) {
      setError(response['message']);
      return;
    }
    console.log(response);
    setResponse(response);
    setLoading(false);
    setParentLoading != null && setParentLoading(false);
  }

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
        className="border border-grey mt-3 w-fit p-2 ml-auto"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
}
