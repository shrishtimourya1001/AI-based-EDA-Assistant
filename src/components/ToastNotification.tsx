import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info';
  title: string;
  description?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#181B1D] text-white p-3 rounded-lg border border-slate-700 shadow-xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-[12px] font-medium text-slate-100 leading-tight">
                {toast.title}
              </p>
              {toast.description && (
                <p className="font-mono text-[10.5px] text-slate-400 mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
