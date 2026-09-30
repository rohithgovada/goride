import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  Volume2, 
  Mic, 
  MicOff, 
  MessageSquare, 
  CheckCircle2, 
  Bike,
  Car
} from 'lucide-react';
import { UserProfile, TripOption } from '../types/transit';

interface DriverCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  trip: TripOption | null;
  driverName?: string;
  driverPhone?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  otp?: string;
}

export const DriverCallModal: React.FC<DriverCallModalProps> = ({
  isOpen,
  onClose,
  user,
  trip,
  driverName = 'Rajesh Kumar',
  driverPhone = '+91 98765 12345',
  vehicleModel = 'TVS Apache RTR 160',
  vehicleNumber = 'KA-04-ER-9912',
  otp = '4821',
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [quickReplySent, setQuickReplySent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCallStatus('ringing');
      setCallDuration(0);
      setQuickReplySent(null);
    }
  }, [isOpen]);

  // Call duration counter
  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleSendQuickReply = (msg: string) => {
    setQuickReplySent(msg);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col relative text-center">
        
        {/* Ringing / Calling Status Top Pill */}
        <div className="pt-6 pb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
            {callStatus === 'ringing' && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400">Incoming Driver Call</span>
              </>
            )}
            {callStatus === 'connected' && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-white font-mono">{formatSeconds(callDuration)}</span>
              </>
            )}
            {callStatus === 'ended' && (
              <span className="text-rose-400">Call Ended</span>
            )}
          </div>
        </div>

        {/* Driver Profile & Contact Information */}
        <div className="px-6 py-4 space-y-3">
          
          {/* Avatar with pulsing halo */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            {callStatus === 'ringing' && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            )}
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-xl">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-2xl">
                RK
              </div>
            </div>
            <div className="absolute bottom-1 right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow">
              <Bike className="h-4 w-4" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{driverName}</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              {vehicleModel} • {vehicleNumber}
            </p>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Driver Phone: {driverPhone}
            </div>
          </div>

          {/* User's registered phone note */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-[11px] text-slate-300">
            <span>Connecting to your registered number: </span>
            <strong className="text-white block font-mono text-xs mt-0.5">
              {user.phone || '+91 98765 43210'}
            </strong>
          </div>

          {/* Connected Voice Simulation Audio Wave */}
          {callStatus === 'connected' && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2 text-left">
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span>Captain Rajesh (Speaking):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "Hello {user.name}! I am on my way, just 2 minutes away outside the main gate. Please share your OTP <strong>{otp}</strong> when I reach."
              </p>
              {/* Simulated Audio Bars */}
              <div className="flex items-center justify-center space-x-1 pt-1 h-6">
                {[12, 24, 18, 28, 14, 22, 10, 26, 16, 20].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick SMS Replies (if ringing) */}
          {callStatus === 'ringing' && !quickReplySent && (
            <div className="pt-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                Or Send Quick Auto-Reply
              </div>
              <div className="space-y-1.5">
                {[
                  "I am waiting at the pickup gate",
                  "Coming down in 1 min, please wait",
                  `My Ride OTP is ${otp}`
                ].map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuickReply(msg)}
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium transition text-left flex items-center justify-between"
                  >
                    <span>{msg}</span>
                    <MessageSquare className="h-3 w-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickReplySent && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-xs text-emerald-400 flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Sent: "{quickReplySent}"</span>
            </div>
          )}

        </div>

        {/* Action Call Controls */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-around">
          {callStatus === 'ringing' ? (
            <>
              {/* Decline Call */}
              <button
                onClick={handleEndCall}
                className="flex flex-col items-center space-y-1 group"
              >
                <div className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition active:scale-90">
                  <PhoneOff className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-rose-400">Decline</span>
              </button>

              {/* Accept Call */}
              <button
                onClick={handleAcceptCall}
                className="flex flex-col items-center space-y-1 group"
              >
                <div className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition active:scale-90 animate-bounce">
                  <Phone className="h-6 w-6 fill-current" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-400">Accept Call</span>
              </button>
            </>
          ) : (
            /* In-Call Controls */
            <div className="flex items-center justify-around w-full">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full border transition ${
                  isMuted ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={handleEndCall}
                className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition active:scale-90"
                title="End Call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3 rounded-full border transition ${
                  isSpeaker ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Speaker"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
