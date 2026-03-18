'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ResultsPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/poll/${id}/results`);
      const json = await res.json();
      setData(json);
    }

    load();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.title} - Results</h1>

      <h3>Votes</h3>
      {data.votes.map((v: any, i: number) => (
        <div key={i}>
          <strong>{v.name}</strong>: {v.available.join(', ')}
        </div>
      ))}

      <h3>Winner</h3>
      <div>{data.results.winner}</div>
    </div>
  );
}