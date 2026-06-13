import { isAuthorized } from './auth';
import { blogPosts } from './data-store';

export async function onRequestGet() {
  return new Response(JSON.stringify(blogPosts), {
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
  const tags = String(form.get('tags') ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const content = String(form.get('content') ?? '').trim();

  if (!id || !title || !description || !pubDate || !content) {
    return new Response(JSON.stringify({ error: 'Missing required blog fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existingIndex = blogPosts.findIndex((post) => post.id === id);
  const newEntry = { id, title, description, pubDate, tags, content };

  if (existingIndex >= 0) {
    blogPosts[existingIndex] = newEntry;
    return new Response(JSON.stringify({ message: 'Blog post updated.', post: newEntry }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  blogPosts.push(newEntry);
  return new Response(JSON.stringify({ message: 'Blog post created.', post: newEntry }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
