import { Navigate, Outlet } from 'react-router-dom';
import { clearSession, getToken, getUser } from '../api/client';

const HOME_BY_ROLE = {
  Admin: '/admin/requests',
  Office: '/company/dashboard',
  Engineer: '/engineer/inspections',
  Client: '/bookings',
};

// Reads the "exp" claim from the JWT. A broken token counts as expired.
function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 < Date.now() : false;
  } catch {
    return true;
  }
}

export default function RequireRole({ roles }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user || isExpired(token)) {
    if (token) clearSession();
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] ?? '/'} replace />;
  }

  return <Outlet />;
}