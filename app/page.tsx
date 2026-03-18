'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [title, setTitle] = useState('D&D Session')
  const [dates, setDates] = useState([''])
  const router = useRouter()

  const updateDate = (i: number, value: string) => {
    const copy = [...dates]
    copy[i] = value
    setDates(copy)
  }

  const addDate = () => setDates([...dates, ''])

  const createPoll = async () => {
    const res = await fetch('/api/poll', {
      method: 'POST',
      body: JSON.stringify({ title, dates: dates.filter(Boolean) })
    })
    const data = await res.json()
    router.push(`/poll/${data.id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🎲 Plan Your Session</h1>

        <input className="border p-2 w-full mb-4 rounded" value={title} onChange={e => setTitle(e.target.value)} />

        {dates.map((d, i) => (
          <input key={i} type="date" className="border p-2 w-full mb-2 rounded" value={d} onChange={e => updateDate(i, e.target.value)} />
        ))}

        <button onClick={addDate} className="text-sm text-blue-500 mb-4">+ Add Date</button>

        <button onClick={createPoll} className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded">
          Create Poll
        </button>
      </div>
    </div>
  )
}