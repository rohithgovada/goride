import React from 'react';
import { 
  TripOption, 
  TransportMode 
} from '../types/transit';
import { 
  Clock, 
  ArrowRight, 
  Leaf, 
  Star, 
  Sparkles, 
  Bike, 
  Car, 
  Bus, 
  Train, 
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface TripComparisonListProps {
  trips: TripOption[];
  selectedTrip: TripOption | null;
  onSelectTrip: (trip: TripOption) => void;
  onOpenDetails: (trip: TripOption) => void;
  onBookTrip: (trip: TripOption) => void;
  passengerCount: number;
}

export const TripComparisonList: React.FC<TripComparisonListProps> = ({
  trips,
  selectedTrip,
  onSelectTrip,
  onOpenDetails,
  onBookTrip,
  passengerCount,
}) => {
  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'bike':
        return <Bike className="h-5 w-5 text-amber-400" />;
      case 'auto':
        return <Car className="h-5 w-5 text-emerald-400" />;
      case 'bus':
        return <Bus className="h-5 w-5 text-blue-400" />;
      case 'train':
        return <Train className="h-5 w-5 text-purple-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getActionLabel = (category: string) => {
    if (category === 'bus' || category === 'train') return 'Get Digital Ticket';
    if (category === 'smart') return 'Start Journey';
    return 'Book Ride';
  };

  if (trips.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <p>No transit options found for this criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Available Travel Options ({trips.length})
        </span>
        <span className="text-[11px] text-slate-400">
          Click option to preview path on map
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {trips.map((trip) => {
          const isSelected = selectedTrip?.id === trip.id;
          const isBike = trip.category === 'bike';
          const isAuto = trip.category === 'auto';
          const isPublicTransit = trip.category === 'bus' || trip.category === 'train';

          const isBikeOverCapacity = isBike && passengerCount > 1;
          const isAutoOverCapacity = isAuto && passengerCount > 3;
          const isOverCapacity = isBikeOverCapacity || isAutoOverCapacity;

          // Dynamic passenger fare
          let displayPrice = trip.price;
          let priceNote = trip.waitMins <= 2 ? '⚡ Instant pickup' : `⏳ Next in ${trip.waitMins}m`;

          if (isPublicTransit) {
            displayPrice = trip.price * passengerCount;
            priceNote = `₹${trip.price} × ${passengerCount} members`;
          } else if (isAuto && passengerCount >= 2) {
            const perPerson = Math.round(trip.price / passengerCount);
            priceNote = `₹${perPerson}/person (Split fare)`;
          }

          return (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className={`group relative bg-slate-900/90 border rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
                isBikeOverCapacity
                  ? 'border-amber-900/50 bg-slate-950/70 opacity-75'
                  : isSelected
                  ? 'border-emerald-500/80 bg-slate-900 ring-2 ring-emerald-500/20'
                  : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/95'
              }`}
            >
              {/* Top Row: Badges & Rating */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Highlight Auto for 2 members */}
                  {isAuto && passengerCount === 2 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-emerald-500 text-slate-950 border-emerald-400 shadow animate-pulse">
                      👥 ⭐ Recommended for 2 Members
                    </span>
                  )}
                  {isAuto && passengerCount === 3 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                      👥 Fits All 3 Members
                    </span>
                  )}
                  {isBikeOverCapacity && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/40">
                      ⚠️ 1 Person Max (Helmet Law)
                    </span>
                  )}

                  {trip.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        badge.includes('Fastest')
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : badge.includes('Eco')
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          : badge.includes('Cheapest')
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                  {trip.co2SavedKg > 0 && (
                    <span className="text-[10px] text-teal-400 flex items-center space-x-0.5">
                      <Leaf className="h-3 w-3" />
                      <span>{trip.co2SavedKg}kg CO₂ saved</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-xs text-amber-400 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{trip.rating}</span>
                </div>
              </div>

              {/* Overcapacity Warning Notice */}
              {isBikeOverCapacity && (
                <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center space-x-1.5">
                  <span>⚠️</span>
                  <span>Bike Taxi is for 1 rider only. For {passengerCount} members, please book <b>Auto Rickshaw</b> below!</span>
                </div>
              )}

              {/* Main Info Row */}
              <div className="flex items-start justify-between gap-3">
                
                {/* Left: Icon & Title */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 shrink-0">
                    {getModeIcon(trip.mode)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {trip.subType}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-slate-300">
                      <div className="flex items-center space-x-1 text-slate-200 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{trip.durationMinutes} mins</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span>Arrive by {trip.arrivalTime}</span>
                      <span className="text-slate-600">•</span>
                      <span>{trip.distanceKm} km</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & CTA */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end space-x-1.5">
                    {trip.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{isPublicTransit ? trip.originalPrice * passengerCount : trip.originalPrice}
                      </span>
                    )}
                    <span className="text-lg sm:text-xl font-black text-white font-mono">
                      ₹{displayPrice}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {priceNote}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(trip);
                  }}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-medium flex items-center space-x-1 transition px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  <span>{trip.steps.length} Steps Itinerary</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                {isBikeOverCapacity ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const autoTrip = trips.find(t => t.category === 'auto');
                      if (autoTrip) onSelectTrip(autoTrip);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center space-x-1"
                  >
                    <span>Choose Auto Instead 🛺</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Update trip price with total passenger price if public transit
                      const bookedTrip = isPublicTransit ? { ...trip, price: displayPrice } : trip;
                      onBookTrip(bookedTrip);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 active:scale-95"
                  >
                    <span>{getActionLabel(trip.category)}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
