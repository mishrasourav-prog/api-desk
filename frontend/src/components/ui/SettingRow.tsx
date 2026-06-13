import type { ReactNode } from 'react';

interface SettingRowProps {
  icon: string;
  label: string;
  description?: string;
  right: ReactNode;
  onClick?: () => void;
  isLast?: boolean;
}

export default function SettingRow({ icon, label, description, right, onClick, isLast }: SettingRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: isLast ? 'none' : '1px solid #21262d',
        gap: 12,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: '#21262d',
            border: '1px solid #30363d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className={`ti ti-${icon}`} style={{ fontSize: 16, color: '#8b949e' }} aria-hidden="true" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#e6edf3' }}>{label}</p>
          {description && (
            <p style={{ margin: 0, fontSize: 11, color: '#8b949e', marginTop: 2, lineHeight: 1.4 }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}