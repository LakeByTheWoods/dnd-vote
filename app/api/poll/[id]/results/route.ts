import { db } from '@/lib/db'
import { calculateWinner } from '@/lib/winner'
import type { Poll } from '@/types'

export async function GET(req: Request, { params }: { params: { id: string }}) {
  const row = db.prepare('SELECT * FROM polls WHERE id=?').get(params.id)
  if (!row) return new Response('Not found', { status: 404 })
  const poll: Poll = {
    id: row.id,
    dates: JSON.parse(row.dates),
    votes: JSON.parse(row.votes)
  }
  const results = calculateWinner(poll.votes, poll.dates)
  return new Response(JSON.stringify(results))
}