import { useState } from 'react';

interface DeleteDialogProps {
  userName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const CONFIRM_WORD = 'DELETE';

export default function DeleteDialog({ userName, onCancel, onConfirm }: DeleteDialogProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmed = input === CONFIRM_WORD;

  async function handleDelete() {
    if (!confirmed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onConfirm();
  }

  const remaining = CONFIRM_WORD.length - input.length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          background: '#161b22',
          border: '1px solid rgba(248,81,73,0.4)',
          borderRadius: 14,
          padding: '24px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        }}>
          <i className="ti ti-trash" style={{ fontSize: 20, color: '#f85149' }} aria-hidden="true" />
        </div>

        {/* Title */}
        <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#f85149' }}>Delete account</p>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8b949e', lineHeight: 1.6 }}>
          This will permanently delete{' '}
          <strong style={{ color: '#e6edf3', fontWeight: 600 }}>{userName}</strong>'s account and all associated data.
          This action cannot be undone.
        </p>

        {/* Warning box */}
        <div style={{
          background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)',
          borderRadius: 8, padding: '10px 12px', marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 11, color: '#f85149', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 13 }} aria-hidden="true" /> This will permanently:
          </p>
          {[
            `Delete account @${userName.toLowerCase().replace(' ', '_')}`,
            'Erase all your data and preferences',
            'Cancel any active subscriptions',
            'Revoke all active sessions and tokens',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
              <i className="ti ti-x" style={{ fontSize: 11, color: '#f85149', marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
              <span style={{ fontSize: 11, color: '#8b949e' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Confirmation input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase',
            letterSpacing: '0.07em', display: 'block', marginBottom: 6,
          }}>
            Type{' '}
            <span style={{
              fontFamily: 'monospace', fontWeight: 700, color: '#f85149',
              background: 'rgba(248,81,73,0.1)', padding: '1px 6px', borderRadius: 3,
            }}>
              {CONFIRM_WORD}
            </span>
            {' '}to confirm
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={CONFIRM_WORD}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%',
              padding: '9px 12px',
              fontSize: 13,
              borderRadius: 8,
              border: `1px solid ${
                input.length === 0 ? '#30363d'
                : confirmed ? '#238636'
                : 'rgba(248,81,73,0.5)'
              }`,
              background: '#0d1117',
              color: confirmed ? '#3fb950' : '#e6edf3',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          />
          {input.length > 0 && !confirmed && (
            <p style={{ margin: '5px 0 0', fontSize: 10, color: '#f85149' }}>
              {remaining} character{remaining !== 1 ? 's' : ''} remaining
            </p>
          )}
          {confirmed && (
            <p style={{ margin: '5px 0 0', fontSize: 10, color: '#3fb950' }}>
              ✓ Confirmed — you may now delete your account
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              border: '1px solid #30363d', background: '#21262d',
              cursor: 'pointer', color: '#c9d1d9', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || loading}
            style={{
              flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              border: 'none',
              cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
              background: confirmed ? '#da3633' : 'rgba(248,81,73,0.2)',
              color: confirmed ? '#fff' : 'rgba(248,81,73,0.5)',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {loading ? (
              <><i className="ti ti-loader-2" style={{ fontSize: 14 }} aria-hidden="true" /> Deleting...</>
            ) : (
              <><i className="ti ti-trash" style={{ fontSize: 14 }} aria-hidden="true" /> Delete account</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}