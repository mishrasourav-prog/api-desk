import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoutes';

import Navbar from '../components/shared/Navbar';
import Dashboard from '../pages/Dashboard';
import DeckDesigner from '../pages/DeckDesigner';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import EmailSentPage from '../pages/auth/EmailSentPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import MaintenancePage from '../pages/MaintenancePage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] overflow-hidden">
      <Navbar/>
      {children}
    </div>
  );
}

export default function AppRoutes() {
  const { pendingEmail } = useAuth();

  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/email-sent" element={<EmailSentPage email={pendingEmail} />} />
      <Route path="/verify-email" element={<VerifyEmailPage email={pendingEmail} />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/app/designer" element={<DeckDesigner />} />
      <Route path="/app/designer/:id" element={<DeckDesigner />} />
      


      {/* PROTECTED */}
      <Route
        path="/app/dashboard"
        element={
              <ProtectedRoute>
           <AppLayout>
             <Dashboard />
           </AppLayout>
        </ProtectedRoute>
            
        }
      />
      <Route
        path="/app/designer"
        element={
        <ProtectedRoute>
           <AppLayout>
             <DeckDesigner />
           </AppLayout>
        </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to={'/app/dashboard'} />} />
    </Routes>
  );
}