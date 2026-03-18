'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePollPage() {
  const router = useRouter()
  const [dates, setDates] = useState<string[]>([])
  const [newDate, setNewDate] = useState('')
  const [pollName, setPollName] = useState('')

  // Add a new date
  const addDate = () => {
    if (newDate && !dates.includes(newDate)) {
      setDates([...dates, newDate])
      setNewDate('')
    }
  }

  // Remove a date
  const removeDate = (dateToRemove: string) => {
    setDates(dates.filter(d => d !== dateToRemove))
  }

  // Submit poll to backend
  const createPoll = async () => {
    if (!pollName || dates.length === 0) {
      alert('Please enter a poll name and at least one date.')
      return
    }

    const res = await fetch('/api/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pollName, dates }),
    })

    if (res.ok) {
      const { id } = await res.json()
      router.push(`/poll/${id}`)
    } else {
      alert('Failed to create poll')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create D&D Poll</h1>

      {/* Poll Name */}
      <input
        type="text"
        placeholder="Poll name"
        value={pollName}
        onChange={e => setPollName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Add new date */}
      <div className="flex mb-4">
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addDate}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* List of dates with remove buttons */}
      <ul>
        {dates.map(date => (
          <li
            key={date}
            className="flex justify-between items-center border p-2 mb-1 rounded"
          >
            <span>{date}</span>
            <button
              onClick={() => removeDate(date)}
              className="text-red-500 font-bold px-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Create Poll Button */}
      <button
        onClick={createPoll}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
      >
        Create Poll
      </button>
    </div>
  )
}