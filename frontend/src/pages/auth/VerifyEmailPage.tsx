import { useRef, useState } from 'react';
import type { AuthView } from '../../types/auth.ts';
import AuthCard from '../../components/auth/AuthCard';

interface VerifyEmailPageProps {
  email: string;
  onNavigate: (view: AuthView) => void;
  onVerified: () => void;
}

export default function VerifyEmailPage({ email, onNavigate, onVerified }: VerifyEmailPageProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  }

  async function handleVerify() {
    const full = code.join('');
    if (full.length < 6) { setError('Enter all 6 digits'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onVerified();
  }

  return (
    <AuthCard>
      <div className="w-14 h-14 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/30 flex items-center justify-center mx-auto mb-4">
        <i className="ti ti-mail text-[#58a6ff] text-2xl" aria-hidden="true" />
      </div>

      <div className="text-center mb-5">
        <p className="text-[15px] font-semibold text-[#f0f6fc] mb-2">Verify your email</p>
        <p className="text-[11px] text-[#8b949e] leading-relaxed">
          We sent a 6-digit code to<br />
          <span className="text-[#c9d1d9] font-medium">{email}</span>
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-10 h-11 text-center font-mono font-bold text-lg bg-[#0d1117] border border-[#30363d] rounded-md text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]/20 transition-colors"
          />
        ))}
      </div>

      {error && <p className="text-[11px] text-[#f85149] text-center mb-3">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-md transition-colors"
      >
        {loading ? 'Verifying...' : 'Verify email'}
      </button>

      <p className="text-center text-[11px] text-[#6e7681] mt-4">
        Didn't receive it?{' '}
        <button className="text-[#58a6ff] hover:underline">Resend code</button>
      </p>
    </AuthCard>
  );
}