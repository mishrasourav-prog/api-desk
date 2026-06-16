import { useState } from 'react';
import api from '../../config/axiosInstance.Config';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface ChangePasswordDialogProps {
  onCancel: () => void;
}

interface FormState {
  current: string;
  next: string;
  confirm: string;
}

interface FormErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

// Reusable Styles moved outside of components
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#8b949e',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  display: 'block',
  marginBottom: 6,
};

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '9px 38px 9px 12px',
  fontSize: 13,
  borderRadius: 8,
  border: `1px solid ${hasError ? '#f85149' : '#30363d'}`,
  background: '#0d1117',
  color: '#e6edf3',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
});

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '#30363d' },
    1: { label: 'Weak', color: '#f85149' },
    2: { label: 'Fair', color: '#d29922' },
    3: { label: 'Good', color: '#d29922' },
    4: { label: 'Strong', color: '#3fb950' },
  };
  return { score, ...map[score] };
}

// ✅ FIX: Moved PasswordField component completely outside of the parent component render scope
function PasswordField({
  label, value, onChange, error, show, onToggle, placeholder,
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; show: boolean; onToggle: () => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle(!!error)}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#6e7681',
          }}
        >
          <i className={`ti ti-${show ? 'eye-off' : 'eye'}`} style={{ fontSize: 15 }} aria-hidden="true" />
        </button>
      </div>
      {error && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f85149' }}>{error}</p>}
    </div>
  );
}

export default function ChangePasswordDialog({ onCancel }: ChangePasswordDialogProps) {
  const [form, setForm] = useState<FormState>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(form.next);

  const { onLogout } = useAuth();
const [serverError, setServerError] = useState('');

  function set(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.current) e.current = 'Current password is required';
    if (!form.next) e.next = 'New password is required';
    else if (form.next.length < 8) e.next = 'Must be at least 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.next !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
  if (!validate()) return;

  try {
    setLoading(true);
    setServerError('');

    await api.put('/auth/change-password', {
      currpassword: form.current,
      newpassword: form.next,
    });

    setSuccess(true);

    setTimeout(async () => {
       onLogout();
    }, 1500);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      setServerError(
        error.response?.data?.message || 'Unable to update password'
      );
    } else {
      setServerError('Something went wrong');
    }
  } finally {
    setLoading(false);
  }
}
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 14,
          padding: '24px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'rgba(31,111,235,0.15)', border: '1px solid rgba(31,111,235,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-lock" style={{ fontSize: 17, color: '#58a6ff' }} aria-hidden="true" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f0f6fc' }}>Change password</p>
              <p style={{ margin: 0, fontSize: 11, color: '#8b949e', marginTop: 2 }}>Enter current password to set a new one</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6e7681', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}
          >
            <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(35,134,54,0.15)', border: '1px solid rgba(35,134,54,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <i className="ti ti-circle-check" style={{ fontSize: 24, color: '#3fb950' }} aria-hidden="true" />
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f0f6fc' }}>Password updated!</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8b949e' }}>Your password has been changed successfully.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PasswordField
              label="Current password"
              value={form.current}
              onChange={set('current')}
              error={errors.current}
              show={showCurrent}
              onToggle={() => setShowCurrent(v => !v)}
              placeholder="Enter current password"
            />

            <div>
              <PasswordField
                label="New password"
                value={form.next}
                onChange={set('next')}
                error={errors.next}
                show={showNext}
                onToggle={() => setShowNext(v => !v)}
                placeholder="At least 8 characters"
              />
              {form.next && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 3, borderRadius: 2,
                          background: i < strength.score ? strength.color : '#30363d',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p style={{ margin: 0, fontSize: 10, color: strength.color }}>{strength.label}</p>
                  )}
                </div>
              )}
            </div>

            <PasswordField
              label="Confirm new password"
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              show={showConfirm}
              onToggle={() => setShowConfirm(v => !v)}
              placeholder="Repeat new password"
            />

            {/* Password requirements */}
            <div style={{
              background: '#0d1117', border: '1px solid #30363d',
              borderRadius: 8, padding: '10px 12px',
            }}>
              {[
                { label: 'At least 8 characters', ok: form.next.length >= 8 },
                { label: 'One uppercase letter', ok: /[A-Z]/.test(form.next) },
                { label: 'One number or symbol', ok: /[0-9!@#$%^&*]/.test(form.next) },
                { label: 'Passwords match', ok: form.next.length > 0 && form.next === form.confirm },
              ].map(({ label, ok }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: ok ? '#238636' : 'transparent',
                    border: `1px solid ${ok ? '#238636' : '#30363d'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {ok && <i className="ti ti-check" style={{ fontSize: 9, color: '#fff' }} aria-hidden="true" />}
                  </div>
                  <span style={{ fontSize: 11, color: ok ? '#3fb950' : '#8b949e', transition: 'color 0.2s' }}>{label}</span>
                </div>
              ))}
            </div>
            {serverError && (
         <p
    style={{
      color: '#f85149',
      fontSize: 12,
      margin: 0,
    }}
  >
    {serverError}
  </p>
)}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid #21262d' }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1, padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: '1px solid #30363d', background: '#21262d', cursor: 'pointer',
                  color: '#c9d1d9', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1, padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: 'none', background: loading ? '#1a4731' : '#238636',
                  color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Update password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}