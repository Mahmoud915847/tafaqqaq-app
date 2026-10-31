const API_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = 'tafaqqad_token';
const USER_KEY = 'tafaqqad_user';

// ---------- saved login ----------
export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ---------- reading errors ----------
function firstValidationMessage(data) {
  // ASP.NET validation errors look like: { errors: { Email: ["..."], Password: ["..."] } }
  if (!data || !data.errors) return null;
  const first = Object.values(data.errors)[0];
  return Array.isArray(first) ? first[0] : null;
}

// ---------- the one function every page uses ----------
// api('/auth/login', { method: 'POST', body: { email, password } })
// api('/office-requests', { method: 'POST', form: formData })      <- file uploads
export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    // the server is off, the address is wrong, or the browser blocked the call
    throw { status: 0, message: 'تعذّر الاتصال بالخادم. تأكد أنه يعمل.' };
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // an old or invalid token: forget it, so the pages treat the user as logged out
    if (res.status === 401 && token) clearSession();

    throw {
      status: res.status,
      code: data?.code,          // e.g. EMAIL_NOT_VERIFIED
      message: data?.message ?? firstValidationMessage(data) ?? 'حدث خطأ غير متوقع.',
      errors: data?.errors,
    };
  }

  return data;
}