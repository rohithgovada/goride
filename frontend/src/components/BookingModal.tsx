import React, { useState, useEffect } from 'react';
import { TripOption, LocationPoint } from '../types/transit';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  Play, 
  Navigation,
  KeyRound,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  trip: TripOption | null;
  origin: LocationPoint;
  destination: LocationPoint;
  user: import('../types/transit').UserProfile;
  onClose: () => void;
  onStartRide: (trip: TripOption) => void;
  onSimulateDriverCall: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  trip,
  origin,
  destination,
  user,
  onClose,
  onStartRide,
  onSimulateDriverCall,
}) => {
  const [loadingState, setLoadingState] = useState<'matching' | 'confirmed'>('matching');
  const [ticketCountdown, setTicketCountdown] = useState(3600); // 1 hour in seconds
  const [driverOtp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  useEffect(() => {
    if (!trip) return;

    // Simulate instant match after 1.2s
    setLoadingState('matching');
    const timer = setTimeout(() => {
      setLoadingState('confirmed');
    }, 1200);

    return () => clearTimeout(timer);
  }, [trip]);

  // Countdown timer for digital passes
  useEffect(() => {
    if (loadingState !== 'confirmed') return;
    const interval = setInterval(() => {
      setTicketCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [loadingState]);

  if (!trip) return null;

  const isPublicTransit = trip.category === 'bus' || trip.category === 'train' || trip.category === 'smart';
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isPublicTransit ? 'GoRide Digital Pass' : 'GoRide Cab / Bike Dispatch'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {loadingState === 'matching' ? (
            <div className="py-12 text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isPublicTransit ? 'Generating QR Transit Pass...' : 'Dispatching Nearest Captain...'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">Connecting to city transit network</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Confirmed Banner */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isPublicTransit ? 'Pass Active & Valid' : 'Driver Assigned & On The Way!'}</span>
                </div>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  Paid: ₹{trip.price}
                </span>
              </div>

              {/* Public Transit QR Pass View */}
              {isPublicTransit ? (
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center relative overflow-hidden">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Scan At Turnstile / Show Conductor
                  </div>
                  <div className="text-xs text-slate-300 font-medium mb-4">
                    {origin.name} ➔ {destination.name}
                  </div>

                  {/* QR Code Container */}
                  <div className="mx-auto w-44 h-44 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center relative group">
                    {/* Simulated SVG QR Code pattern */}
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

                      <rect x="40" y="10" width="10" height="20" />
                      <rect x="55" y="15" width="10" height="10" />
                      <rect x="35" y="45" width="30" height="10" />
                      <rect x="40" y="65" width="15" height="25" />
                      <rect x="70" y="50" width="25" height="15" />
                      <rect x="75" y="75" width="20" height="20" />
                    </svg>
                  </div>

                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-300">
                    <span className="text-slate-400">Valid For:</span>
                    <span className="font-mono font-bold text-amber-400">{formatTime(ticketCountdown)}</span>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-400">
                    Pass Ref: GORIDE-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              ) : (
                /* On-Demand Ride Driver Card (Bike / Auto) */
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-4">
                  
                  {/* Driver Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg">
                        RK
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                          <span>Rajesh Kumar</span>
                          <span className="text-amber-400 text-xs">★ 4.88</span>
                        </div>
                        <div className="text-xs text-slate-300 font-mono">
                          {trip.category === 'bike' ? 'TVS Apache RTR 160' : 'Bajaj Compact RE (EV)'}
                        </div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">
                          KA-04-ER-9912
                        </div>
                      </div>
                    </div>

                    {/* Start OTP */}
                    <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center space-x-1">
                        <KeyRound className="h-3 w-3 text-emerald-400" />
                        <span>Ride OTP</span>
                      </div>
                      <div className="text-lg font-black text-emerald-400 tracking-wider font-mono">
                        {driverOtp}
                      </div>
                    </div>
                  </div>

                  {/* Customer phone notice */}
                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-2.5 text-left text-xs">
                    <span className="text-slate-400 text-[11px] block">Captain will call customer at:</span>
                    <div className="font-bold text-emerald-400 font-mono text-xs flex items-center justify-between mt-0.5">
                      <span>{user.phone || '+91 98765 43210'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Active on Ride</span>
                    </div>
                  </div>

                  {/* Actions (Call / Simulate / Share) */}
                  <div className="space-y-2 pt-1 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={onSimulateDriverCall}
                      className="w-full py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center space-x-2 transition active:scale-95 shadow"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      <span>Simulate Driver Calling Me Now 📞</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="tel:+919876512345"
                        className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Call Captain</span>
                      </a>
                      <button
                        onClick={() => alert('Live tracking link copied to clipboard!')}
                        className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition"
                      >
                        <Share2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Share Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety notice */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Trip is monitored by GoRide 24x7 Safety Command Center.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Minimize
          </button>
          <button
            onClick={() => {
              onClose();
              onStartRide(trip);
            }}
            disabled={loadingState === 'matching'}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition disabled:opacity-50 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Start Live Navigation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
