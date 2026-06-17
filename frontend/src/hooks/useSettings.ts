import { useState , useEffect } from 'react';
import type { User, NotificationSettings, PrivacySettings, ThemeOption, AppPage } from '../types';
import api from '../config/axiosInstance.Config';

export function useSettings() {
  const [page, setPage] = useState<AppPage>('settings');
  const [notifs, setNotifs] = useState<NotificationSettings>({ email: true, push: false, marketing: true });
  const [privacy, setPrivacy] = useState<PrivacySettings>({ publicProfile: true, activityStatus: true });
  const [theme, setTheme] = useState<ThemeOption>('system');
  const [userData, setUserData] = useState<User>({
  name: '',
  email: '',
  username: '',
  
});

useEffect(() => {
  async function fetchUser() {
    try {
      const response = await api.get('/user/me');

      setUserData({
        name: response.data.data.name,
        email: response.data.data.email,
        username: response.data.data.username
          .split(' ')
          .map((word: string) => word[0])
          .join('')
          .toUpperCase(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  fetchUser();
}, []);



  function updateUser(updated: User) {
    setUserData(updated);
  }

  function updateNotif(key: keyof NotificationSettings, value: boolean) {
    setNotifs(prev => ({ ...prev, [key]: value }));
  }

  function updatePrivacy(key: keyof PrivacySettings, value: boolean) {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  }

  return {
    page, setPage,
    userData, updateUser,
    notifs, updateNotif,
    privacy, updatePrivacy,
    theme, setTheme,
  };
}