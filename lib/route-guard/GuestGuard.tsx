'use client';
// ==============================|| GUEST GUARD ||============================== //

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function GuestGuard({ children }: any) {
   const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const session = authService.getSession();
      const pathname = location?.pathname ?? '';

      // If authenticated, redirect to home
      if (session?.accessToken) {
        navigate('/');
        return;
      }

      // allow unauthenticated users to access register and login pages
      const allowedGuestPaths = ['/register', '/login'];
      if (!allowedGuestPaths.includes(pathname)) {
        navigate('/login');
      }
    } catch (e) {
      // on error, allow register/login
    }
  }, [location, navigate]);

  return <>{children}</>;
}
