export interface User {
  name: string;
  email: string;

  username: string;

  

}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  publicProfile: boolean;
  activityStatus: boolean;
}

export type ThemeOption = 'light' | 'dark' | 'system';

export type AppPage = 'settings' | 'edit';