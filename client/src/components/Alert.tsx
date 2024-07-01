// src/Alert.tsx
import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const alertTypeClasses = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`alert ${alertTypeClasses[type]} fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50 shadow-lg`}
      role="alert"
    >
      <div className="flex-1">
        <label>{message}</label>
      </div>
      <button className="btn btn-sm btn-ghost" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};
export default Alert;
