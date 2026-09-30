import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Crosshair, 
  Clock, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { LocationPoint } from '../types/transit';
import { POPULAR_DESTINATIONS } from '../data/mockTransitData';

interface RouteSearchPanelProps {
  origin: LocationPoint;
  destination: LocationPoint;
  onOriginChange: (loc: LocationPoint) => void;
  onDestinationChange: (loc: LocationPoint) => void;
  onSwapLocations: () => void;
  onUseCurrentLocation: () => void;
  isLocatingUser: boolean;
}

export const RouteSearchPanel: React.FC<RouteSearchPanelProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwapLocations,
  onUseCurrentLocation,
  isLocatingUser,
}) => {
  const [departureTiming, setDepartureTiming] = useState<'now' | '15mins' | '30mins'>('now');
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [destInputText, setDestInputText] = useState(destination.name);
  const [originInputText, setOriginInputText] = useState(origin.name);

  // Sync state whenever props change (e.g. on swap)
  useEffect(() => {
    setDestInputText(destination.name);
  }, [destination.name]);

  useEffect(() => {
    setOriginInputText(origin.name);
  }, [origin.name]);

  const handleSelectPopularDest = (item: LocationPoint) => {
    onDestinationChange(item);
    setDestInputText(item.name);
    setIsSearchingDest(false);
  };

  const handleSelectPopularOrigin = (item: LocationPoint) => {
    onOriginChange(item);
    setOriginInputText(item.name);
    setIsSearchingOrigin(false);
  };

  const handleCustomDestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destInputText.trim()) return;
    onDestinationChange({
      id: `custom-dest-${Date.now()}`,
      name: destInputText,
      address: `Selected Landmark, ${destInputText}`,
      lat: destination.lat,
      lng: destination.lng,
      type: 'hub',
    });
    setIsSearchingDest(false);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Navigation className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            Plan Your Journey
          </span>
        </div>

        {/* Departure Time Selector */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl text-xs border border-slate-700/60">
          <Clock className="h-3 w-3 text-slate-400 ml-1.5" />
          <button
            onClick={() => setDepartureTiming('now')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              departureTiming === 'now'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Leave Now
          </button>
          <button
            onClick={() => setDepartureTiming('15mins')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              departureTiming === '15mins'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            +15m
          </button>
          <button
            onClick={() => setDepartureTiming('30mins')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              departureTiming === '30mins'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            +30m
          </button>
        </div>
      </div>

      {/* Origin & Destination Inputs with Connector Line */}
      <div className="relative space-y-3">
        {/* Vertical connector line */}
        <div className="absolute left-[1.35rem] top-7 bottom-7 w-0.5 border-l-2 border-dashed border-slate-700 pointer-events-none" />

        {/* Origin: "Where we are" */}
        <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 hover:border-slate-600 transition group focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/50">
          <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
              <span>Where We Are (Pickup / Origin)</span>
            </div>
            <input
              type="text"
              value={originInputText}
              onChange={(e) => {
                setOriginInputText(e.target.value);
                setIsSearchingOrigin(true);
              }}
              onFocus={() => setIsSearchingOrigin(true)}
              className="w-full bg-transparent text-sm font-semibold text-slate-100 truncate focus:outline-none"
              title={origin.address}
            />
          </div>
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocatingUser}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-700/60 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-600 hover:border-emerald-500/40 rounded-lg text-xs font-medium transition shrink-0"
            title="Detect GPS Location"
          >
            <Crosshair className={`h-3.5 w-3.5 ${isLocatingUser ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>

        {/* Swap Button in center */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={onSwapLocations}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white shadow-lg transition transform hover:rotate-180 duration-300"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>

        {/* Destination: "Where we have to move" */}
        <form onSubmit={handleCustomDestSubmit} className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 hover:border-slate-600 transition group focus-within:border-rose-500/80 focus-within:ring-1 focus-within:ring-rose-500/50">
          <div className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
              <span>Where We Have To Move (Destination)</span>
            </div>
            <input
              type="text"
              value={destInputText}
              onChange={(e) => {
                setDestInputText(e.target.value);
                setIsSearchingDest(true);
              }}
              onFocus={() => setIsSearchingDest(true)}
              placeholder="Search destination, metro, tech park, address..."
              className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
          {destInputText && (
            <button
              type="button"
              onClick={() => {
                setDestInputText('');
                setIsSearchingDest(true);
              }}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Origin Dropdown Suggestions */}
      {isSearchingOrigin && (
        <div className="mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-400">
            <span>Select Pickup / Starting Point</span>
            <button onClick={() => setIsSearchingOrigin(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          {POPULAR_DESTINATIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectPopularOrigin(item)}
              className="w-full text-left p-2 hover:bg-slate-700/60 rounded-lg flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1 rounded bg-slate-700 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.address}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Destination Dropdown Results if searching */}
      {isSearchingDest && (
        <div className="mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-400">
            <span>Suggested Destinations</span>
            <button onClick={() => setIsSearchingDest(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          {POPULAR_DESTINATIONS.filter((item) =>
            item.name.toLowerCase().includes(destInputText.toLowerCase()) ||
            item.address.toLowerCase().includes(destInputText.toLowerCase())
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectPopularDest(item)}
              className="w-full text-left p-2 hover:bg-slate-700/60 rounded-lg flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1 rounded bg-slate-700 group-hover:bg-rose-500/20 text-slate-300 group-hover:text-rose-400">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.address}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Destination Quick-Pills */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Popular Transit Hubs:</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">1-Click Route</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_DESTINATIONS.map((dest) => {
            const isSelected = destination.id === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => handleSelectPopularDest(dest)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-medium shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white'
                }`}
              >
                <span>{dest.name}</span>
                {isSelected && <CheckCircle2 className="h-3 w-3 text-rose-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
