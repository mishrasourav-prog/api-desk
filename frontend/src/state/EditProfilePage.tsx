import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import FieldInput from '../components/ui/FieldInput';
import { useAuth } from '../context/AuthContext';
import api from '../config/axiosInstance.Config';
import axios from 'axios';

const FIELDS: { label: string; key: keyof User; type: string }[] = [
  { label: 'Full name', key: 'name', type: 'text' },
  { label: 'Username', key: 'username', type: 'text' },
  { label: 'Email address', key: 'email', type: 'email' },
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState<User>({ ...user! });
  const [saved, setSaved] = useState(false);

  function set(key: keyof User) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

async function handleSave() {
  try {
    await api.patch("/user/edit", {
      name: form.name,
      username: form.username,
      email: form.email,
    });

    setUser(form); 

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
      navigate('/app/settings');
    }, 800);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message);
    } else {
      console.error("Something went wrong");
    }
  }
}
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => navigate('/app/settings')}
          style={{
            background: '#21262d',
            border: '1px solid #30363d',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            color: '#8b949e',
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: 16 }} />
        </button>

        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#f0f6fc' }}>
          Edit profile
        </h2>
      </div>

      {/* Fields */}
      <div
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginBottom: 16,
        }}
      >
        {FIELDS.map(({ label, key, type }) => (
          <FieldInput
            key={key}
            label={label}
            type={type}
            value={form[key] as string}
            onChange={set(key)}
          />
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => navigate('/app/settings')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid #30363d',
            background: '#21262d',
            cursor: 'pointer',
            color: '#c9d1d9',
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            background: saved ? '#1a4731' : '#238636',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}