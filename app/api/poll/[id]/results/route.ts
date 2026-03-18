import { loadPoll } from '@/lib/blob';
import { calculateWinner } from '@/lib/calculateWinner';
import { validatePoll } from '@/lib/validation';
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

  const parsedPoll = validatePoll(poll);
  if (!parsedPoll.success) {
    return Response.json({ error: parsedPoll.message }, { status: 500 });
  }

  const results = calculateWinner(parsedPoll.data.votes, parsedPoll.data.dates);

  return Response.json({ ...parsedPoll.data, results });
}
