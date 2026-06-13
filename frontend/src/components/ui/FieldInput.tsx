import type { InputHTMLAttributes } from 'react';

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FieldInput({ label, error, ...props }: FieldInputProps) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#8b949e',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          display: 'block',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: 13,
          borderRadius: 8,
          border: `1px solid ${error ? '#f85149' : '#30363d'}`,
          background: '#0d1117',
          color: '#e6edf3',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = error ? '#f85149' : '#1f6feb';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? '#f85149' : '#30363d';
        }}
      />
      {error && (
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f85149' }}>{error}</p>
      )}
    </div>
  );
}