import { useState} from 'react';
import type {FormEvent} from 'react';
import { isValidEmail, getPasswordStrength } from '../../types/auth.ts';
import AuthCard from '../../components/auth/AuthCard';
import AuthBrand from '../../components/auth/AuthBrand';
import AuthInput from '../../components/auth/AuthInput';
import AuthDivider from '../../components/auth/AuthDivider';
import OAuthButtons from '../../components/auth/OAuthButtons';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import api from "../../config/axiosInstance.Config.ts";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Invalid email';
    if (!form.username) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'At least 3 characters';
    if (!form.password) e.password = 'Password is required';
    else if (getPasswordStrength(form.password).score < 2) e.password = 'Password is too weak';
    if (!form.agreed) e.agreed = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);
    setErrors({});

    const response = await api.post("/auth/register", {
      name: `${form.firstName} ${form.lastName}`,
      
      email: form.email,
      username: form.username,
      password: form.password,
    });

    console.log(response.data);

    navigate("/login");

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      setErrors({
        form: error.response?.data?.message || "Registration failed",
      });
    } else {
      setErrors({
        form: "Something went wrong",
      });
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <AuthCard>
      <AuthBrand title="Create your account" subtitle="Join thousands of developers on API-Deck" />

      <OAuthButtons label="Sign up" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8b949e] font-medium">First name</label>
            <AuthInput icon="user" type="text" placeholder="Alan" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8b949e] font-medium">Last name</label>
            <AuthInput icon="user" type="text" placeholder="Turing" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Work email</label>
          <AuthInput icon="mail" type="email" placeholder="alan@company.io" value={form.email} onChange={set('email')} error={errors.email} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Username</label>
          <AuthInput icon="at" type="text" placeholder="alan_turing" value={form.username} onChange={set('username')} error={errors.username} hint="This becomes your mock URL namespace: api-deck.com/api/mock/username/" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#8b949e] font-medium">Password</label>
          <AuthInput icon="lock" type="password" placeholder="Create a strong password" value={form.password} onChange={set('password')} hasToggle error={errors.password} />
          <PasswordStrengthMeter password={form.password} />
        </div>

        <label className="flex items-start gap-2 cursor-pointer mt-1">
          <input type="checkbox" checked={form.agreed} onChange={set('agreed')} className="accent-[#1f6feb] mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-[#6e7681] leading-relaxed">
            I agree to the <button type="button" className="text-[#58a6ff] hover:underline">Terms of Service</button> and{' '}
            <button type="button" className="text-[#58a6ff] hover:underline">Privacy Policy</button>.
            API-Deck may send product updates.
          </span>
        </label>
        {errors.agreed && <p className="text-[10px] text-[#f85149]">{errors.agreed}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-md transition-colors mt-1"
        >
          {loading ? 'Creating account...' : 'Create free account'}
        </button>
      </form>

      <p className="text-center text-[11px] text-[#6e7681] mt-4">
        Already have an account?{' '}
        <button onClick={()=>{navigate("/login")}} className="text-[#58a6ff] hover:underline">Sign in</button>
      </p>
    </AuthCard>
  );
}