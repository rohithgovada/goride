import React from 'react';
import { TripOption } from '../types/transit';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Navigation, 
  ShieldAlert, 
  X,
  PartyPopper
} from 'lucide-react';

interface LiveRideTrackerProps {
  trip: TripOption;
  progress: number; // 0 to 100
  isSimulating: boolean;
  onTogglePlayPause: () => void;
  onResetSimulation: () => void;
  onEndTrip: () => void;
  onOpenSOS: () => void;
}

export const LiveRideTracker: React.FC<LiveRideTrackerProps> = ({
  trip,
  progress,
  isSimulating,
  onTogglePlayPause,
  onResetSimulation,
  onEndTrip,
  onOpenSOS,
}) => {
  const isFinished = progress >= 100;

  // Determine current simulated step
  const stepCount = trip.steps.length;
  const currentStepIdx = Math.min(Math.floor((progress / 100) * stepCount), stepCount - 1);
  const currentStep = trip.steps[currentStepIdx] || trip.steps[0];

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[450px] z-40 bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {isFinished ? 'Destination Reached!' : 'Live Navigation In Progress'}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenSOS}
            className="p-1 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] font-bold flex items-center space-x-1"
          >
            <ShieldAlert className="h-3 w-3" />
            <span>SOS</span>
          </button>
          <button
            onClick={onEndTrip}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Turn / Instruction */}
      <div className={`flex items-start space-x-3 p-3 rounded-xl border mb-3 ${
        isFinished ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-800/60 border-slate-700/60'
      }`}>
        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
          isFinished ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {isFinished ? <PartyPopper className="h-4 w-4" /> : <Navigation className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            {isFinished ? 'Trip Completed Successfully' : `Step ${currentStepIdx + 1} of ${stepCount}`}
          </div>
          <div className="text-xs font-bold text-white truncate">
            {isFinished ? 'You have safely reached your destination.' : currentStep.instruction}
          </div>
          {currentStep.details && !isFinished && (
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {currentStep.details}
            </div>
          )}
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center justify-between gap-2">
        {!isFinished ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePlayPause}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95"
            >
              {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isSimulating ? 'Pause' : 'Resume'}</span>
            </button>
            
            <button
              onClick={onResetSimulation}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium transition active:scale-95"
              title="Reset from start"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onEndTrip}
              className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition active:scale-95"
              title="Drop now and pay fare"
            >
              Drop & Pay
            </button>
          </div>
        ) : (
          <button
            onClick={onEndTrip}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Destination Dropped • Pay Fare (₹{trip.price})</span>
          </button>
        )}

        {!isFinished && (
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Total Route</div>
            <div className="text-xs font-bold text-white font-mono">{trip.distanceKm} km • ~{trip.durationMinutes}m</div>
          </div>
        )}
      </div>

    </div>
  );
};
