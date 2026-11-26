// Where to send the user after login / register.
// RequireRole saves the page the user wanted as state.from ("/book-inspection?company=...").
// Only paths inside our own site are accepted, so a crafted link can't send users to another website.
export function safeFrom(from) {
  if (typeof from !== 'string') return null;
  if (!from.startsWith('/') || from.startsWith('//') || from.includes('\\')) return null;
  if (/^\/(login|register|verify-otp)(\/|\?|$)/.test(from)) return null;   // never loop back to the auth pages
  return from;
}