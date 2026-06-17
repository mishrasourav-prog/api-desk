import SettingsCard from '../ui/SettingsCard';
import SectionHeader from '../ui/SectionHeader';

interface AccountSectionProps {
  onDeleteAccount: () => void;
  onChangePassword?: () => void;
}

export default function AccountSection({ onDeleteAccount , onChangePassword,}: AccountSectionProps) {
  return (
    <>
      <SectionHeader title="Account" />
      <SettingsCard>
         {onChangePassword && (
  <div style={{ padding: '13px 0' }}>
    <button
      onClick={onChangePassword}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 500,
        color: '#f85149',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'inherit',
      }}
    >
      <i
        className="ti ti-lock"
        style={{ fontSize: 16 }}
        aria-hidden="true"
      />
      Change Password
    </button>
  </div>
)}
        <div style={{ padding: '13px 0' }}>
          <button
            onClick={onDeleteAccount}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#f85149',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: 16 }} aria-hidden="true" />
            Delete account
          </button>
        </div>
      </SettingsCard>
    </>
  );
}