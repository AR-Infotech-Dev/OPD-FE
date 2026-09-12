import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentSession, logoutFromLocalAuth } from '@auth/utils/authStorage';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const navigate = useNavigate();
  // Login fetches and stores permissions. Reloads restore the saved session.
  const [authSession, setAuthSession] = useState(getCurrentSession);

  useEffect(() => {
    const handleLogout = () => {
      setAuthSession(null);
      navigate('/login', { replace: true });
    };
    window.addEventListener('crm:auth-logout', handleLogout);
    return () => window.removeEventListener('crm:auth-logout', handleLogout);
  }, [navigate]);

  const value = useMemo(() => ({
    authSession,
    login(session) { setAuthSession(session); },
    logout() { logoutFromLocalAuth(); }
  }), [authSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
