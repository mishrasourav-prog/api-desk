/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState , useEffect} from 'react';
import type { ReactNode} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axiosInstance.Config';
import type { User } from '../types';


// interface AuthContextType {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   pendingEmail: string;
//   onLoginSuccess: () => void;
//   onRegisterSuccess: (email: string) => void;
//   onLogout: () => void;
// }

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  onLoginSuccess: () => void;
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

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/app/dashboard');
  };

  const onRegisterSuccess = (email: string) => {
    setPendingEmail(email);
    navigate('/email-sent');
  };

   const onLogout = async () => {
  await api.post("/auth/logout");

  setUser(null);
  setIsAuthenticated(false);

  navigate("/login");
};

  useEffect(() => {
  const checkAuth = async () => {
    try {
     const response = await api.get("/user/me");
     console.log(response.data);

setUser(response.data.data);
setIsAuthenticated(true);
      
    } catch {
      try{
        await api.post("/auth/refresh");
        const response = await api.get("/user/me");

setUser(response.data.data);
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