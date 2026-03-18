'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { Results } from '@/types'
import { formatDateWithDay } from '@/lib/calculateWinner'

export default function ResultsPage() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<Results | null>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/poll/${id}/results`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error)
    }
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [id])

  if (!data) return <div className="p-6">Loading results...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Results</h1>

        {data.winner && (
          <div className="mb-4 p-4 bg-green-100 border rounded text-center">
            🏆 Winner: {data.winner} ({formatDateWithDay(data.winner)})
          </div>
        )}

        {Object.keys(data.scores).length > 0 && (
          <>
            <h2 className="font-semibold mb-2">Available dates:</h2>
            {Object.keys(data.scores).map((date: string) => (
              <div key={date} className="border p-3 mb-2 rounded">
                <div className="font-semibold">{date} ({formatDateWithDay(date)})</div>
                <div className="text-sm">Score: {data.scores[date]}</div>
                {data.first && <div className="text-sm">1st votes: {data.first[date] || 0}</div>}
              </div>
            ))}
          </>
        )}

        {data.disqualified.length > 0 && (
          <>
            <h2 className="font-semibold mt-4 mb-2 text-red-600">Disqualified dates:</h2>
            {data.disqualified.map((date: string) => (
              <div key={date} className="border p-3 mb-2 rounded shadow bg-gray-100 opacity-50">
                {date} ({formatDateWithDay(date)})
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}