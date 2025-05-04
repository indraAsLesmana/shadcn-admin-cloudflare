// Utility to check for auth_token cookie
export function isAuthenticated() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('auth_token='));
}
