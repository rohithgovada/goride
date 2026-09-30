import { LocationPoint, TransitStation, TripOption } from '../types/transit';

// Default Center Coordinates (Bangalore Urban Central corridor as a realistic vibrant transit testbed)
export const DEFAULT_ORIGIN: LocationPoint = {
  id: 'loc-origin-1',
  name: 'Majestic Central Hub (Current Location)',
  address: 'Kempegowda Bus & Metro Interchange, Platform 1',
  lat: 12.9778,
  lng: 77.5727,
  type: 'user',
};

export const DEFAULT_DESTINATION: LocationPoint = {
  id: 'loc-dest-1',
  name: 'Indiranagar 100ft Metro & Tech Corridor',
  address: '100 Feet Road, Near CMH Junction',
  lat: 12.9784,
  lng: 77.6408,
  type: 'hub',
};

// City-specific transit hubs
export const CITY_HUBS_CONFIG: Record<string, { origin: LocationPoint; destination: LocationPoint }> = {
  'Bengaluru': {
    origin: DEFAULT_ORIGIN,
    destination: DEFAULT_DESTINATION,
  },
  'Delhi NCR': {
    origin: {
      id: 'delhi-origin',
      name: 'Connaught Place Central Metro Hub',
      address: 'Rajiv Chowk Metro Interchange, Gate 7',
      lat: 28.6315,
      lng: 77.2167,
      type: 'user',
    },
    destination: {
      id: 'delhi-dest',
      name: 'Cyber City DLF & Rapid Metro',
      address: 'Phase 2, Gurugram Corridor',
      lat: 28.4962,
      lng: 77.0890,
      type: 'hub',
    }
  },
  'Mumbai': {
    origin: {
      id: 'mumbai-origin',
      name: 'CSMT Railway & Metro Interchange',
      address: 'Fort, South Mumbai Terminal',
      lat: 18.9401,
      lng: 72.8354,
      type: 'user',
    },
    destination: {
      id: 'mumbai-dest',
      name: 'Bandra Kurla Complex (BKC) Metro',
      address: 'G Block, Bandra East',
      lat: 19.0657,
      lng: 72.8687,
      type: 'hub',
    }
  },
  'Hyderabad': {
    origin: {
      id: 'hyd-origin',
      name: 'Secunderabad Central Junction',
      address: 'Railway Station & Blue Line Metro',
      lat: 17.4334,
      lng: 78.5044,
      type: 'user',
    },
    destination: {
      id: 'hyd-dest',
      name: 'Hitec City Cyber Towers Metro',
      address: 'Madhapur Tech Hub Gate 1',
      lat: 17.4504,
      lng: 78.3809,
      type: 'hub',
    }
  },
  'Chennai': {
    origin: {
      id: 'chennai-origin',
      name: 'Chennai Central Metro Interchange',
      address: 'Puratchi Thalaivar Dr. M.G.R Station',
      lat: 13.0827,
      lng: 80.2707,
      type: 'user',
    },
    destination: {
      id: 'chennai-dest',
      name: 'T. Nagar Transit Hub',
      address: 'Usman Road Commercial Corridor',
      lat: 13.0418,
      lng: 80.2341,
      type: 'hub',
    }
  },
  'Kolkata': {
    origin: {
      id: 'kol-origin',
      name: 'Howrah Railway & Green Line Metro',
      address: 'Under-river Metro Station Gate 1',
      lat: 22.5850,
      lng: 88.3426,
      type: 'user',
    },
    destination: {
      id: 'kol-dest',
      name: 'Salt Lake Sector V IT Hub',
      address: 'Electronics Complex Metro Station',
      lat: 22.5805,
      lng: 88.4331,
      type: 'hub',
    }
  }
};


// Popular destinations for quick-search chips
export const POPULAR_DESTINATIONS: LocationPoint[] = [
  {
    id: 'pop-1',
    name: 'Indiranagar 100ft Rd',
    address: 'Near 12th Main Metro Junction',
    lat: 12.9784,
    lng: 77.6408,
    type: 'hub',
  },
  {
    id: 'pop-2',
    name: 'Koramangala Sony World',
    address: '80 Feet Road, 4th Block',
    lat: 12.9345,
    lng: 77.6265,
    type: 'hub',
  },
  {
    id: 'pop-3',
    name: 'Whitefield ITPL Tech Park',
    address: 'Main Gate, Metro Terminal',
    lat: 12.9866,
    lng: 77.7289,
    type: 'station',
  },
  {
    id: 'pop-4',
    name: 'Airport Express Terminal',
    address: 'International Departure Gate 2',
    lat: 13.1986,
    lng: 77.7066,
    type: 'station',
  },
  {
    id: 'pop-5',
    name: 'Cubbon Park Metro & Court',
    address: 'Kasturba Road Entrance',
    lat: 12.9738,
    lng: 77.5906,
    type: 'station',
  }
];

// Transit Network Stations & Stops across the corridor
export const TRANSIT_STATIONS: TransitStation[] = [
  {
    id: 'st-metro-1',
    name: 'Kempegowda Majestic Metro',
    lat: 12.9778,
    lng: 77.5727,
    type: 'metro_station',
    lines: ['Purple Line', 'Green Line'],
    nextArrivalMinutes: [2, 7, 14],
  },
  {
    id: 'st-metro-2',
    name: 'Cubbon Park Metro Station',
    lat: 12.9738,
    lng: 77.5906,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [4, 9, 16],
  },
  {
    id: 'st-metro-3',
    name: 'MG Road Central Metro',
    lat: 12.9754,
    lng: 77.6066,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [3, 8, 15],
  },
  {
    id: 'st-metro-4',
    name: 'Trinity Circle Metro',
    lat: 12.9729,
    lng: 77.6171,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [5, 11],
  },
  {
    id: 'st-metro-5',
    name: 'Halasuru Metro Station',
    lat: 12.9756,
    lng: 77.6267,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [2, 8],
  },
  {
    id: 'st-metro-6',
    name: 'Indiranagar Metro Station',
    lat: 12.9784,
    lng: 77.6408,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [4, 10],
  },
  // Bus Stops
  {
    id: 'st-bus-1',
    name: 'Majestic Bus Stand Platform 18',
    lat: 12.9765,
    lng: 77.5715,
    type: 'bus_stop',
    lines: ['335-E', 'K-2', '333-P'],
    nextArrivalMinutes: [3, 12, 19],
  },
  {
    id: 'st-bus-2',
    name: 'Corporation Bus Stop',
    lat: 12.9698,
    lng: 77.5891,
    type: 'bus_stop',
    lines: ['335-E', 'SBS-1'],
    nextArrivalMinutes: [6, 14],
  },
  {
    id: 'st-bus-3',
    name: 'Mayo Hall / Garuda Mall Stop',
    lat: 12.9722,
    lng: 77.6083,
    type: 'bus_stop',
    lines: ['335-E', 'V-335'],
    nextArrivalMinutes: [5, 16],
  },
  {
    id: 'st-bus-4',
    name: 'Domlur TTMC Bus Station',
    lat: 12.9609,
    lng: 77.6387,
    type: 'bus_stop',
    lines: ['500-D', '335-E', 'MF-12'],
    nextArrivalMinutes: [1, 9, 18],
  },
  // Auto Stands
  {
    id: 'st-auto-1',
    name: 'Prepaid Auto Stand - Majestic',
    lat: 12.9782,
    lng: 77.5741,
    type: 'auto_stand',
    lines: ['Queue Service', 'EV Auto Charging'],
    nextArrivalMinutes: [1],
  },
  {
    id: 'st-auto-2',
    name: 'Indiranagar Auto Bay',
    lat: 12.9790,
    lng: 77.6395,
    type: 'auto_stand',
    lines: ['Metred Auto', 'Share Auto'],
    nextArrivalMinutes: [2],
  },
  // Bike Hubs
  {
    id: 'st-bike-1',
    name: 'GoRide Electric Bike Station - Central',
    lat: 12.9772,
    lng: 77.5735,
    type: 'bike_hub',
    lines: ['18 Bikes Available', 'Helmet Kiosk'],
    nextArrivalMinutes: [0],
  },
  {
    id: 'st-bike-2',
    name: 'GoRide Bike Hub - Indiranagar',
    lat: 12.9779,
    lng: 77.6415,
    type: 'bike_hub',
    lines: ['12 Bikes Available'],
    nextArrivalMinutes: [0],
  }
];

// Helper to generate coordinates along a path between two points
function generatePath(
  start: [number, number],
  end: [number, number],
  waypoints: [number, number][] = []
): [number, number][] {
  return [start, ...waypoints, end];
}

// Generate Realistic Multi-Modal Trip Options
export function getTripOptionsForLocations(origin: LocationPoint, dest: LocationPoint): TripOption[] {
  const originCoord: [number, number] = [origin.lat, origin.lng];
  const destCoord: [number, number] = [dest.lat, dest.lng];

  // 1. Smart Multi-Modal Journey (Metro + Auto last mile)
  const smartCoords = generatePath(originCoord, destCoord, [
    [12.9778, 77.5727], // Majestic Metro
    [12.9738, 77.5906], // Cubbon
    [12.9754, 77.6066], // MG Road
    [12.9729, 77.6171], // Trinity
    [12.9756, 77.6267], // Halasuru
    [12.9784, 77.6408], // Indiranagar
  ]);

  // 2. Bike Taxi Route (Direct through arterial roads & flyovers)
  const bikeCoords = generatePath(originCoord, destCoord, [
    [12.9760, 77.5810],
    [12.9740, 77.5980],
    [12.9750, 77.6120],
    [12.9768, 77.6290],
  ]);

  // 3. Auto Rickshaw Route (Commercial ring road)
  const autoCoords = generatePath(originCoord, destCoord, [
    [12.9785, 77.5830],
    [12.9720, 77.6010],
    [12.9735, 77.6180],
    [12.9770, 77.6350],
  ]);

  // 4. City Bus Route (Follows bus corridor stops)
  const busCoords = generatePath(originCoord, destCoord, [
    [12.9765, 77.5715],
    [12.9698, 77.5891],
    [12.9722, 77.6083],
    [12.9609, 77.6387],
    [12.9730, 77.6390],
  ]);

  // 5. Metro Train (Station-to-station express track)
  const trainCoords = generatePath(originCoord, destCoord, [
    [12.9778, 77.5727],
    [12.9738, 77.5906],
    [12.9754, 77.6066],
    [12.9729, 77.6171],
    [12.9756, 77.6267],
    [12.9784, 77.6408],
  ]);

  return [
    {
      id: 'trip-smart-1',
      title: 'Smart Combined Multi-Modal',
      mode: 'all',
      category: 'smart',
      subType: 'Metro Line 1 + 500m Walk / Auto',
      price: 45,
      originalPrice: 65,
      durationMinutes: 22,
      distanceKm: 7.4,
      departureTime: '10:05 AM',
      arrivalTime: '10:27 AM',
      co2SavedKg: 1.8,
      badges: ['Recommended', 'Fastest', 'Eco Choice'],
      waitMins: 3,
      rating: 4.9,
      nextDepartureInMins: 3,
      maxCapacity: 3,
      coordinates: smartCoords,
      steps: [
        {
          id: 'step-1',
          instruction: 'Walk 180m to Kempegowda Metro Entrance Gate 3',
          mode: 'walk',
          distanceKm: 0.18,
          durationMins: 3,
          details: 'Direct indoor subway walkway',
        },
        {
          id: 'step-2',
          instruction: 'Board Metro Purple Line toward Whitefield (Kadugodi)',
          mode: 'train',
          distanceKm: 6.8,
          durationMins: 15,
          platform: 'Platform 2 (Eastbound)',
          stopCount: 5,
          stops: ['Cubbon Park', 'MG Road', 'Trinity', 'Halasuru', 'Indiranagar'],
        },
        {
          id: 'step-3',
          instruction: 'Alight at Indiranagar Metro Station Exit A',
          mode: 'walk',
          distanceKm: 0.4,
          durationMins: 4,
          details: 'Walk 400m along 100ft Road or take shared auto outside gate',
        },
      ],
    },
    {
      id: 'trip-bike-1',
      title: 'GoRide Bike Taxi (Instant)',
      mode: 'bike',
      category: 'bike',
      subType: 'Rapid 2-Wheeler • Helmet provided',
      price: 68,
      originalPrice: 85,
      durationMinutes: 19,
      distanceKm: 7.1,
      departureTime: '10:04 AM',
      arrivalTime: '10:23 AM',
      co2SavedKg: 0.6,
      badges: ['Fastest for Solo', 'Door to Door'],
      waitMins: 2,
      rating: 4.8,
      availableVehiclesCount: 8,
      maxCapacity: 1,
      coordinates: bikeCoords,
      steps: [
        {
          id: 'bike-step-1',
          instruction: 'Pickup at Majestic Gate 1 pickup bay',
          mode: 'walk',
          distanceKm: 0.05,
          durationMins: 1,
          details: 'Driver Rajesh K (TVS Apache - KA-04-ER-9912) is 2 mins away',
        },
        {
          id: 'bike-step-2',
          instruction: 'Direct ride via MG Road Flyover & 100ft road',
          mode: 'bike',
          distanceKm: 7.05,
          durationMins: 18,
          details: 'Express lane navigation avoiding peak signals',
        },
      ],
    },
    {
      id: 'trip-auto-1',
      title: 'GoRide Auto Rickshaw',
      mode: 'auto',
      category: 'auto',
      subType: 'Metered EV / CNG Auto • Up to 3 passengers',
      price: 115,
      originalPrice: 130,
      durationMinutes: 26,
      distanceKm: 7.6,
      departureTime: '10:06 AM',
      arrivalTime: '10:32 AM',
      co2SavedKg: 0.9,
      badges: ['Comfort', 'Group Friendly'],
      waitMins: 4,
      rating: 4.7,
      availableVehiclesCount: 14,
      maxCapacity: 3,
      coordinates: autoCoords,
      steps: [
        {
          id: 'auto-step-1',
          instruction: 'Meet driver at Central Auto Stand Bay 4',
          mode: 'walk',
          distanceKm: 0.1,
          durationMins: 2,
        },
        {
          id: 'auto-step-2',
          instruction: 'Ride through Kasturba Road and Old Airport corridor',
          mode: 'auto',
          distanceKm: 7.5,
          durationMins: 24,
          details: 'Digital metered pricing with GPS tamper-proof tracking',
        },
      ],
    },
    {
      id: 'trip-bus-1',
      title: 'City Express Bus (Route 335-E)',
      mode: 'bus',
      category: 'bus',
      subType: 'BMTC Electric Low-Floor AC Bus',
      price: 25,
      originalPrice: 35,
      durationMinutes: 34,
      distanceKm: 8.2,
      departureTime: '10:08 AM',
      arrivalTime: '10:42 AM',
      co2SavedKg: 2.4,
      badges: ['Cheapest', 'Low Carbon'],
      waitMins: 5,
      rating: 4.5,
      nextDepartureInMins: 5,
      maxCapacity: 50,
      coordinates: busCoords,
      steps: [
        {
          id: 'bus-step-1',
          instruction: 'Board at Majestic Bus Terminal Platform 18',
          mode: 'walk',
          distanceKm: 0.15,
          durationMins: 3,
        },
        {
          id: 'bus-step-2',
          instruction: 'Ride Bus 335-E (Electric Volvo)',
          mode: 'bus',
          distanceKm: 7.8,
          durationMins: 28,
          vehicleNumber: 'KA-01-F-7821',
          stopCount: 9,
          stops: [
            'Corporation',
            'Richmond Circle',
            'Mayo Hall',
            'Trinity Circle',
            'Domlur TTMC',
            'Indiranagar 100ft Road',
          ],
        },
        {
          id: 'bus-step-3',
          instruction: 'Alight at Indiranagar 100ft junction & walk 200m',
          mode: 'walk',
          distanceKm: 0.25,
          durationMins: 3,
        },
      ],
    },
    {
      id: 'trip-train-1',
      title: 'Namma Metro Express Train',
      mode: 'train',
      category: 'train',
      subType: 'Purple Line Rapid Rail Transit',
      price: 35,
      originalPrice: 40,
      durationMinutes: 20,
      distanceKm: 7.0,
      departureTime: '10:07 AM',
      arrivalTime: '10:27 AM',
      co2SavedKg: 2.1,
      badges: ['Traffic Free', 'High Punctuality', 'Air Conditioned'],
      waitMins: 4,
      rating: 4.9,
      nextDepartureInMins: 4,
      maxCapacity: 500,
      coordinates: trainCoords,
      steps: [
        {
          id: 'train-step-1',
          instruction: 'Enter Majestic Metro via Smart NFC Gate or QR Ticket',
          mode: 'walk',
          distanceKm: 0.2,
          durationMins: 3,
        },
        {
          id: 'train-step-2',
          instruction: 'Take Purple Line train on Platform 2 toward Whitefield',
          mode: 'train',
          distanceKm: 6.5,
          durationMins: 14,
          platform: 'Platform 2',
          stopCount: 5,
          stops: ['Cubbon Park', 'Vidhana Soudha', 'MG Road', 'Trinity', 'Halasuru', 'Indiranagar'],
        },
        {
          id: 'train-step-3',
          instruction: 'Exit at Indiranagar Metro Station Concourse',
          mode: 'walk',
          distanceKm: 0.3,
          durationMins: 3,
        },
      ],
    },
  ];
}

// Available Smart Electric Bikes with Handlebar QR Code & Battery
export const MOCK_BIKE_RENTALS: import('../types/transit').BikeRental[] = [
  {
    id: 'bike-101',
    model: 'GoRide Smart EV Bike X1',
    dockName: 'Majestic Central Hub - Bay 2',
    batteryPercent: 94,
    rangeKm: 52,
    qrCode: 'GORIDE-EV-9412',
    pricePerMin: 1.5,
    helmetAvailable: true,
    lat: 12.9772,
    lng: 77.5735,
    status: 'available',
  },
  {
    id: 'bike-102',
    model: 'GoRide Rapid Commuter V2',
    dockName: 'Cubbon Park Station Gate 3',
    batteryPercent: 82,
    rangeKm: 42,
    qrCode: 'GORIDE-EV-8204',
    pricePerMin: 1.5,
    helmetAvailable: true,
    lat: 12.9740,
    lng: 77.5910,
    status: 'available',
  },
  {
    id: 'bike-103',
    model: 'GoRide Smart EV Bike X1',
    dockName: 'MG Road Metro Boulevard',
    batteryPercent: 88,
    rangeKm: 46,
    qrCode: 'GORIDE-EV-4419',
    pricePerMin: 1.5,
    helmetAvailable: true,
    lat: 12.9754,
    lng: 77.6070,
    status: 'available',
  },
  {
    id: 'bike-104',
    model: 'GoRide Electric Cruiser',
    dockName: 'Indiranagar 100ft Road Stand',
    batteryPercent: 96,
    rangeKm: 55,
    qrCode: 'GORIDE-EV-7730',
    pricePerMin: 1.5,
    helmetAvailable: true,
    lat: 12.9780,
    lng: 77.6412,
    status: 'available',
  },
  {
    id: 'bike-105',
    model: 'GoRide EcoPedal Assist',
    dockName: 'Trinity Circle Metro Bay',
    batteryPercent: 74,
    rangeKm: 36,
    qrCode: 'GORIDE-EV-2195',
    pricePerMin: 1.2,
    helmetAvailable: true,
    lat: 12.9730,
    lng: 77.6175,
    status: 'available',
  }
];

// Initial Live System & Transit Notifications
export const INITIAL_NOTIFICATIONS: import('../types/transit').TransitNotification[] = [
  {
    id: 'notif-1',
    title: '🏍️ GoRide SmartBike Unlocked',
    message: 'Scan the handlebar QR to unlock SmartBike #BK-101. Helmet is placed in the rear storage basket.',
    time: '2 mins ago',
    type: 'bike',
    read: false,
  },
  {
    id: 'notif-2',
    title: '⚡ Traffic Clearance Alert',
    message: 'MG Road flyover traffic moving at 35 km/h. Bike taxi and auto routes are 8 mins faster right now.',
    time: '12 mins ago',
    type: 'transit',
    read: false,
  },
  {
    id: 'notif-3',
    title: '🎟️ GoRide Daily Pass Active',
    message: 'Your unlimited Metro & Bus daily commuter pass is active. Valid until 11:59 PM today.',
    time: '45 mins ago',
    type: 'wallet',
    read: true,
  },
  {
    id: 'notif-4',
    title: '🚇 Metro Purple Line Frequency',
    message: 'Trains arriving every 3.5 minutes on Purple Line during evening rush hours.',
    time: '1 hour ago',
    type: 'alert',
    read: true,
  }
];

