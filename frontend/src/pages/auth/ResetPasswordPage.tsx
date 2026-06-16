import { useState} from 'react';
import type {FormEvent} from 'react';
import { getPasswordStrength } from '../../types/auth.ts';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axiosInstance.Config.ts';
import { useLocation } from "react-router-dom";



export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  

 
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'One number or symbol', ok: /[0-9!@#$%^&*]/.test(password) },
    { label: 'Passwords match', ok: password.length > 0 && password === confirm },
  ];

  function validate(): boolean {
    const e: typeof errors = {};
    if (!password) e.password = 'Password is required';
    else if (getPasswordStrength(password).score < 2) e.password = 'Choose a stronger password';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const email = location.state?.email;
const otp = location.state?.otp;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    console.log({
  email,
  otp,
  newpassword: password
});
    await api.post("/auth/reset-password", {
  email,
  otp,
  newpassword: password
});
navigate("/login");
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center mb-6 gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#238636]/10 border border-[#238636]/30 flex items-center justify-center">
          <i className="ti ti-key text-[#3fb950] text-xl" aria-hidden="true" />
        </div>
        <p className="font-mono font-bold text-[15px] text-[#f0f6fc]">Set new password</p>
        <p className="text-[11px] text-[#6e7681] text-center">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">New password</label>
          <AuthInput icon="lock" type="password" placeholder="New strong password" value={password} onChange={e => setPassword(e.target.value)} hasToggle error={errors.password} />
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Confirm password</label>
          <AuthInput icon="lock" type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} hasToggle error={errors.confirm} />
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3">
          {checks.map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 py-1">
              <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-[9px] transition-all ${ok ? 'bg-[#238636] border-[#238636] text-white' : 'border-[#30363d]'}`}>
                {ok && <i className="ti ti-check" aria-hidden="true" />}
              </div>
              <span className={`text-[11px] transition-colors ${ok ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>{label}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-md transition-colors"
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button onClick={() => navigate("/login")} className="text-[#58a6ff] hover:underline text-[11px] flex items-center gap-1 mx-auto">
          <i className="ti ti-arrow-left text-xs" aria-hidden="true" /> Back to sign in
        </button>
      </div>
    </AuthCard>
  );
}