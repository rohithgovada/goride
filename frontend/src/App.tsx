import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { RouteSearchPanel } from './components/RouteSearchPanel';
import { TransportModeTabs } from './components/TransportModeTabs';
import { InteractiveMap } from './components/InteractiveMap';
import { TripComparisonList } from './components/TripComparisonList';
import { TripDetailsDrawer } from './components/TripDetailsDrawer';
import { BookingModal } from './components/BookingModal';
import { LiveRideTracker } from './components/LiveRideTracker';
import { SOSModal } from './components/SOSModal';
import { NotificationsModal } from './components/NotificationsModal';
import { BikeQRModal } from './components/BikeQRModal';
import { LoginModal } from './components/LoginModal';
import { DriverCallModal } from './components/DriverCallModal';
import { TripPaymentModal } from './components/TripPaymentModal';
import { ToastNotification } from './components/ToastNotification';
import { 
  DEFAULT_ORIGIN, 
  DEFAULT_DESTINATION, 
  TRANSIT_STATIONS, 
  MOCK_BIKE_RENTALS,
  INITIAL_NOTIFICATIONS,
  CITY_HUBS_CONFIG,
  getTripOptionsForLocations 
} from './data/mockTransitData';
import { LocationPoint, TransportMode, TripOption, BikeRental, TransitNotification, UserProfile } from './types/transit';
import { Sparkles, CheckCircle2, Bike, QrCode, PhoneCall } from 'lucide-react';

const DEFAULT_USER: UserProfile = {
  name: 'Rohit Kumar',
  phone: '+91 98765 43210',
  email: 'rohit@goride.com',
  isLoggedIn: true,
  allowDriverCalls: true,
  smsAlerts: true,
};

export function App() {
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [walletBalance, setWalletBalance] = useState(450);
  const [origin, setOrigin] = useState<LocationPoint>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<LocationPoint>(DEFAULT_DESTINATION);

  // User Profile & Authentication State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('goride_user_profile');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDriverCallOpen, setIsDriverCallOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<TransitNotification | null>(null);

  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('goride_user_profile', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    const toast: TransitNotification = {
      id: `toast-${Date.now()}`,
      title: '👤 Profile & Phone Saved',
      message: `Captains will call you on ${updatedUser.phone} during pickup.`,
      time: 'Just now',
      type: 'alert',
      read: false,
    };
    setActiveToast(toast);
    setNotifications((prev) => [toast, ...prev]);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    const hubs = CITY_HUBS_CONFIG[city];
    if (hubs) {
      setOrigin(hubs.origin);
      setDestination(hubs.destination);
      setSimulationProgress(0);
      setIsSimulating(false);
    }
  };

  const [selectedMode, setSelectedMode] = useState<TransportMode>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'fastest' | 'cheapest' | 'eco'>('all');
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  
  // Modal & Selection States
  const [selectedTrip, setSelectedTrip] = useState<TripOption | null>(null);
  const [detailedTrip, setDetailedTrip] = useState<TripOption | null>(null);
  const [bookingTrip, setBookingTrip] = useState<TripOption | null>(null);
  const [activeRideTrip, setActiveRideTrip] = useState<TripOption | null>(null);
  const [completedTripForPayment, setCompletedTripForPayment] = useState<TripOption | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Bike QR & Notifications States
  const [bikes] = useState<BikeRental[]>(MOCK_BIKE_RENTALS);
  const [selectedBikeForQR, setSelectedBikeForQR] = useState<BikeRental | null>(MOCK_BIKE_RENTALS[0]);
  const [isBikeQROpen, setIsBikeQROpen] = useState(false);
  const [notifications, setNotifications] = useState<TransitNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Live Navigation & Vehicle Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Calculate available trips based on origin and destination
  const allTrips = useMemo(() => {
    return getTripOptionsForLocations(origin, destination);
  }, [origin, destination]);

  // Filter trips based on mode and quick-filter
  const filteredTrips = useMemo(() => {
    let result = allTrips;

    // Filter by mode
    if (selectedMode !== 'all') {
      result = result.filter((t) => t.category === selectedMode);
    }

    // Apply quick filters
    if (activeFilter === 'fastest') {
      result = [...result].sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (activeFilter === 'cheapest') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (activeFilter === 'eco') {
      result = [...result].sort((a, b) => b.co2SavedKg - a.co2SavedKg);
    }

    return result;
  }, [allTrips, selectedMode, activeFilter]);

  // Sync selected trip when list changes
  useEffect(() => {
    if (filteredTrips.length > 0) {
      const stillPresent = filteredTrips.find((t) => t.id === selectedTrip?.id);
      setSelectedTrip(stillPresent || filteredTrips[0]);
    } else {
      setSelectedTrip(null);
    }
  }, [filteredTrips]);

  // Handle Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 2.5; // Smooth progression
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Automatic Driver Call simulation after 6 seconds of ride in progress
  useEffect(() => {
    let callTimer: any = null;
    if (activeRideTrip && (activeRideTrip.category === 'bike' || activeRideTrip.category === 'auto')) {
      callTimer = setTimeout(() => {
        if (user.allowDriverCalls) {
          setIsDriverCallOpen(true);
          const callToast: TransitNotification = {
            id: `toast-call-${Date.now()}`,
            title: `📞 Incoming Call from Captain Rajesh`,
            message: `Captain is calling ${user.phone} - "I am 2 mins away at the gate"`,
            time: 'Just now',
            type: 'bike',
            read: false,
          };
          setActiveToast(callToast);
          setNotifications((prev) => [callToast, ...prev]);
        }
      }, 6000);
    }
    return () => clearTimeout(callTimer);
  }, [activeRideTrip, user.allowDriverCalls, user.phone]);

  // Swap Locations
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setSimulationProgress(0);
    setIsSimulating(false);
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingUser(false);
        setOrigin({
          id: 'user-gps-loc',
          name: 'Your Live Location (GPS)',
          address: `Lat ${position.coords.latitude.toFixed(4)}, Lng ${position.coords.longitude.toFixed(4)}`,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          type: 'user',
        });
      },
      () => {
        setIsLocatingUser(false);
        setOrigin({
          id: 'user-gps-fallback',
          name: 'Majestic Metro Interchange (Detected)',
          address: 'Platform 1 Main Gate, Bengaluru',
          lat: 12.9778,
          lng: 77.5727,
          type: 'user',
        });
      },
      { timeout: 5000 }
    );
  };

  const handleToggleSimulation = () => {
    if (simulationProgress >= 100) {
      setSimulationProgress(0);
    }
    setIsSimulating(!isSimulating);
  };

  const handleStartLiveRide = (trip: TripOption) => {
    setActiveRideTrip(trip);
    setSelectedTrip(trip);
    setSimulationProgress(0);
    setIsSimulating(true);

    // Add confirmation notification & toast
    const newNotif: TransitNotification = {
      id: `notif-${Date.now()}`,
      title: `🚖 Booking Confirmed: ${trip.title}`,
      message: `Captain Rajesh assigned. You can pay ₹${trip.price} via UPI / Cash / Wallet after dropping at destination.`,
      time: 'Just now',
      type: 'bike',
      read: false,
    };
    setActiveToast(newNotif);
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCompletePayment = (method: string, amount: number, _tip: number) => {
    if (method === 'wallet') {
      setWalletBalance((prev) => Math.max(0, prev - amount));
    }
    const payToast: TransitNotification = {
      id: `notif-pay-${Date.now()}`,
      title: `✅ Paid ₹${amount} via ${method.toUpperCase()}`,
      message: `Payment successful! Trip completed. Invoice sent to ${user.email || 'your email'}.`,
      time: 'Just now',
      type: 'wallet',
      read: false,
    };
    setActiveToast(payToast);
    setNotifications((prev) => [payToast, ...prev]);
  };

  // Bike QR & Hub Actions
  const handleSelectBikeFromMap = (bike: BikeRental) => {
    setSelectedBikeForQR(bike);
    setIsBikeQROpen(true);
  };

  const handleStartBikeRentalRide = (bike: BikeRental) => {
    const bikeTrip = allTrips.find((t) => t.category === 'bike') || allTrips[0];
    setActiveRideTrip(bikeTrip);
    setSelectedTrip(bikeTrip);
    setSimulationProgress(0);
    setIsSimulating(true);

    // Add alert notification
    const newNotif: TransitNotification = {
      id: `notif-${Date.now()}`,
      title: `⚡ ${bike.model} In Use`,
      message: `Electric motor active. Current battery: ${bike.batteryPercent}%. Connected with user phone ${user.phone}.`,
      time: 'Just now',
      type: 'bike',
      read: false,
    };
    setActiveToast(newNotif);
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Notification actions
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSimulateNewAlert = () => {
    const alerts: TransitNotification[] = [
      {
        id: `notif-${Date.now()}`,
        title: '🏍️ Bike Taxi Captain Arriving',
        message: `Captain Rajesh is 2 mins away. Calling registered phone ${user.phone}...`,
        time: 'Just now',
        type: 'bike',
        read: false,
      },
      {
        id: `notif-${Date.now()}`,
        title: '🚏 Bus Route 335-E Approaching',
        message: 'Volvo Electric Bus is 2 stops away from Majestic Platform 18.',
        time: 'Just now',
        type: 'transit',
        read: false,
      },
      {
        id: `notif-${Date.now()}`,
        title: '🚆 Metro Platform 2 Announcement',
        message: 'Next Eastbound train toward Whitefield arriving in 90 seconds.',
        time: 'Just now',
        type: 'alert',
        read: false,
      }
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    setActiveToast(randomAlert);
    setNotifications((prev) => [randomAlert, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Alert Banner */}
      <ToastNotification
        notification={activeToast}
        onClose={() => setActiveToast(null)}
        onClick={() => setIsNotificationsOpen(true)}
      />

      {/* Top Navigation */}
      <Navbar
        onOpenSOS={() => setIsSOSOpen(true)}
        walletBalance={walletBalance}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        unreadNotificationCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenBikeQR={() => {
          setSelectedBikeForQR(bikes[0]);
          setIsBikeQROpen(true);
        }}
        user={user}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* User Driver Contact Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  GoRide Multi-Modal Mobility
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Driver Call Enabled
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Connected Phone: <strong className="text-emerald-400 font-mono">{user.phone}</strong> • Captains will call you directly when on the way!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDriverCallOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
              title="Test driver calling your number"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Simulate Driver Calling Me</span>
            </button>

            <button
              onClick={() => {
                setSelectedBikeForQR(bikes[0]);
                setIsBikeQROpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
            >
              <QrCode className="h-4 w-4 text-amber-400" />
              <span>Bike QR</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Route Search & Transport Options (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Origin & Destination Search Panel */}
            <RouteSearchPanel
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onSwapLocations={handleSwapLocations}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocatingUser={isLocatingUser}
            />

            {/* Transport Mode Switcher Tabs */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <TransportModeTabs
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            {/* Trip Cards List */}
            <TripComparisonList
              trips={filteredTrips}
              selectedTrip={selectedTrip}
              onSelectTrip={(t) => {
                setSelectedTrip(t);
                setSimulationProgress(0);
                setIsSimulating(false);
              }}
              onOpenDetails={(t) => setDetailedTrip(t)}
              onBookTrip={(t) => setBookingTrip(t)}
            />
          </div>

          {/* Right Column: Interactive Map & Live Tracking View (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-5 sticky top-20">
            
            {/* The Interactive Map with Bike Docks and Stations */}
            <InteractiveMap
              origin={origin}
              destination={destination}
              selectedTrip={selectedTrip}
              selectedMode={selectedMode}
              stations={TRANSIT_STATIONS}
              bikes={bikes}
              onSelectBike={handleSelectBikeFromMap}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              simulationProgress={simulationProgress}
            />

            {/* Active Route Quick Summary Card */}
            {selectedTrip && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                    Selected Navigation Route
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedTrip.title} ({selectedTrip.subType})
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                    <span>Distance: <b className="text-slate-200">{selectedTrip.distanceKm} km</b></span>
                    <span>•</span>
                    <span>ETA: <b className="text-slate-200">{selectedTrip.durationMinutes} mins</b></span>
                    <span>•</span>
                    <span>Fare: <b className="text-emerald-400">₹{selectedTrip.price}</b></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setDetailedTrip(selectedTrip)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
                  >
                    View Turn Steps
                  </button>
                  <button
                    onClick={() => setBookingTrip(selectedTrip)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md active:scale-95"
                  >
                    {selectedTrip.category === 'bus' || selectedTrip.category === 'train' ? 'Get Ticket' : 'Book Ride'}
                  </button>
                </div>
              </div>
            )}

            {/* Multi-Modal Feature Showcase Footer Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <button 
                onClick={() => {
                  setSelectedMode('bike');
                  setSelectedBikeForQR(bikes[0]);
                  setIsBikeQROpen(true);
                }}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 p-3 rounded-xl transition text-left sm:text-center group"
              >
                <div className="text-lg">🏍️</div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 mt-1">Bike Taxi & QR</div>
                <div className="text-[10px] text-slate-400">Unlock & Instant Ride</div>
              </button>
              <button 
                onClick={() => setSelectedMode('auto')}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 p-3 rounded-xl transition text-left sm:text-center group"
              >
                <div className="text-lg">🛺</div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 mt-1">Auto Rickshaw</div>
                <div className="text-[10px] text-slate-400">Metered & Shared</div>
              </button>
              <button 
                onClick={() => setSelectedMode('bus')}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 p-3 rounded-xl transition text-left sm:text-center group"
              >
                <div className="text-lg">🚌</div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 mt-1">City Buses</div>
                <div className="text-[10px] text-slate-400">Live Routes & Stops</div>
              </button>
              <button 
                onClick={() => setSelectedMode('train')}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 p-3 rounded-xl transition text-left sm:text-center group"
              >
                <div className="text-lg">🚆</div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400 mt-1">Metro Trains</div>
                <div className="text-[10px] text-slate-400">Zero Traffic Commute</div>
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Slide-out Itinerary Details Drawer */}
      <TripDetailsDrawer
        trip={detailedTrip}
        onClose={() => setDetailedTrip(null)}
        onConfirmBooking={(t) => {
          setDetailedTrip(null);
          setBookingTrip(t);
        }}
      />

      {/* Booking / QR Ticket Confirmation Modal */}
      <BookingModal
        trip={bookingTrip}
        origin={origin}
        destination={destination}
        user={user}
        onClose={() => setBookingTrip(null)}
        onStartRide={handleStartLiveRide}
        onSimulateDriverCall={() => setIsDriverCallOpen(true)}
      />

      {/* Bike Handlebar QR Scan & Unlock Modal */}
      <BikeQRModal
        isOpen={isBikeQROpen}
        onClose={() => setIsBikeQROpen(false)}
        bike={selectedBikeForQR}
        onStartBikeRide={handleStartBikeRentalRide}
      />

      {/* User Login & Profile Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        user={user}
        onSaveUser={handleSaveUser}
      />

      {/* Simulated Driver Calling Customer Modal */}
      <DriverCallModal
        isOpen={isDriverCallOpen}
        onClose={() => setIsDriverCallOpen(false)}
        user={user}
        trip={activeRideTrip || selectedTrip}
        driverName="Rajesh Kumar"
        driverPhone="+91 98765 12345"
        vehicleModel={selectedTrip?.category === 'auto' ? 'Bajaj Compact RE (EV)' : 'TVS Apache RTR 160'}
        vehicleNumber="KA-04-ER-9912"
        otp="4821"
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAll}
        onSimulateNewAlert={handleSimulateNewAlert}
      />

      {/* Live Active Navigation HUD Bar */}
      {activeRideTrip && (
        <LiveRideTracker
          trip={activeRideTrip}
          progress={simulationProgress}
          isSimulating={isSimulating}
          onTogglePlayPause={handleToggleSimulation}
          onResetSimulation={() => setSimulationProgress(0)}
          onEndTrip={() => {
            setCompletedTripForPayment(activeRideTrip);
            setIsPaymentModalOpen(true);
            setActiveRideTrip(null);
            setIsSimulating(false);
            setSimulationProgress(0);
          }}
          onOpenSOS={() => setIsSOSOpen(true)}
        />
      )}

      {/* Destination Drop Fare Payment & Receipt Modal */}
      <TripPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        trip={completedTripForPayment || selectedTrip}
        driverName="Rajesh Kumar"
        user={user}
        walletBalance={walletBalance}
        onCompletePayment={handleCompletePayment}
      />

      {/* Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentLocation={origin}
      />

    </div>
  );
}
export default App;
