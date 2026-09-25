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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 6, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="glass-card glass-modal"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '20px',
          background: 'rgba(18, 20, 29, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isDangerous
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.2)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2)',
          color: '#ffffff',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: isDangerous ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isDangerous ? '#f87171' : '#fbbf24',
                border: isDangerous ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isDangerous ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <h3 id="confirm-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close dialog"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem' }}>
          {typeof message === 'string' ? (
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.925rem', lineHeight: 1.7, margin: 0 }}>
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
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
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
