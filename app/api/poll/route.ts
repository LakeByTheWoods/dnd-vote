import { savePoll } from '@/lib/blob';
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
  const { title, dates } = await req.json();

  const id = uuid();

  const poll = {
    id,
    title,
    dates,
    votes: [],
  };

  await savePoll(id, poll);

  return Response.json({ id });
}