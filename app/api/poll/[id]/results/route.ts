import { db } from '@/lib/db'
import { calculateWinner } from '@/lib/calculateWinner'
import type { Poll } from '@/lib/types'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const row = db.prepare('SELECT * FROM polls WHERE id=?').get(id)

  if (!row) return new Response('Not found', { status: 404 })

  const poll: Poll = {
    id: row.id,
    dates: JSON.parse(row.dates),
    votes: JSON.parse(row.votes)
  }

  const results = calculateWinner(poll.votes, poll.dates)
  return new Response(JSON.stringify(results))
}