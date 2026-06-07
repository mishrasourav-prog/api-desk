import { useState } from 'react';
import type {FormEvent} from 'react';
import type { AuthView } from '../../types/auth';
import {isValidEmail} from '../../types/auth';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';

interface ForgotPasswordPageProps {
  onNavigate: (view: AuthView) => void;
  onEmailSent: (email: string) => void;
}

export default function ForgotPasswordPage({ onNavigate, onEmailSent }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    onEmailSent(email);
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center mb-6 gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1f6feb]/10 border border-[#1f6feb]/30 flex items-center justify-center">
          <i className="ti ti-lock text-[#58a6ff] text-xl" aria-hidden="true" />
        </div>
        <p className="font-mono font-bold text-[15px] text-[#f0f6fc]">Forgot your password?</p>
        <p className="text-[11px] text-[#6e7681] text-center leading-relaxed">Enter your email and we'll send a reset link to your inbox</p>
      </div>

      <div className="flex items-start gap-2 bg-[#d29922]/10 border border-[#d29922]/30 rounded-md px-3 py-2 mb-4">
        <i className="ti ti-shield-lock text-[#d29922] text-sm flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[10px] text-[#d29922] leading-relaxed">Reset links expire after 15 minutes for your security.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Email address</label>
          <AuthInput
            icon="mail" type="email" placeholder="arjun@devhq.io"
            value={email} onChange={e => setEmail(e.target.value)}
            error={error}
            hint="Enter the email linked to your API-Deck account"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-md transition-colors"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button onClick={() => onNavigate('login')} className="text-[#58a6ff] hover:underline text-[11px] flex items-center gap-1 mx-auto">
          <i className="ti ti-arrow-left text-xs" aria-hidden="true" /> Back to sign in
        </button>
      </div>
    </AuthCard>
  );
}