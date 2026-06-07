import { useState } from 'react';
import type {InputHTMLAttributes} from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  hasToggle?: boolean;
  error?: string;
  hint?: string;
}

export default function AuthInput({ icon, hasToggle, error, hint, className, ...props }: AuthInputProps) {
  const [visible, setVisible] = useState(false);
  const type = hasToggle ? (visible ? 'text' : 'password') : props.type;

  return (
    <div>
      <div className="relative">
        <i className={`ti ti-${icon} absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681] text-sm pointer-events-none`} aria-hidden="true" />
        <input
          {...props}
          type={type}
          className={`w-full bg-[#0d1117] border rounded-md pl-9 pr-${hasToggle ? '9' : '3'} py-2 text-xs text-[#c9d1d9] placeholder-[#6e7681] outline-none transition-colors ${
            error
              ? 'border-[#f85149] focus:border-[#f85149] focus:ring-1 focus:ring-[#f85149]/30'
              : 'border-[#30363d] focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]/20'
          } ${className ?? ''}`}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7681] hover:text-[#8b949e] transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <i className={`ti ti-${visible ? 'eye-off' : 'eye'} text-sm`} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1 text-[10px] text-[#f85149]">
          <i className="ti ti-alert-circle text-xs" aria-hidden="true" /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1 text-[10px] text-[#6e7681]">{hint}</p>}
    </div>
  );
}