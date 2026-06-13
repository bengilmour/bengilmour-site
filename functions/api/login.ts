import { createAuthCookie, validateCredentials } from './auth';

export async function onRequestPost({ request }) {
  const form = await request.formData();
  const username = String(form.get('username') ?? '');
  const password = String(form.get('password') ?? '');

  if (!validateCredentials(username, password)) {
    return Response.redirect(new URL('/login?error=1', request.url), 303);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin',
      'Set-Cookie': createAuthCookie(),
    },
  });
}
