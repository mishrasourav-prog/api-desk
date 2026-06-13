import SettingsCard from '../ui/SettingsCard';
import SettingRow from '../ui/SettingRow';
import SectionHeader from '../ui/SectionHeader';
import Toggle from '../ui/Toggle';
import type { PrivacySettings } from '../../types';

interface PrivacySectionProps {
  privacy: PrivacySettings;
  onUpdate: (key: keyof PrivacySettings, value: boolean) => void;
  onChangePassword: () => void;
}

export default function PrivacySection({ privacy, onUpdate, onChangePassword }: PrivacySectionProps) {
  return (
    <>
      <SectionHeader title="Privacy & Security" />
      <SettingsCard>
        <SettingRow
          icon="world"
          label="Public profile"
          description="Others can find and view your profile"
          right={<Toggle checked={privacy.publicProfile} onChange={v => onUpdate('publicProfile', v)} ariaLabel="Public profile" />}
        />
        <SettingRow
          icon="activity"
          label="Activity status"
          description="Show when you were last active"
          right={<Toggle checked={privacy.activityStatus} onChange={v => onUpdate('activityStatus', v)} ariaLabel="Activity status" />}
        />
        <SettingRow
          icon="lock"
          label="Change password"
          description="Update your login credentials"
          onClick={onChangePassword}
          isLast
          right={
            <i
              className="ti ti-chevron-right"
              style={{ fontSize: 16, color: '#6e7681' }}
              aria-hidden="true"
            />
          }
        />
      </SettingsCard>
    </>
  );
}