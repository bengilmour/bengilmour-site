import { isAuthorized } from './auth';
import { sermons } from './data-store';

export async function onRequestGet() {
  return new Response(JSON.stringify(sermons), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost({ request }) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const form = await request.formData();
  const id = String(form.get('id') ?? '').trim();
  const title = String(form.get('title') ?? '').trim();
  const description = String(form.get('description') ?? '').trim();
  const pubDate = String(form.get('pubDate') ?? '').trim();
  const scripture = String(form.get('scripture') ?? '').trim();
  const location = String(form.get('location') ?? '').trim();
  const content = String(form.get('content') ?? '').trim();

  if (!id || !title || !description || !pubDate || !content) {
    return new Response(JSON.stringify({ error: 'Missing required sermon fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existingIndex = sermons.findIndex((item) => item.id === id);
  const newEntry = { id, title, description, pubDate, scripture, location, content };

  if (existingIndex >= 0) {
    sermons[existingIndex] = newEntry;
    return new Response(JSON.stringify({ message: 'Sermon updated.', sermon: newEntry }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  sermons.push(newEntry);
  return new Response(JSON.stringify({ message: 'Sermon created.', sermon: newEntry }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
