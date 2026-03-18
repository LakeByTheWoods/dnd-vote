import { loadPoll } from '@/lib/blob';
import { calculateWinner } from '@/lib/calculateWinner';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const poll = await loadPoll(params.id);

  if (!poll) {
    return new Response('Not found', { status: 404 });
  }

  const results = calculateWinner(poll.votes, poll.dates);

  return Response.json({ ...poll, results });
}