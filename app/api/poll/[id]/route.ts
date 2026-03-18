import { db } from '@/lib/db'

export async function GET(req: Request, context: any) {
    const params = await context.params
    const id = params.id
  return Response.json(db.polls[id])
}