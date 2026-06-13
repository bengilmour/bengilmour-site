import { isAuthorized } from './auth';
import { images } from './data-store';

export async function onRequestGet() {
  return new Response(JSON.stringify(images), {
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
  const filename = String(form.get('filename') ?? '').trim();
  const alt = String(form.get('alt') ?? '').trim();
  const url = String(form.get('url') ?? '').trim();

  if (!filename || !alt || !url) {
    return new Response(JSON.stringify({ error: 'Missing required image fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existingIndex = images.findIndex((item) => item.filename === filename);
  const newEntry = { id: filename, filename, alt, url };

  if (existingIndex >= 0) {
    images[existingIndex] = newEntry;
    return new Response(JSON.stringify({ message: 'Image updated.', image: newEntry }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  images.push(newEntry);
  return new Response(JSON.stringify({ message: 'Image saved.', image: newEntry }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
