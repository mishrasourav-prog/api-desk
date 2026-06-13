import SettingsCard from '../ui/SettingsCard';
// import SettingRow from '../ui/SettingRow';
import SectionHeader from '../ui/SectionHeader';

interface AccountSectionProps {
  onDeleteAccount: () => void;
}

export default function AccountSection({ onDeleteAccount }: AccountSectionProps) {
  return (
    <>
      <SectionHeader title="Account" />
      <SettingsCard>
        {/* <SettingRow
          icon="download"
          label="Export data"
          description="Download a copy of your data"
          right={
            <i
              className="ti ti-chevron-right"
              style={{ fontSize: 16, color: '#6e7681' }}
              aria-hidden="true"
            />
          }
        /> */}
        {/* <SettingRow
          icon="shield"
          label="Two-factor authentication"
          description="Add an extra layer of security"
          right={
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 20,
                background: 'rgba(210,153,34,0.15)',
                color: '#d29922',
                border: '1px solid rgba(210,153,34,0.3)',
                letterSpacing: '0.04em',
              }}
            >
              OFF
            </span>
          }
        /> */}
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