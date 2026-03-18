import { db } from '@/lib/db'
import { calculateWinner } from '@/lib/winner'

export async function GET(req: Request, context: any) {
    const { id } = await context.params
  const poll = db.polls[id]
  const votes = db.votes[id]

  if (!poll) {
    return Response.json({ error: 'Poll not found' }, { status: 404 })
  }

  return Response.json(calculateWinner(votes || [], poll.dates))
}