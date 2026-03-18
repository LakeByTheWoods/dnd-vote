'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDateWithDay } from '@/lib/winner'

export default function ResultsPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/poll/${id}/results`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error)
    }

    fetchData()
    const interval = setInterval(fetchData, 3000) // live update
    return () => clearInterval(interval)
  }, [id])

  if (!data || !data.scores) {
    return <div className="p-6">Loading results...</div>
  }

  const disqualifiedDates = data.disqualified || []
  const availableDates = Object.keys(data.scores)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Results</h1>

        {data.winner && (
          <div className="mb-4 p-4 bg-green-100 border rounded text-center">
            🏆 Winner: {data.winner} ({formatDateWithDay(data.winner)})
          </div>
        )}

        {availableDates.length > 0 && (
          <>
            <h2 className="font-semibold mb-2">Available dates:</h2>
            {availableDates.map(date => (
              <div key={date} className="border p-3 mb-2 rounded">
                <div className="font-semibold">{date} ({formatDateWithDay(date)})</div>
                <div className="text-sm">Score: {data.scores[date]}</div>
                {data.first && <div className="text-sm">1st votes: {data.first[date] || 0}</div>}
              </div>
            ))}
          </>
        )}

        {disqualifiedDates.length > 0 && (
          <>
            <h2 className="font-semibold mt-4 mb-2 text-red-600">Disqualified dates:</h2>
            {disqualifiedDates.map(date => (
              <div
                key={date}
                className="border p-3 mb-2 rounded shadow bg-gray-100 opacity-50"
              >
                {date} ({formatDateWithDay(date)})
              </div>
            ))}
          </>
        )}

        <button
          onClick={() =>
            navigator.clipboard.writeText(window.location.href.replace('/results', ''))
          }
          className="mt-4 text-sm text-blue-500 w-full"
        >
          Copy Poll Link
        </button>
      </div>
    </div>
  )
}