import { useState, useEffect } from 'react';
import type { AuthView } from '../../types/auth';
import AuthCard from '../../components/auth/AuthCard';

interface EmailSentPageProps {
  email: string;
  onNavigate: (view: AuthView) => void;
}

export default function EmailSentPage({ email, onNavigate }: EmailSentPageProps) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); setCanResend(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function handleResend() {
    setCountdown(60);
    setCanResend(false);
  }

  return (
    <AuthCard>
      <div className="w-14 h-14 rounded-full bg-[#238636]/15 border border-[#238636]/40 flex items-center justify-center mx-auto mb-4">
        <i className="ti ti-mail-check text-[#3fb950] text-2xl" aria-hidden="true" />
      </div>

      <div className="text-center mb-5">
        <p className="text-[15px] font-semibold text-[#f0f6fc] mb-2">Check your inbox</p>
        <p className="text-[11px] text-[#8b949e] leading-relaxed">
          We sent a password reset link to<br />
          <span className="text-[#c9d1d9] font-medium">{email}</span><br />
          The link expires in 15 minutes.
        </p>
      </div>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 mb-4">
        <p className="text-[10px] text-[#6e7681] uppercase tracking-widest font-semibold mb-2">Didn't receive it?</p>
        <p className="text-[11px] text-[#8b949e] leading-relaxed">Check spam or junk folders. You can resend after the countdown or try a different email address.</p>
      </div>

      <button
        onClick={handleResend}
        disabled={!canResend}
        className="w-full bg-transparent border border-[#30363d] hover:bg-[#21262d] disabled:opacity-50 disabled:cursor-not-allowed text-[#8b949e] text-xs font-medium py-2.5 rounded-md transition-colors"
      >
        {canResend ? 'Resend email' : `Resend in ${countdown}s`}
      </button>

      <div className="text-center mt-4">
        <button onClick={() => onNavigate('login')} className="text-[#58a6ff] hover:underline text-[11px] flex items-center gap-1 mx-auto">
          <i className="ti ti-arrow-left text-xs" aria-hidden="true" /> Back to sign in
        </button>
      </div>
    </AuthCard>
  );
}