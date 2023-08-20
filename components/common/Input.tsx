import { useState } from 'react';

type Props = {
  onSubmit: (msg: String) => void;
  loading?: boolean;
};

export default function Input({ onSubmit, loading = false }: Props) {
  const [message, setMessage] = useState<String>('');
  function handleSubmit() {
    onSubmit(message);
  }

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && message) {
      handleSubmit();
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <input
        type="text"
        maxLength={512}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleEnter}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <button
        type="submit"
        disabled={loading}
        onClick={() => handleSubmit()}
        className="border border-grey mt-3 w-fit p-2 ml-auto"
      >
        Submit
      </button>
    </div>
  );
}
