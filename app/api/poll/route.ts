import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'
import type { Poll } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const id = uuid()
  const dates = body.dates as string[]
  db.prepare('INSERT INTO polls (id, dates, votes) VALUES (?, ?, ?)')
    .run(id, JSON.stringify(dates), JSON.stringify([]))
  return new Response(JSON.stringify({ id }))
}