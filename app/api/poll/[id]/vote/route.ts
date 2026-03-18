import { db } from '@/lib/db'

export async function POST(req: Request, context: any) {
    const { id } = await context.params
  const body = await req.json()

  if (!db.votes[id]) {
    return Response.json({ error: 'Poll not found' }, { status: 404 })
  }

  db.votes[id].push(body)
  return Response.json({ ok: true })
}