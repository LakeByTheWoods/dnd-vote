import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { title, dates } = await req.json()
  const id = uuid()

  db.polls[id] = { id, title, dates }
  db.votes[id] = []

  return Response.json({ id })
}