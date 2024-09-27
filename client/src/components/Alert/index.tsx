import React, { useEffect } from 'react';
import { AlertProps, AlertTypeClasses } from './types';

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const alertTypeClasses: AlertTypeClasses = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
    </div>
  );
};
export default Alert;
