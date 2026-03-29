import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      // 애니메이션 완료 후 실제 제거
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return createPortal(
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${isClosing ? 'animate-fade-out' : 'animate-slide-down'}`}
    >
      <div
        className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[90vw]`}
      >
        {icons[type]}
        <span className="flex-1 text-sm font-medium truncate">{message}</span>
        <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}

// Toast Manager
type ToastData = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

let toastList: ToastData[] = [];
let listeners: Array<(toasts: ToastData[]) => void> = [];

const notify = (message: string, type: ToastData['type']) => {
  const id = Date.now().toString();
  toastList = [...toastList, { id, message, type }];
  listeners.forEach((listener) => listener(toastList));
};

export const toast = {
  success: (message: string) => notify(message, 'success'),
  error: (message: string) => notify(message, 'error'),
  info: (message: string) => notify(message, 'info'),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastData[]) => setToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    toastList = toastList.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toastList));
  };

  // 한 번에 하나씩만 표시 (큐 방식)
  const currentToast = toasts[0];

  return (
    <>
      {currentToast && (
        <Toast
          key={currentToast.id}
          message={currentToast.message}
          type={currentToast.type}
          onClose={() => removeToast(currentToast.id)}
        />
      )}
    </>
  );
}
