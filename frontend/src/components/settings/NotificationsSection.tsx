import SettingsCard from '../ui/SettingsCard';
import SettingRow from '../ui/SettingRow';
import SectionHeader from '../ui/SectionHeader';
import Toggle from '../ui/Toggle';
import type { NotificationSettings } from '../../types';

interface NotificationsSectionProps {
  notifs: NotificationSettings;
  onUpdate: (key: keyof NotificationSettings, value: boolean) => void;
}

export default function NotificationsSection({ notifs, onUpdate }: NotificationsSectionProps) {
  return (
    <>
      <SectionHeader title="Notifications" />
      <SettingsCard>
        <SettingRow
          icon="mail"
          label="Email notifications"
          description="Receive updates and alerts via email"
          right={<Toggle checked={notifs.email} onChange={v => onUpdate('email', v)} ariaLabel="Email notifications" />}
        />
        <SettingRow
          icon="bell"
          label="Push notifications"
          description="Get notified on your device"
          right={<Toggle checked={notifs.push} onChange={v => onUpdate('push', v)} ariaLabel="Push notifications" />}
        />
        <SettingRow
          icon="speakerphone"
          label="Marketing emails"
          description="News, tips and product updates"
          isLast
          right={<Toggle checked={notifs.marketing} onChange={v => onUpdate('marketing', v)} ariaLabel="Marketing emails" />}
        />
      </SettingsCard>
    </>
  );
}