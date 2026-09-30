import React, { useState } from 'react';
import { 
  Compass, 
  ShieldAlert, 
  Wallet, 
  Bell, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X,
  PhoneCall,
  Sparkles,
  Bike,
  QrCode
} from 'lucide-react';

interface NavbarProps {
  onOpenSOS: () => void;
  walletBalance: number;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenBikeQR: () => void;
  user: import('../types/transit').UserProfile;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSOS, 
  walletBalance,
  selectedCity,
  onSelectCity,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenBikeQR,
  user,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const CITIES = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata'];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="h-6 w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Go<span className="text-emerald-400">Ride</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  All-in-One Transit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">
                Bike • Auto • Bus • Metro Trains
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="relative">
            <button 
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>{selectedCity}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400">Available Transit Cities</div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between ${
                      selectedCity === city ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live System Status Banner */}
          <div className="hidden xl:flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-300">
              City Transit Live: <strong className="text-emerald-400">3,420+ vehicles active</strong>
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Bike QR Scan Button */}
            <button
              onClick={onOpenBikeQR}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
              title="Scan QR to Unlock Electric Bike"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">Bike QR Unlock</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl transition"
              title="Transit Alerts & Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Wallet Balance */}
            <div className="flex items-center space-x-1.5 bg-slate-800/70 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs">
              <Wallet className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200">₹{walletBalance}</span>
            </div>

            {/* SOS Emergency Button */}
            <button
              onClick={onOpenSOS}
              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
              title="Emergency SOS Assistance"
            >
              <ShieldAlert className="h-4 w-4 animate-pulse text-rose-500" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* User Profile Avatar & Phone Display */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center space-x-2 pl-1 group text-left transition hover:opacity-90"
              title="Click to view/edit your phone number & profile"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md border border-indigo-400/30 group-hover:border-emerald-400 transition">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'RK'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 leading-tight truncate max-w-[85px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-tight truncate max-w-[85px]">
                  {user.phone}
                </div>
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer banner */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>City Transit Status:</span>
            <span className="text-emerald-400 font-semibold">99.4% Punctuality</span>
          </div>
          <div className="flex space-x-2 pt-2">
            <button 
              onClick={onOpenBikeQR}
              className="flex-1 py-2 bg-amber-500/20 border border-amber-500 text-amber-300 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" />
              <span>Bike QR</span>
            </button>
            <button 
              onClick={onOpenNotifications}
              className="flex-1 py-2 bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5"
            >
              <Bell className="h-3.5 w-3.5 text-blue-400" />
              <span>Alerts ({unreadNotificationCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
