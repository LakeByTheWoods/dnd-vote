import { put, get } from '@vercel/blob';

export async function savePoll(id: string, data: any) {
  const blob = await put(`polls/${id}.json`, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
  });

  return blob;
}

export async function loadPoll(id: string) {
  const blobs = await list({ prefix: `polls/${id}` });

  if (!blobs.blobs.length) return null;

  const res = await fetch(blobs.blobs[0].url);
  return res.json();
}