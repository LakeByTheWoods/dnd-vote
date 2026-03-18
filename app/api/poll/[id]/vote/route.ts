import { loadPoll, saveVote } from '@/lib/blob';
import { validateVoteInput } from '@/lib/validation';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const poll = await loadPoll(id);

  if (!poll) {
    return new Response('Not found', { status: 404 });
  }

  const payload = await req.json();
  const result = validateVoteInput(payload, poll);

  if (!result.success) {
    return Response.json({ error: result.message }, { status: 400 });
  }

  await saveVote(id, result.data);

  return Response.json({ status: 'ok' });
}
