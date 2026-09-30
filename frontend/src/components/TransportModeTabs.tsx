import React from 'react';
import { 
  Sparkles, 
  Bike, 
  Car, 
  Bus, 
  Train, 
  Zap, 
  Leaf, 
  Clock, 
  Coins 
} from 'lucide-react';
import { TransportMode } from '../types/transit';

interface TransportModeTabsProps {
  selectedMode: TransportMode;
  onSelectMode: (mode: TransportMode) => void;
  activeFilter: 'all' | 'fastest' | 'cheapest' | 'eco';
  onFilterChange: (filter: 'all' | 'fastest' | 'cheapest' | 'eco') => void;
}

export const TransportModeTabs: React.FC<TransportModeTabsProps> = ({
  selectedMode,
  onSelectMode,
  activeFilter,
  onFilterChange,
}) => {
  const MODES: { id: TransportMode; label: string; icon: React.ReactNode; color: string; tag: string }[] = [
    {
      id: 'all',
      label: 'Smart Multi-Modal',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'from-emerald-500 to-teal-400',
      tag: 'Best Combined',
    },
    {
      id: 'bike',
      label: 'Bike Taxi',
      icon: <Bike className="h-4 w-4" />,
      color: 'from-amber-500 to-orange-400',
      tag: 'Fast Solo',
    },
    {
      id: 'auto',
      label: 'Auto Rickshaw',
      icon: <Car className="h-4 w-4" />,
      color: 'from-yellow-400 to-amber-500',
      tag: 'Doorstep',
    },
    {
      id: 'bus',
      label: 'City Bus',
      icon: <Bus className="h-4 w-4" />,
      color: 'from-blue-500 to-cyan-400',
      tag: '₹25 Low Fare',
    },
    {
      id: 'train',
      label: 'Metro Train',
      icon: <Train className="h-4 w-4" />,
      color: 'from-purple-500 to-indigo-400',
      tag: 'Traffic Free',
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Scrollable Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all relative ${
                isSelected
                  ? 'bg-slate-800 text-white border-slate-600 shadow-lg ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg flex items-center justify-center ${
                  isSelected ? `bg-gradient-to-r ${mode.color} text-slate-950 font-bold` : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mode.icon}
              </div>
              <div className="text-left">
                <div className="leading-tight">{mode.label}</div>
                <div className="text-[10px] text-slate-400 font-normal">{mode.tag}</div>
              </div>
              {isSelected && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Sort / Filters */}
      <div className="flex items-center justify-between text-xs pt-1 px-1">
        <span className="text-slate-400 text-[11px] font-medium">Filter by preference:</span>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
              activeFilter === 'all'
                ? 'bg-slate-700 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('fastest')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
              activeFilter === 'fastest'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Fastest</span>
          </button>
          <button
            onClick={() => onFilterChange('cheapest')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
              activeFilter === 'cheapest'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="h-3 w-3" />
            <span>Cheapest</span>
          </button>
          <button
            onClick={() => onFilterChange('eco')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
              activeFilter === 'eco'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="h-3 w-3" />
            <span>Eco</span>
          </button>
        </div>
      </div>
    </div>
  );
};
