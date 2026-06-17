/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState , useEffect} from 'react';
import type { ReactNode} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axiosInstance.Config';
import type { User } from '../types';


interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  onLoginSuccess: () => Promise<void>;
  onRegisterSuccess: (email: string) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
 
  const onLoginSuccess = async () => {
  try {
    const response = await api.get("/user/me");

    setUser(response.data.data);
    setIsAuthenticated(true);

    navigate("/app/dashboard");

  } catch (error) {
    console.error(error);
  }
};

  const onRegisterSuccess = (email: string) => {
    setPendingEmail(email);
    navigate('/email-sent');
  };

  const onLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error(error);
  } finally {
    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  }
};

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await api.get("/user/me");

      setUser(response.data.data);
      setIsAuthenticated(true);

    } catch (error) {
         console.error(error);
      try {
        await api.post("/auth/refresh");

        const response = await api.get("/user/me");

        setUser(response.data.data);
        setIsAuthenticated(true);

      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }

    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, []);


  return (
    <AuthContext.Provider value={{isAuthenticated,
    pendingEmail,
    user,
    setUser,
    onLoginSuccess,
    onRegisterSuccess,
    onLogout,
    isLoading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};