import type { RequestHandler } from '@cloudflare/workers-types';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  return new Response(JSON.stringify({ message: 'Booking request received', data }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
