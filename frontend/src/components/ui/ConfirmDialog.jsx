import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  showWarningIcon = false,
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            {showWarningIcon && <AlertTriangle className="text-amber-500" size={24} />}
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-foreground">{message}</p>
        </div>
        <div className="p-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input rounded-lg hover:bg-accent font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
