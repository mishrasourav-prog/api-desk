import { useState } from 'react';
import ProfileCard from '../components/settings/ProfileCard';
import AccountSection from '../components/settings/AccountSection';
import ChangePasswordDialog from '../components/settings/ChangePasswordDialog';
import DeleteDialog from '../checklist/DeleteDialog';

import { deleteAccount } from '../services/userService';
import { useAuth } from '../context/AuthContext';



export default function SettingsPage() {
  const [showDelete, setShowDelete] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);


  const { onLogout } = useAuth();

  const {
  user,
} = useAuth();

if (!user) {
  return <div>Loading...</div>;
}

 console.log(user);
 

  return (
    <>
      {showDelete && (
        <DeleteDialog
          userName={user!.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={async () => {
            try {
              await deleteAccount();

              setShowDelete(false);

               onLogout();
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}

      {showChangePw && (
        <ChangePasswordDialog
          onCancel={() => setShowChangePw(false)}
        />
      )}

      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          padding: '0 0 40px',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px',
            fontSize: 16,
            fontWeight: 600,
            color: '#f0f6fc',
          }}
        >
          Settings
        </h2>
       

        <ProfileCard
          user={user!}
        />

        <AccountSection
          onDeleteAccount={() => setShowDelete(true)}
        />
      </div>
    </>
  );
}