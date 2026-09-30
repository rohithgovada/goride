import React, { useEffect } from 'react';
import { Bell, X, PhoneCall, CheckCircle2, Bike } from 'lucide-react';
import { TransitNotification } from '../types/transit';

interface ToastNotificationProps {
  notification: TransitNotification | null;
  onClose: () => void;
  onClick: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div 
      onClick={onClick}
      className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 cursor-pointer hover:border-emerald-400 group"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
          {notification.type === 'bike' ? (
            <Bike className="h-5 w-5 text-amber-400 animate-pulse" />
          ) : (
            <Bell className="h-5 w-5 text-emerald-400 animate-bounce" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
              {notification.title}
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">{notification.time}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
