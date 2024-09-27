export type AlertType = 'success' | 'error' | 'info' | 'warning';

export type AlertProps = {
  message: string;
  type: AlertType
  onClose?: () => void;
}

export type AlertTypeClasses = {
  [key in AlertType]: string;
} 