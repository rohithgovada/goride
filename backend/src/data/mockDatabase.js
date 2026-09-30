// Mock In-Memory Database for GoRide Platform

export const TRANSIT_STATIONS = [
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
    id: 'st-metro-6',
    name: 'Indiranagar Metro Station',
    lat: 12.9784,
    lng: 77.6408,
    type: 'metro_station',
    lines: ['Purple Line'],
    nextArrivalMinutes: [4, 10],
  },
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
    id: 'st-bus-4',
    name: 'Domlur TTMC Bus Station',
    lat: 12.9609,
    lng: 77.6387,
    type: 'bus_stop',
    lines: ['500-D', '335-E', 'MF-12'],
    nextArrivalMinutes: [1, 9, 18],
  }
];

export const ACTIVE_BOOKINGS = new Map();
