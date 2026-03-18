'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDateWithDay } from '@/lib/winner'

function DraggableItem({ id }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="border p-3 mb-2 rounded shadow cursor-move bg-white"
    >
      <div className="font-semibold">{id}</div>
      <div className="text-sm text-gray-500">{formatDateWithDay(id)}</div>
    </div>
  )
}

export default function PollPage() {
  const params = useParams()
  const id = params.id as string

  const [poll, setPoll] = useState<any>(null)
  const [fullDates, setFullDates] = useState<string[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([]) // available dates
  const [name, setName] = useState('')

  useEffect(() => {
    fetch(`/api/poll/${id}`)
      .then(res => res.json())
      .then(data => {
        setPoll(data)
        setFullDates(data.dates)
        setSelectedDates(data.dates) // default: all available
      })
      .catch(console.error)
  }, [id])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = selectedDates.indexOf(active.id)
      const newIndex = selectedDates.indexOf(over.id)
      setSelectedDates(arrayMove(selectedDates, oldIndex, newIndex))
    }
  }

  const toggleDateSelection = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(prev => prev.filter(d => d !== date))
    } else {
      setSelectedDates(prev => [...prev, date])
    }
  }

  const submitVote = async () => {
    if (!name) {
      alert('Please enter your name')
      return
    }

    const unavailable = fullDates.filter(d => !selectedDates.includes(d))

    await fetch(`/api/poll/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ name, preferences: selectedDates, unavailable })
    })
    window.location.href = `/poll/${id}/results`
  }

  if (!poll) return <div className="p-6">Loading poll...</div>

  const availableDates = selectedDates
  const disqualifiedDates = fullDates.filter(d => !selectedDates.includes(d))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">{poll.title}</h1>

        <input
          placeholder="Your name"
          className="border p-2 w-full mb-4 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <h2 className="font-semibold mb-2">Select the dates you can attend:</h2>
        {fullDates.map(date => (
          <label key={date} className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedDates.includes(date)}
              onChange={() => toggleDateSelection(date)}
            />
            {date} ({formatDateWithDay(date)})
          </label>
        ))}

        {availableDates.length > 0 && (
          <>
            <h2 className="font-semibold mt-4 mb-2">Rank your available dates:</h2>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={availableDates} strategy={verticalListSortingStrategy}>
                {availableDates.map(date => (
                  <DraggableItem key={date} id={date} />
                ))}
              </SortableContext>
            </DndContext>
          </>
        )}

        {disqualifiedDates.length > 0 && (
          <>
            <h2 className="font-semibold mt-4 mb-2">Disqualified dates:</h2>
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
          onClick={submitVote}
          className="bg-green-600 hover:bg-green-700 text-white p-2 w-full mt-4 rounded"
        >
          Submit Vote
        </button>
      </div>
    </div>
  )
}