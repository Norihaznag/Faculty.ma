import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps): React.ReactNode {
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = message.type === 'success' ? 'bg-green-50 border-green-200' : 
                  message.type === 'error' ? 'bg-red-50 border-red-200' : 
                  'bg-blue-50 border-blue-200';
  
  const textColor = message.type === 'success' ? 'text-green-800' : 
                    message.type === 'error' ? 'text-red-800' : 
                    'text-blue-800';

  const IconComponent = message.type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} border rounded-lg p-4 flex items-center gap-3 shadow-lg max-w-md z-50`}>
      <IconComponent size={20} className={textColor} />
      <p className={`text-sm font-500 ${textColor}`}>{message.message}</p>
      <button
        onClick={onClose}
        className={`ml-auto ${textColor} hover:opacity-70 transition`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
