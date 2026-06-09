/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState , useEffect} from 'react';
import type { ReactNode} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axiosInstance.Config';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string;
  onLoginSuccess: () => void;
  onRegisterSuccess: (email: string) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/app/dashboard');
  };

  const onRegisterSuccess = (email: string) => {
    setPendingEmail(email);
    navigate('/email-sent');
  };

  const onLogout = async() => {
    await api.post(
    "/auth/logout",
    {},
    { withCredentials: true }
  );
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    navigate('/login');
  };

  useEffect(() => {
  const checkAuth = async () => {
    try {
      await api.get("/user/me");

      setIsAuthenticated(true);
      
    } catch {
      try{
        await api.post("/auth/refresh");
        await api.get("/user/me");
      setIsAuthenticated(true);


      }catch{
        setIsAuthenticated(false);
        

      }
    } 
    finally{
      setIsLoading(false);
    }
  };

  checkAuth();
}, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, pendingEmail, onLoginSuccess, onRegisterSuccess, onLogout , isLoading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};