import React, { useState } from 'react';
import { 
  X, 
  Bike, 
  QrCode, 
  BatteryCharging, 
  ShieldCheck, 
  Volume2, 
  Key, 
  MapPin, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  Scan
} from 'lucide-react';
import { BikeRental } from '../types/transit';

interface BikeQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: BikeRental | null;
  onStartBikeRide: (bike: BikeRental) => void;
}

export const BikeQRModal: React.FC<BikeQRModalProps> = ({
  isOpen,
  onClose,
  bike,
  onStartBikeRide,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'scan'>('qr');
  const [hasHelmet, setHasHelmet] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [beepTriggered, setBeepTriggered] = useState(false);

  if (!isOpen || !bike) return null;

  const handleBeep = () => {
    setBeepTriggered(true);
    setTimeout(() => setBeepTriggered(false), 2000);
  };

  const handleUnlockBike = () => {
    if (!hasHelmet) {
      alert('Please confirm you have a safety helmet to proceed.');
      return;
    }
    setIsUnlocked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bike className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>GoRide SmartBike QR Unlock</span>
              </h3>
              <p className="text-xs text-slate-400">Scan or verify code to unlock electric bike</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch: QR code view vs Handlebar Scanner */}
        <div className="flex border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 border-b-2 ${
              activeTab === 'qr'
                ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Bike QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 border-b-2 ${
              activeTab === 'scan'
                ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Scan Handlebar QR</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Bike Overview Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{bike.model}</h4>
                <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{bike.dockName}</span>
                </div>
              </div>
              <button
                onClick={handleBeep}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center space-x-1 transition ${
                  beepTriggered
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-bounce'
                    : 'bg-slate-700/60 hover:bg-slate-700 text-slate-200 border-slate-600'
                }`}
                title="Ring bike horn to locate in dock"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{beepTriggered ? 'Beeping...' : 'Ring Bell'}</span>
              </button>
            </div>

            {/* Battery & Range Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Battery</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1 mt-0.5">
                  <BatteryCharging className="h-3 w-3" />
                  <span>{bike.batteryPercent}%</span>
                </div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Range</div>
                <div className="text-xs font-bold text-white mt-0.5">{bike.rangeKm} km</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Rental Rate</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">₹{bike.pricePerMin}/m</div>
              </div>
            </div>
          </div>

          {/* QR View or Scanner View */}
          {activeTab === 'qr' ? (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 text-center">
              <div className="text-xs text-slate-400 mb-3">
                Scan this QR code using the GoRide station scanner or phone camera
              </div>

              {/* QR Container */}
              <div className="mx-auto w-40 h-40 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="3" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="3" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  
                  <rect x="0" y="70" width="30" height="30" rx="3" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  <circle cx="50" cy="50" r="12" fill="#f59e0b" />
                  <rect x="42" y="20" width="16" height="8" />
                  <rect x="25" y="45" width="12" height="15" />
                  <rect x="65" y="45" width="15" height="12" />
                </svg>
              </div>

              <div className="mt-3 font-mono text-xs font-bold text-amber-400">
                Code: {bike.qrCode}
              </div>
            </div>
          ) : (
            /* Handlebar Scanner Simulation */
            <div className="relative bg-slate-950 border-2 border-dashed border-amber-500/50 rounded-2xl h-52 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-bounce" />
              <Scan className="h-10 w-10 text-amber-400/50 mb-2" />
              <div className="text-xs font-bold text-slate-300">Point Camera at Bike Handlebar QR</div>
              <div className="text-[10px] text-slate-500 mt-1">Scanner automatically syncs with electric lock</div>
            </div>
          )}

          {/* Helmet Confirmation */}
          <div 
            onClick={() => setHasHelmet(!hasHelmet)}
            className="flex items-center space-x-3 bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl cursor-pointer hover:border-slate-600 transition"
          >
            <input
              type="checkbox"
              checked={hasHelmet}
              onChange={(e) => setHasHelmet(e.target.checked)}
              className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500 border-slate-600 bg-slate-700"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-200">🪖 Safety Helmet Check</span>
              <p className="text-[11px] text-slate-400">
                I confirm I am wearing a helmet (Available at station kiosk)
              </p>
            </div>
          </div>

          {/* Unlocked status confirmation */}
          {isUnlocked && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Smart Lock Released! Motor is active and ready to ride.</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          {!isUnlocked ? (
            <button
              onClick={handleUnlockBike}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Unlock SmartBike</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onStartBikeRide(bike);
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Riding & Track Route</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
