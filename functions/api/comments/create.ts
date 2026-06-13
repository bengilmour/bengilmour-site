import type { RequestHandler } from '@cloudflare/workers-types';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  return new Response(JSON.stringify({ message: 'Comment created', data }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
