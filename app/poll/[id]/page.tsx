'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Poll } from '@/lib/types'

function SortableItem({ id, selectedDates, setSelectedDates }: {
  id: string
  selectedDates: string[]
  setSelectedDates: (dates: string[]) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const toggleAvailable = () => {
    if (selectedDates.includes(id)) {
      setSelectedDates(selectedDates.filter(d => d !== id))
    } else {
      setSelectedDates([...selectedDates, id])
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-3 mb-2 rounded flex justify-between items-center"
    >
      <span>{id}</span>
      <input
        type="checkbox"
        checked={selectedDates.includes(id)}
        onChange={toggleAvailable}
      />
    </div>
  )
}

export default function PollPage() {
  const params = useParams()
  const id = params.id as string

  const [poll, setPoll] = useState<Poll | null>(null)
  const [dates, setDates] = useState<string[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/poll/${id}`)
      .then(res => res.json())
      .then((data: Poll) => {
        setPoll(data)
        setDates(data.dates)
        setSelectedDates([...data.dates]) // default all available
      })
      .catch(console.error)
  }, [id])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = dates.indexOf(active.id)
      const newIndex = dates.indexOf(over.id)
      setDates(arrayMove(dates, oldIndex, newIndex))
    }
  }

  if (!poll) return <div className="p-6">Loading poll...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Poll</h1>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dates} strategy={verticalListSortingStrategy}>
            {dates.map(date => (
              <SortableItem
                key={date}
                id={date}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}