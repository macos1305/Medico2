import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { GlassButton, SecondaryGlassButton } from './buttons';

const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  loading = false,
  onConfirm,
  onCancel,
  children,
}) => {
  const cancelRef = useRef(null);

  // Focus trap & ESC key
  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="modal-panel modal-panel-sm"
        style={{ padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: isDangerous ? '#fff1f2' : '#fffbeb',
                color: isDangerous ? 'var(--accent-rose)' : 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isDangerous ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <h3 id="confirm-modal-title" className="modal-title" style={{ fontSize: 'var(--text-lg)' }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="modal-close"
            aria-label="Close dialog"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {typeof message === 'string' ? (
            <p style={{ color: 'var(--slate-600)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
              {message}
            </p>
          ) : (
            message
          )}

          {children && (
            <div style={{ marginTop: '1rem' }}>
              {children}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ gap: '0.75rem' }}>
          <SecondaryGlassButton
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </SecondaryGlassButton>
          <GlassButton
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            icon={isDangerous ? <Trash2 size={16} /> : undefined}
          >
            {confirmText}
          </GlassButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
