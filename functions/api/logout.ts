import { clearAuthCookie } from './auth';

export async function onRequestGet() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/login',
      'Set-Cookie': clearAuthCookie(),
    },
  });
}
