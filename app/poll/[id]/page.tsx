'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PollPage() {
  const { id } = useParams();

  const [poll, setPoll] = useState<any>(null);
  const [name, setName] = useState('');
  const [available, setAvailable] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/poll/${id}/results`);
      const data = await res.json();

      setPoll(data);
      setAvailable(data.dates);
      setPriorities(data.dates);
    }

    load();
  }, [id]);

  function toggleAvailable(date: string) {
    setAvailable((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  }

  async function submitVote() {
    await fetch(`/api/poll/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        available,
        priorities,
      }),
    });

    alert('Vote submitted!');
  }

  if (!poll) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{poll.title}</h1>

      <input
        className="w-full border rounded p-2"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <h3 className="font-semibold mb-2">Available Dates</h3>

        <div className="space-y-2">
          {poll.dates.map((date: string) => {
            const formatted = new Date(date).toLocaleDateString(
              undefined,
              { weekday: 'short', month: 'short', day: 'numeric' }
            );

            return (
              <label
                key={date}
                className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={available.includes(date)}
                  onChange={() => toggleAvailable(date)}
                  className="w-4 h-4"
                />
                <span>{formatted}</span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={submitVote}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Vote
      </button>
    </div>
  );
}