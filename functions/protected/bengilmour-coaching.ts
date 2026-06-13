import type { RequestHandler } from '@cloudflare/workers-types';

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({ message: 'Protected coaching content' }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
