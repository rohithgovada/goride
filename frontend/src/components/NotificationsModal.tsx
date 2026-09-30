import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Bike, 
  AlertTriangle, 
  Wallet, 
  Navigation,
  Trash2,
  Sparkles
} from 'lucide-react';
import { TransitNotification } from '../types/transit';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: TransitNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSimulateNewAlert: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSimulateNewAlert,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bike':
        return <Bike className="h-4 w-4 text-amber-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'wallet':
        return <Wallet className="h-4 w-4 text-emerald-400" />;
      default:
        return <Navigation className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Transit Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Live alerts for bikes, metro, buses & safety</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-5 py-2.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onSimulateNewAlert}
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>+ Simulate New Alert</span>
          </button>

          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center space-x-1 text-slate-300 hover:text-white"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Mark Read</span>
              </button>
            )}
            <button
              onClick={onClearAll}
              className="flex items-center space-x-1 text-slate-400 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-sm">You are all caught up! No active alerts.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-slate-800/30 border-slate-800/80 text-slate-400'
                    : 'bg-slate-800/80 border-slate-700/80 shadow-lg text-slate-200 ring-1 ring-emerald-500/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-mono">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-center">
          <p className="text-[11px] text-slate-500">
            Push notifications powered by GoRide Transit Mesh Network
          </p>
        </div>

      </div>
    </div>
  );
};
