import { useState } from 'react';
import type {FormEvent} from 'react';
import type { AuthView } from '../../types/auth.ts';
import {isValidEmail} from '../../types/auth.ts';
import AuthCard from '../../components/auth/AuthCard';
import AuthBrand from '../../components/auth/AuthBrand';
import AuthInput from '../../components/auth/AuthInput';
import AuthDivider from '../../components/auth/AuthDivider';
import OAuthButtons from '../../components/auth/OAuthButtons';

interface LoginPageProps {
  onNavigate: (view: AuthView) => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(onLoginSuccess, 800);
  }

  return (
    <AuthCard>
      <AuthBrand title="API-Deck" subtitle="Sign in to your developer workspace" />

      {success && (
        <div className="flex items-center gap-2 bg-[#238636]/10 border border-[#238636]/30 rounded-md px-3 py-2 mb-4 text-[11px] text-[#3fb950]">
          <i className="ti ti-circle-check text-sm" aria-hidden="true" />
          Welcome back! Redirecting...
        </div>
      )}

      {errors.form && (
        <div className="flex items-center gap-2 bg-[#f85149]/10 border border-[#f85149]/30 rounded-md px-3 py-2 mb-4 text-[11px] text-[#f85149]">
          <i className="ti ti-alert-circle text-sm" aria-hidden="true" />
          {errors.form}
        </div>
      )}

      <OAuthButtons label="Sign in" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Email address</label>
          <AuthInput
            icon="mail" type="email" placeholder="arjun@devhq.io"
            value={email} onChange={e => setEmail(e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Password</label>
          <AuthInput
            icon="lock" type="password" placeholder="Your password"
            value={password} onChange={e => setPassword(e.target.value)}
            hasToggle error={errors.password}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 text-[11px] text-[#8b949e] cursor-pointer">
            <input
              type="checkbox" checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="accent-[#1f6feb]"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-[11px] text-[#58a6ff] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-md transition-colors mt-1"
        >
          {loading ? 'Signing in...' : 'Sign in to API-Deck'}
        </button>
      </form>

      <p className="text-center text-[11px] text-[#6e7681] mt-4">
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className="text-[#58a6ff] hover:underline">
          Create one free
        </button>
      </p>
    </AuthCard>
  );
}