import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';


export default function AuthGuard({ children }: any) {
   const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const session = authService.getSession();
      if (!session?.accessToken || !session?.user) {
        navigate('/login');
      } else {
        setChecked(true);
      }
    } catch {
      navigate('/login');
    }
  }, []);

  if (!checked) return null; // Optionally show a loader here

  return <>{children}</>;
}
