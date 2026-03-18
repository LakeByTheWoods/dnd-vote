import { loadPoll, saveVote } from '@/lib/blob';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ async params
) {
  const { id } = await context.params;  // ✅ await it
  const { name, available, priorities } = await req.json();

  const poll = await loadPoll(id);

  if (!poll) {
    return new Response('Not found', { status: 404 });
  }

  await saveVote(id, { name, available, priorities });

  return Response.json({ status: 'ok' });
}