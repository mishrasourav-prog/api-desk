import { useState } from 'react';
import type { AuthView } from './types/auth';
import { useEndpoints } from './hooks/useEndpoints';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmailSentPage from './pages/auth/EmailSentPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ErrorPage from './pages/ErrorPage';
import MaintenancePage from './pages/MaintenancePage';

import Navbar from './components/shared/Navbar';
import Dashboard from './pages/Dashboard';
import DeckDesigner from './pages/DeckDesigner';
import type { DeckCardData, HttpMethod, HttpStatus } from './types/deck';

type AppView = AuthView | 'app-dashboard' | 'app-designer' | 'error-404' | 'error-500' | 'maintenance';

export default function App() {
  const [view, setView] = useState<AppView>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { endpoints, selectedEndpoint, selectEndpoint, addEndpoint, deleteEndpoint, clearStorage } = useEndpoints();

  function navigate(v: AppView) { setView(v); }

  function handleLoginSuccess() { setIsAuthenticated(true); setView('app-dashboard'); }
  function handleLogout() { setIsAuthenticated(false); clearStorage(); setView('login'); }
  function handleRegisterSuccess(email: string) { setPendingEmail(email); setView('verify-email'); }
  function handleEmailSent(email: string) { setPendingEmail(email); setView('email-sent'); }
  function handleVerified() { setIsAuthenticated(true); setView('app-dashboard'); }

  function handleSave(path: string, method: HttpMethod, status: HttpStatus, body: string, desc: string) {
    addEndpoint(path, method, status, body, desc);
    setView('app-dashboard');
    selectEndpoint(null);
  }

  function handleOpenEndpoint(card: DeckCardData) {
    selectEndpoint(card);
    setView('app-designer');
  }

  if (!isAuthenticated) {
    switch (view) {
      case 'login':          return <LoginPage onNavigate={v => navigate(v as AppView)} onLoginSuccess={handleLoginSuccess} />;
      case 'register':       return <RegisterPage onNavigate={v => navigate(v as AppView)} onRegisterSuccess={handleRegisterSuccess} />;
      case 'forgot-password':return <ForgotPasswordPage onNavigate={v => navigate(v as AppView)} onEmailSent={handleEmailSent} />;
      case 'reset-password': return <ResetPasswordPage onNavigate={v => navigate(v as AppView)} />;
      case 'email-sent':     return <EmailSentPage email={pendingEmail} onNavigate={v => navigate(v as AppView)} />;
      case 'verify-email':   return <VerifyEmailPage email={pendingEmail} onNavigate={v => navigate(v as AppView)} onVerified={handleVerified} />;
      case 'error-404':      return <ErrorPage code={404} onGoHome={() => navigate('login')} onGoBack={() => navigate('login')} />;
      case 'error-500':      return <ErrorPage code={500} onGoHome={() => navigate('login')} onGoBack={() => navigate('login')} />;
      case 'maintenance':    return <MaintenancePage />;
      default:               return <LoginPage onNavigate={v => navigate(v as AppView)} onLoginSuccess={handleLoginSuccess} />;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] overflow-hidden">
      <Navbar onLogout={handleLogout} />
      <div className="flex items-center gap-1 px-6 border-b border-[#30363d] bg-[#0d1117] shrink-0">
        <button onClick={() => { setView('app-dashboard'); selectEndpoint(null); }} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${view==='app-dashboard'?'border-[#f78166] text-[#f0f6fc]':'border-transparent text-[#6e7681] hover:text-[#8b949e]'}`}>📊 Dashboard</button>
        <button onClick={() => setView('app-designer')} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${view==='app-designer'?'border-[#f78166] text-[#f0f6fc]':'border-transparent text-[#6e7681] hover:text-[#8b949e]'}`}>🛠️ Designer</button>
      </div>
      <main className="flex-1 min-h-0 overflow-hidden">
        {view === 'app-dashboard'
          ? <Dashboard endpoints={endpoints} onCreateNew={() => { selectEndpoint(null); setView('app-designer'); }} onOpenEndpoint={handleOpenEndpoint} onDeleteEndpoint={deleteEndpoint} />
          : <DeckDesigner editingEndpoint={selectedEndpoint} onSave={handleSave} onCancel={() => setView('app-dashboard')} />
        }
      </main>
    </div>
  );
}