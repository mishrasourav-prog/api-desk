import type { ReactNode } from 'react';

interface SettingsCardProps {
  children: ReactNode;
}

export default function SettingsCard({ children }: SettingsCardProps) {
  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 12,
        padding: '0 16px',
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}