import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

type RoleGuardProps = {
  children: React.ReactNode;
  requiredRole?: string; // same key as Angular data.role (e.g. 'DASHBOARD' or 'TITLE_SEARCH')
  redirectTo?: string;
};

const getStoredPermissions = (): Record<string, any> | null => {
  try {
    const raw = localStorage.getItem('permissions');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredRole, redirectTo = '/'} ) => {
  const location = useLocation();

  // Not authenticated -> go to login
  const session = (() => {
    try { return authService.getSession(); } catch { return null; }
  })();
  const user = session?.user ?? null;
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific role required, allow any authenticated user
  if (!requiredRole) return <>{children}</>;

  // Prefer server-provided permission map in localStorage, fallback to user.permissions if present
  const perms = getStoredPermissions() ?? (user?.permissions ? user.permissions : null);

  const has = Boolean(perms && perms[requiredRole] && perms[requiredRole].granted);

  return has ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

export default RoleGuard;