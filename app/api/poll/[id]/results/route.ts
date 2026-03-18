import { loadPoll } from '@/lib/blob';
import { calculateWinner } from '@/lib/calculateWinner';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const poll = await loadPoll(id);

  if (!poll) {
    return new Response('Not found', { status: 404 });
  }

  const results = calculateWinner(poll.votes, poll.dates);

  return Response.json({ ...poll, results });
}