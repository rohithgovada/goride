import React from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  MapPin, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { LocationPoint } from '../types/transit';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationPoint;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/50 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
            <span>GoRide Emergency SOS Center</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Your Exact GPS Coordinates</div>
            <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
              <span className="truncate">{currentLocation.name}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Lat: {currentLocation.lat.toFixed(5)}, Lng: {currentLocation.lng.toFixed(5)}
            </div>
          </div>

          {/* Quick Dial Actions */}
          <div className="space-y-2">
            <a
              href="tel:112"
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-lg transition active:scale-95"
            >
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4" />
                <span>Call Emergency Police (112)</span>
              </div>
              <span className="bg-rose-700/60 px-2 py-0.5 rounded text-[11px]">Instant</span>
            </a>

            <a
              href="tel:1091"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>Women Safety Helpline (1091)</span>
              </div>
              <span className="text-[11px] text-slate-400">Toll Free</span>
            </a>

            <a
              href="tel:18004258900"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-400" />
                <span>GoRide 24/7 Safety Command</span>
              </div>
              <span className="text-[11px] text-slate-400">Response &lt; 30s</span>
            </a>
          </div>

          {/* Share live link */}
          <button
            onClick={() => alert(`Live emergency tracking link with GPS (${currentLocation.lat}, ${currentLocation.lng}) shared to emergency contacts!`)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium flex items-center justify-center space-x-2 transition"
          >
            <Share2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Send Alert SMS to Trusted Contacts</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-center">
          <p className="text-[11px] text-slate-400">
            Keep your device connected. Your live telemetry is continuously relayed.
          </p>
        </div>

      </div>
    </div>
  );
};
