import type { RequestHandler } from '@cloudflare/workers-types';

export const GET: RequestHandler = async () => {
  const comments = [
    { id: 1, name: 'Visitor', comment: 'Great content!' }
  ];
  return new Response(JSON.stringify({ comments }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
