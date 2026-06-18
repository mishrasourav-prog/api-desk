import { useEffect, useRef } from 'react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  title = 'Delete item',
  description = 'Are you sure you want to delete this? This action cannot be undone.',
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when dialog opens (accessibility)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
  onCancel();
}
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel,loading]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: '#161b22',
          border: '1px solid rgba(248, 81, 73, 0.35)',
          borderRadius: 12,
          padding: '24px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(248, 81, 73, 0.12)',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <i className="ti ti-trash" style={{ fontSize: 18, color: '#f85149' }} aria-hidden="true" />
        </div>

        {/* Title */}
        <p
          id="confirm-delete-title"
          style={{
            margin: '0 0 6px',
            fontSize: 15,
            fontWeight: 600,
            color: '#f0f6fc',
            fontFamily: 'inherit',
          }}
        >
          {title}
        </p>

        {/* Description */}
        <p
          id="confirm-delete-desc"
          style={{
            margin: '0 0 22px',
            fontSize: 13,
            color: '#8b949e',
            lineHeight: 1.6,
            fontFamily: 'inherit',
          }}
        >
          {description}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #30363d',
              background: '#21262d',
              color: '#c9d1d9',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#30363d'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#21262d'; }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: loading ? '#5a1d1d' : '#da3633',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#f85149'; }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? '#5a1d1d' : '#da3633'; }}
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2" style={{ fontSize: 14, animation: 'spin 1s linear infinite' }} aria-hidden="true" />
                Deleting...
              </>
            ) : (
              <>
                <i className="ti ti-trash" style={{ fontSize: 14 }} aria-hidden="true" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}