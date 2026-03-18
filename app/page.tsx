'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const [title, setTitle] = useState('');
  const [dates, setDates] = useState<string[]>(['']);
  const router = useRouter();

  function updateDate(index: number, value: string) {
    const copy = [...dates];
    copy[index] = value;
    setDates(copy);
  }

  function addDate() {
    setDates([...dates, '']);
  }

  function removeDate(index: number) {
    setDates(dates.filter((_, i) => i !== index));
  }

  async function createPoll() {
    const res = await fetch('/api/poll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        dates: dates.filter(Boolean),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error ?? 'Could not create poll.');
      return;
    }

    const data = await res.json();
    router.push(`/poll/${data.id}`);
  }

  return (
    <div>
      <h1>Create Poll</h1>

      <input
        placeholder="Poll title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h3>Dates</h3>

      {dates.map((date, i) => (
        <div key={i}>
          <input
            type="date"
            value={date}
            onChange={(e) => updateDate(i, e.target.value)}
          />
          <button onClick={() => removeDate(i)}>Remove</button>
        </div>
      ))}

      <button onClick={addDate}>Add Date</button>

      <br /><br />

      <button onClick={createPoll}>Create</button>
    </div>
  );
}
