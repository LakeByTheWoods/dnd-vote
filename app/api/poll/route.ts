import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = uuid()
  const dates: string[] = body.dates || []

  db.prepare('INSERT INTO polls (id, dates, votes) VALUES (?, ?, ?)')
    .run(id, JSON.stringify(dates), JSON.stringify([]))

  return new Response(JSON.stringify({ id }))
}