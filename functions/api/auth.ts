const ADMIN_USERNAME = 'bengilmour';
const ADMIN_PASSWORD = 'Qf4648246!';
const AUTH_COOKIE_NAME = 'ADMIN_AUTH';
const AUTH_COOKIE_VALUE = '1';

export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const entry of cookieHeader.split(';')) {
    const [name, ...rest] = entry.trim().split('=');
    cookies[name] = rest.join('=');
  }
  return cookies;
}

export function isAuthorized(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies[AUTH_COOKIE_NAME] === AUTH_COOKIE_VALUE;
}

export function createAuthCookie() {
  return `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function clearAuthCookie() {
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
