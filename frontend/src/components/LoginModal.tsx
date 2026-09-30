import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall,
  BellRing
} from 'lucide-react';
import { UserProfile } from '../types/transit';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updatedUser: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [allowDriverCalls, setAllowDriverCalls] = useState(user.allowDriverCalls);
  const [smsAlerts, setSmsAlerts] = useState(user.smsAlerts);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your Name and Phone Number.');
      return;
    }

    onSaveUser({
      name,
      phone,
      email,
      isLoggedIn: true,
      allowDriverCalls,
      smsAlerts,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {user.isLoggedIn ? 'User Profile & Contact' : 'GoRide Commuter Login'}
              </h3>
              <p className="text-xs text-slate-400">Captains will call this number when arriving</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohit Kumar"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Mobile Phone Number (Core Feature requested) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Mobile Number for Driver Calls
              </label>
              <span className="text-[10px] text-slate-400">Required for pickup</span>
            </div>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 h-4 w-4 text-emerald-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-800 border border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1">
              <PhoneCall className="h-3 w-3 text-amber-400 shrink-0" />
              <span>Your Bike & Auto driver will call this number when they are on the way.</span>
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email (For Transit Receipts)
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohit@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDriverCalls}
                onChange={(e) => setAllowDriverCalls(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-600 bg-slate-800"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Allow Captain to call my phone when arriving</span>
                <p className="text-[11px] text-slate-400">Driver gets in-app call access to your registered number</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-600 bg-slate-800"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Send SMS Ride OTP & Live Updates</span>
                <p className="text-[11px] text-slate-400">Receive SMS notifications before ride starts</p>
              </div>
            </label>
          </div>

          {/* Saved notice */}
          {savedSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Profile and phone number updated successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center space-x-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Save & Connect Phone</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
