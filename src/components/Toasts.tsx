import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let bg = 'bg-stone-900 text-white border-stone-700';
        let Icon = Info;
        if (toast.type === 'success') {
          bg = 'bg-emerald-900 text-emerald-50 border-emerald-600 shadow-emerald-950/20';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900 text-amber-50 border-amber-600 shadow-amber-950/20';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in slide-in-from-top-2 duration-200 ${bg}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-300" />
            <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-300 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
