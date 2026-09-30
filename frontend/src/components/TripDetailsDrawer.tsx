import React, { useState } from 'react';
import { TripOption } from '../types/transit';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Leaf, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CreditCard,
  ShieldCheck,
  Footprints,
  Train,
  Bus,
  Bike,
  Car
} from 'lucide-react';

interface TripDetailsDrawerProps {
  trip: TripOption | null;
  onClose: () => void;
  onConfirmBooking: (trip: TripOption) => void;
}

export const TripDetailsDrawer: React.FC<TripDetailsDrawerProps> = ({
  trip,
  onClose,
  onConfirmBooking,
}) => {
  const [stopsExpanded, setStopsExpanded] = useState<boolean>(true);

  if (!trip) return null;

  const getStepIcon = (mode: string) => {
    switch (mode) {
      case 'walk':
        return <Footprints className="h-4 w-4 text-emerald-400" />;
      case 'train':
        return <Train className="h-4 w-4 text-purple-400" />;
      case 'bus':
        return <Bus className="h-4 w-4 text-blue-400" />;
      case 'bike':
        return <Bike className="h-4 w-4 text-amber-400" />;
      case 'auto':
        return <Car className="h-4 w-4 text-yellow-400" />;
      default:
        return <Navigation className="h-4 w-4 text-slate-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {trip.category.toUpperCase()} ROUTE
              </span>
              <span className="text-xs text-slate-400">• {trip.distanceKm} km</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{trip.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Total Duration</div>
              <div className="text-base font-bold text-white mt-0.5">{trip.durationMinutes} mins</div>
            </div>
            <div className="border-x border-slate-700/80">
              <div className="text-[11px] text-slate-400">Total Fare</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">₹{trip.price}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Est. Arrival</div>
              <div className="text-base font-bold text-white mt-0.5">{trip.arrivalTime}</div>
            </div>
          </div>

          {/* Itinerary Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Step-by-Step Directions
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
              {trip.steps.map((step, idx) => (
                <div key={step.id || idx} className="relative group">
                  {/* Step Node Icon */}
                  <div className="absolute -left-6 top-0 h-6 w-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow">
                    {getStepIcon(step.mode)}
                  </div>

                  {/* Step Body */}
                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3.5 hover:border-slate-600 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {step.instruction}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {step.durationMins} min ({step.distanceKm} km)
                      </span>
                    </div>

                    {step.platform && (
                      <div className="mt-1.5 inline-block text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-md">
                        🚉 {step.platform}
                      </div>
                    )}

                    {step.vehicleNumber && (
                      <div className="mt-1.5 inline-block text-[11px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
                        🚌 Vehicle: {step.vehicleNumber}
                      </div>
                    )}

                    {step.details && (
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {step.details}
                      </p>
                    )}

                    {/* Intermediate stops list */}
                    {step.stops && step.stops.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                        <button
                          type="button"
                          onClick={() => setStopsExpanded(!stopsExpanded)}
                          className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-300 hover:text-white"
                        >
                          <span>Passes {step.stops.length} stations/stops</span>
                          {stopsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        {stopsExpanded && (
                          <div className="mt-2 pl-3 border-l border-dashed border-slate-700 space-y-1.5 py-1">
                            {step.stops.map((stopName, sIdx) => (
                              <div key={sIdx} className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                <span>{stopName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental and Safety Benefit */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center space-x-3 text-xs text-emerald-300">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">GoRide Safe & Clean Guarantee</div>
              <div className="text-slate-300 text-[11px]">
                Real-time GPS ride monitoring, SOS emergency assistance, and digital ticketing.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Fare</div>
            <div className="text-xl font-black text-white">₹{trip.price}</div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onConfirmBooking(trip);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition active:scale-95"
            >
              <span>Confirm & Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
