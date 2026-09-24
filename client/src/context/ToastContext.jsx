import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 5);
      const newToast = { id, title, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => showToast({ title, message, type: 'success' }),
    [showToast]
  );

  const error = useCallback(
    (message, title = 'Error') => showToast({ title, message, type: 'error' }),
    [showToast]
  );

  const warning = useCallback(
    (message, title = 'Warning') => showToast({ title, message, type: 'warning' }),
    [showToast]
  );

  const info = useCallback(
    (message, title = 'Information') => showToast({ title, message, type: 'info' }),
    [showToast]
  );

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-500" color="#10b981" />;
      case 'error':
        return <AlertCircle size={20} className="text-rose-500" color="#f43f5e" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" color="#f59e0b" />;
      default:
        return <Info size={20} className="text-sky-500" color="#0284c7" />;
    }
  };

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, warning, info, removeToast }}
    >
      {children}
      <div className="toast-container" role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ marginTop: '2px' }}>{getIcon(toast.type)}</div>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
