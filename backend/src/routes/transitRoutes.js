import express from 'express';
import { TRANSIT_STATIONS, ACTIVE_BOOKINGS } from '../data/mockDatabase.js';

export const transitRouter = express.Router();

// Helper to calculate approximate distance in KM using Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// 1. Get Transport Modes Overview & Status
transitRouter.get('/modes', (req, res) => {
  res.json({
    success: true,
    modes: [
      {
        id: 'smart',
        title: 'Smart Combined Multi-Modal',
        description: 'Combines Metro, Shared Autos, and Walking to beat peak traffic',
        speedKmH: 28,
        costPerKm: 6.5,
        co2SavedKgPerKm: 0.25,
      },
      {
        id: 'bike',
        title: 'GoRide Bike Taxi',
        description: 'Doorstep rapid 2-wheeler instant dispatch',
        speedKmH: 26,
        costPerKm: 9.5,
        co2SavedKgPerKm: 0.08,
      },
      {
        id: 'auto',
        title: 'Auto Rickshaw',
        description: 'Metered & shared auto with direct doorstep drop',
        speedKmH: 20,
        costPerKm: 15.0,
        co2SavedKgPerKm: 0.12,
      },
      {
        id: 'bus',
        title: 'City Express Bus',
        description: 'Low-floor AC and non-AC public bus network',
        speedKmH: 16,
        costPerKm: 3.5,
        co2SavedKgPerKm: 0.32,
      },
      {
        id: 'train',
        title: 'Metro & Commuter Rail',
        description: 'Traffic-free rapid transit with digital QR gating',
        speedKmH: 35,
        costPerKm: 5.0,
        co2SavedKgPerKm: 0.30,
      },
    ],
  });
});

// 2. Get Transit Stations
transitRouter.get('/stations', (req, res) => {
  res.json({
    success: true,
    count: TRANSIT_STATIONS.length,
    stations: TRANSIT_STATIONS,
  });
});

// 3. Search Multi-Modal Routes between Origin and Destination
transitRouter.post('/search', (req, res) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({
      success: false,
      message: 'Both origin and destination coordinates are required.',
    });
  }

  const distanceKm = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) || 7.2;

  // Generate simulated route options
  const routes = [
    {
      id: `smart-${Date.now()}`,
      category: 'smart',
      title: 'Smart Combined Multi-Modal',
      subType: 'Metro Line 1 + Short Walk / Shared Auto',
      distanceKm: distanceKm,
      durationMinutes: Math.round(distanceKm * 2.8),
      price: Math.max(30, Math.round(distanceKm * 6)),
      badges: ['Recommended', 'Fastest', 'Eco Choice'],
      waitMins: 3,
      rating: 4.9,
    },
    {
      id: `bike-${Date.now()}`,
      category: 'bike',
      title: 'GoRide Bike Taxi',
      subType: 'Rapid 2-Wheeler • Helmet provided',
      distanceKm: distanceKm,
      durationMinutes: Math.round(distanceKm * 2.5),
      price: Math.max(40, Math.round(distanceKm * 9.5)),
      badges: ['Fastest for Solo', 'Door to Door'],
      waitMins: 2,
      rating: 4.8,
    },
    {
      id: `auto-${Date.now()}`,
      category: 'auto',
      title: 'GoRide Auto Rickshaw',
      subType: 'Metered EV / CNG Auto',
      distanceKm: distanceKm,
      durationMinutes: Math.round(distanceKm * 3.4),
      price: Math.max(60, Math.round(distanceKm * 15)),
      badges: ['Comfort', 'Group Friendly'],
      waitMins: 4,
      rating: 4.7,
    },
    {
      id: `bus-${Date.now()}`,
      category: 'bus',
      title: 'City Express Bus',
      subType: 'Electric Low-Floor AC Bus',
      distanceKm: distanceKm + 0.8,
      durationMinutes: Math.round(distanceKm * 4.5),
      price: 25,
      badges: ['Cheapest', 'Low Carbon'],
      waitMins: 5,
      rating: 4.5,
    },
    {
      id: `train-${Date.now()}`,
      category: 'train',
      title: 'Metro Rapid Rail',
      subType: 'Namma Metro Express Line',
      distanceKm: distanceKm,
      durationMinutes: Math.round(distanceKm * 2.7),
      price: 35,
      badges: ['Traffic Free', 'High Punctuality'],
      waitMins: 4,
      rating: 4.9,
    }
  ];

  res.json({
    success: true,
    origin,
    destination,
    distanceKm,
    routes,
  });
});

// 4. Book a Ride or Issue a Digital Pass
transitRouter.post('/book', (req, res) => {
  const { tripId, category, price, passengerName } = req.body;
  const bookingId = `GR-${Math.floor(100000 + Math.random() * 900000)}`;

  const booking = {
    bookingId,
    tripId,
    category,
    price,
    passengerName: passengerName || 'Rohit K',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    driver: category === 'bike' || category === 'auto' ? {
      name: 'Rajesh Kumar',
      vehicleNumber: 'KA-04-ER-9912',
      vehicleModel: category === 'bike' ? 'TVS Apache RTR 160' : 'Bajaj Compact RE (EV)',
      rating: 4.88,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      etaMinutes: 2,
    } : null,
    ticket: category === 'bus' || category === 'train' || category === 'smart' ? {
      ticketCode: `QR-${Math.floor(100000 + Math.random() * 900000)}`,
      validHours: 2,
      gateNfcToken: 'NFC-PASS-TOKEN-7712'
    } : null
  };

  ACTIVE_BOOKINGS.set(bookingId, booking);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully',
    booking,
  });
});

// 5. Check Live Booking Telemetry
transitRouter.get('/booking/:id', (req, res) => {
  const booking = ACTIVE_BOOKINGS.get(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  res.json({
    success: true,
    booking,
  });
});
