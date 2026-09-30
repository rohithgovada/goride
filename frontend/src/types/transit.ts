export type TransportMode = 'all' | 'bike' | 'auto' | 'bus' | 'train';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: 'station' | 'stop' | 'hub' | 'custom' | 'user';
  lines?: string[]; // e.g. ["Metro Purple Line", "Bus 335-E"]
}

export interface TransitStep {
  id: string;
  instruction: string;
  mode: 'walk' | 'bike' | 'auto' | 'bus' | 'train';
  distanceKm: number;
  durationMins: number;
  details?: string;
  stopCount?: number;
  stops?: string[];
  vehicleNumber?: string;
  platform?: string;
}

export interface TripOption {
  id: string;
  title: string;
  mode: TransportMode;
  category: 'smart' | 'bike' | 'auto' | 'bus' | 'train';
  subType: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  distanceKm: number;
  departureTime: string;
  arrivalTime: string;
  co2SavedKg: number;
  badges: string[];
  waitMins: number;
  rating: number;
  availableVehiclesCount?: number;
  nextDepartureInMins?: number;
  maxCapacity?: number; // e.g. Bike: 1, Auto: 3, Bus/Metro: 50+
  coordinates: [number, number][]; // LatLng points along route
  steps: TransitStep[];
}

export interface TransitStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'bus_stop' | 'metro_station' | 'auto_stand' | 'bike_hub';
  lines: string[];
  nextArrivalMinutes: number[];
}

export interface LiveRideBooking {
  bookingId: string;
  trip: TripOption;
  status: 'searching' | 'driver_assigned' | 'in_progress' | 'completed';
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleModel: string;
    rating: number;
    otp: string;
    etaMinutes: number;
  };
  ticket?: {
    ticketId: string;
    qrData: string;
    passengerCount: number;
    validTill: string;
    fare: number;
    mode: string;
  };
  currentStepIndex: number;
  progressPercent: number;
  currentVehiclePos: [number, number];
}

export interface BikeRental {
  id: string;
  model: string;
  dockName: string;
  batteryPercent: number;
  rangeKm: number;
  qrCode: string;
  pricePerMin: number;
  helmetAvailable: boolean;
  lat: number;
  lng: number;
  status: 'available' | 'reserved' | 'in_use';
}

export interface TransitNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'bike' | 'transit' | 'wallet' | 'alert';
  read: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
  allowDriverCalls: boolean;
  smsAlerts: boolean;
}


