export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
  token: string;
}

export type AuthView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'email-sent'
  | 'verify-email'
  | 'dashboard';

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9!@#$%^&*]/.test(password)) score++;
  const map: Record<number, Omit<PasswordStrength, 'score'>> = {
    0: { label: '', color: '#30363d' },
    1: { label: 'Weak', color: '#f85149' },
    2: { label: 'Fair', color: '#d29922' },
    3: { label: 'Good', color: '#d29922' },
    4: { label: 'Strong', color: '#3fb950' },
  };
  return { score: score as PasswordStrength['score'], ...map[score] };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}