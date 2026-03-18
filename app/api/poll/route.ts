import { savePoll } from '@/lib/blob';
import { validateCreatePollInput } from '@/lib/validation';
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
  const payload = await req.json();
  const result = validateCreatePollInput(payload);

  if (!result.success) {
    return Response.json({ error: result.message }, { status: 400 });
  }

  const { title, dates } = result.data;

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
