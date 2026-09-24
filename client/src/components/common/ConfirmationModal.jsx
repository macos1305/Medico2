import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

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
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isDangerous ? '#ffe4e6' : '#fef3c7',
            color: isDangerous ? 'var(--accent-rose)' : 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
