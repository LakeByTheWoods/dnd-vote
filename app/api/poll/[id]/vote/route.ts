import { loadPoll, savePoll } from '@/lib/blob';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
  const { name, available, priorities } = await req.json();

  const poll = await loadPoll(params.id);

  if (!poll) {
    return new Response('Not found', { status: 404 });
  }

  poll.votes.push({
    name,
    available,
    priorities,
  });

  await savePoll(params.id, poll);

  return Response.json({ success: true });
}