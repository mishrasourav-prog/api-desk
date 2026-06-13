import SettingsCard from '../ui/SettingsCard';
import SettingRow from '../ui/SettingRow';
import SectionHeader from '../ui/SectionHeader';
import type { ThemeOption } from '../../types';

interface AppearanceSectionProps {
  theme: ThemeOption;
  onThemeChange: (t: ThemeOption) => void;
}

export default function AppearanceSection({ theme, onThemeChange }: AppearanceSectionProps) {
  return (
    <>
      <SectionHeader title="Appearance" />
      <SettingsCard>
        <SettingRow
          icon="palette"
          label="Theme"
          description="Choose your display preference"
          right={
            <select
              value={theme}
              onChange={e => onThemeChange(e.target.value as ThemeOption)}
              style={{
                fontSize: 12,
                padding: '5px 10px',
                borderRadius: 7,
                border: '1px solid #30363d',
                background: '#21262d',
                color: '#c9d1d9',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          }
        />
        <SettingRow
          icon="language"
          label="Language"
          description="English (US)"
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