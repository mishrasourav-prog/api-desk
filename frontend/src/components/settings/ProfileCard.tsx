
import type { User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        

        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#f0f6fc' }}>
            {user.name}
          </p>

          <p style={{ margin: '2px 0 4px', fontSize: 12, color: '#8b949e' }}>
            {user.email}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/app/settings/edit')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 500,
          border: '1px solid #30363d',
          background: '#21262d',
          cursor: 'pointer',
          color: '#c9d1d9',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
        onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
      >
        <i className="ti ti-edit" style={{ fontSize: 14 }} aria-hidden="true" />
        Edit
      </button>
    </div>
  );
}