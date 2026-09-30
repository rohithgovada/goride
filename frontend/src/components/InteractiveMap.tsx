import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  LocationPoint, 
  TripOption, 
  TransitStation, 
  TransportMode,
  BikeRental
} from '../types/transit';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  EyeOff,
  Bike,
  Sparkles
} from 'lucide-react';

interface InteractiveMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  selectedTrip: TripOption | null;
  selectedMode: TransportMode;
  stations: TransitStation[];
  bikes: BikeRental[];
  onSelectBike: (bike: BikeRental) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationProgress: number; // 0 to 100
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  selectedTrip,
  selectedMode,
  stations,
  bikes,
  onSelectBike,
  isSimulating,
  onToggleSimulation,
  simulationProgress,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const routeBgLayerRef = useRef<L.Polyline | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const bikesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showStations, setShowStations] = useState(true);
  const [showBikes, setShowBikes] = useState(true);

  // Colors per transport mode
  const getModeColor = (mode: TransportMode) => {
    switch (mode) {
      case 'bike':
        return '#f59e0b'; // Amber
      case 'auto':
        return '#10b981'; // Emerald
      case 'bus':
        return '#3b82f6'; // Blue
      case 'train':
        return '#a855f7'; // Purple
      default:
        return '#06b6d4'; // Cyan
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [origin.lat, origin.lng],
        zoom: 13,
        zoomControl: false,
      });

      // CartoDB Voyager tiles (High performance, crisp rendering, dark contrast)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control on top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      stationsLayerGroupRef.current = L.layerGroup().addTo(map);
      bikesLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map resizing to prevent any tile clipping glitches
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }
  }, []);

  // Update Origin and Destination Markers & Fit Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Origin Marker ("Where we are")
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
    }

    const originIcon = L.divIcon({
      className: 'pulse-user-marker',
      html: `
        <div class="ring"></div>
        <div class="dot"></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    originMarkerRef.current = L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
          <strong style="color: #2563eb;">📍 Where You Are (Origin)</strong><br/>
          <b>${origin.name}</b><br/>
          <span style="color: #64748b; font-size: 11px;">${origin.address}</span>
        </div>
      `);

    // 2. Destination Marker ("Where to move")
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
    }

    const destIcon = L.divIcon({
      className: 'dest-marker-custom',
      html: `
        <div style="
          width: 34px;
          height: 34px;
          background: #ef4444;
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 14px; font-weight: bold; color: white;">🎯</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: destIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
          <strong style="color: #dc2626;">🏁 Where You Have To Move</strong><br/>
          <b>${destination.name}</b><br/>
          <span style="color: #64748b; font-size: 11px;">${destination.address}</span>
        </div>
      `);

    // Fit bounds to show both origin and destination comfortably
    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ]);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [origin, destination]);

  // Update Route Polyline whenever selected trip changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedTrip) return;

    if (routeLayerRef.current) routeLayerRef.current.remove();
    if (routeBgLayerRef.current) routeBgLayerRef.current.remove();

    const coords = selectedTrip.coordinates;
    const modeColor = getModeColor(selectedTrip.mode);

    // Glowing background line
    routeBgLayerRef.current = L.polyline(coords, {
      color: modeColor,
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Main route line
    routeLayerRef.current = L.polyline(coords, {
      color: modeColor,
      weight: 4,
      opacity: 0.95,
      dashArray: selectedTrip.mode === 'all' ? '6, 8' : undefined,
      lineCap: 'round',
    }).addTo(map);

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [70, 70] });
  }, [selectedTrip]);

  // Update Transit Station Pins
  useEffect(() => {
    const layerGroup = stationsLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();
    if (!showStations) return;

    stations.forEach((st) => {
      let iconColor = '#3b82f6';
      let iconSymbol = '🚏';

      if (st.type === 'metro_station') {
        iconColor = '#8b5cf6';
        iconSymbol = '🚇';
      } else if (st.type === 'auto_stand') {
        iconColor = '#10b981';
        iconSymbol = '🛺';
      } else if (st.type === 'bike_hub') {
        iconColor = '#f59e0b';
        iconSymbol = '🚲';
      }

      const stationIcon = L.divIcon({
        className: 'station-pin',
        html: `
          <div style="
            width: 26px; 
            height: 26px; 
            background: #ffffff; 
            border: 2px solid ${iconColor}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            font-size: 13px;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([st.lat, st.lng], { icon: stationIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 170px;">
          <b style="color: ${iconColor};">${st.name}</b><br/>
          <div style="margin-top: 4px; font-size: 11px; color: #475569;">
            Lines: <b>${st.lines.join(', ')}</b>
          </div>
          <div style="margin-top: 4px; font-size: 11px; color: #059669; font-weight: bold;">
            Next Arrival: ${st.nextArrivalMinutes.map(m => `${m}m`).join(', ')}
          </div>
        </div>
      `);
      marker.addTo(layerGroup);
    });
  }, [stations, showStations]);

  // Update Interactive Bike Locations on Map
  useEffect(() => {
    const bikesLayer = bikesLayerGroupRef.current;
    if (!bikesLayer) return;

    bikesLayer.clearLayers();
    if (!showBikes) return;

    bikes.forEach((bike) => {
      const bikeIcon = L.divIcon({
        className: 'bike-hub-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #ffffff;
            border: 2.5px solid #f59e0b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
            font-size: 15px;
            position: relative;
            cursor: pointer;
          ">
            <span>🚲</span>
            <span style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: #10b981;
              color: white;
              font-size: 9px;
              font-weight: bold;
              padding: 1px 4px;
              border-radius: 9999px;
              border: 1px solid white;
            ">${bike.batteryPercent}%</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([bike.lat, bike.lng], { icon: bikeIcon });
      
      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.style.fontSize = '12px';
      popupContent.style.color = '#0f172a';
      popupContent.style.minWidth = '180px';
      popupContent.innerHTML = `
        <b style="color: #d97706;">⚡ ${bike.model}</b><br/>
        <span style="font-size: 11px; color: #64748b;">${bike.dockName}</span>
        <div style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
          <span>Battery: <b style="color: #059669;">${bike.batteryPercent}%</b></span>
          <span>Range: <b>${bike.rangeKm} km</b></span>
        </div>
        <div style="margin-top: 2px; font-size: 11px; color: #64748b;">
          Rate: <b>₹${bike.pricePerMin}/min</b> • Helmet Included
        </div>
        <button id="unlock-btn-${bike.id}" style="
          margin-top: 8px;
          width: 100%;
          padding: 6px;
          background: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 11px;
          cursor: pointer;
        ">📱 Scan QR & Unlock</button>
      `;

      // Attach button listener inside leaflet popup
      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`unlock-btn-${bike.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectBike(bike);
            marker.closePopup();
          };
        }
      });

      marker.addTo(bikesLayer);
    });
  }, [bikes, showBikes, onSelectBike]);

  // Update Moving Vehicle Simulator Marker along route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedTrip || selectedTrip.coordinates.length < 2) return;

    if (!isSimulating && simulationProgress === 0) {
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
        vehicleMarkerRef.current = null;
      }
      return;
    }

    // Interpolate coordinate along coordinates path
    const coords = selectedTrip.coordinates;
    const totalSegments = coords.length - 1;
    const progressClamped = Math.max(0, Math.min(100, simulationProgress)) / 100;
    const floatIndex = progressClamped * totalSegments;
    const currentIndex = Math.min(Math.floor(floatIndex), totalSegments - 1);
    const nextIndex = Math.min(currentIndex + 1, totalSegments);
    const subProgress = floatIndex - currentIndex;

    const p1 = coords[currentIndex];
    const p2 = coords[nextIndex];

    const currentLat = p1[0] + (p2[0] - p1[0]) * subProgress;
    const currentLng = p1[1] + (p2[1] - p1[1]) * subProgress;

    // Vehicle icon symbol
    let emoji = '🚀';
    if (selectedTrip.mode === 'bike') emoji = '🏍️';
    else if (selectedTrip.mode === 'auto') emoji = '🛺';
    else if (selectedTrip.mode === 'bus') emoji = '🚌';
    else if (selectedTrip.mode === 'train') emoji = '🚆';

    if (!vehicleMarkerRef.current) {
      const vIcon = L.divIcon({
        className: 'vehicle-active-marker',
        html: `
          <div style="
            width: 38px;
            height: 38px;
            background: #ffffff;
            border: 3px solid ${getModeColor(selectedTrip.mode)};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-size: 18px;
            position: relative;
          ">
            <span>${emoji}</span>
            <span style="
              position: absolute;
              bottom: -4px;
              right: -4px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #10b981;
              border: 2px solid white;
            "></span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      vehicleMarkerRef.current = L.marker([currentLat, currentLng], { icon: vIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      vehicleMarkerRef.current.setLatLng([currentLat, currentLng]);
    }
  }, [simulationProgress, isSimulating, selectedTrip]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !selectedTrip) return;
    const bounds = L.latLngBounds(selectedTrip.coordinates);
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
      
      {/* Real Leaflet Map DIV */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Header Info Badge */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-300 font-medium">Origin:</span>
            <span className="font-bold text-white max-w-[110px] sm:max-w-[150px] truncate">{origin.name}</span>
          </div>
          <span className="text-slate-500">➔</span>
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-slate-300 font-medium">Target:</span>
            <span className="font-bold text-white max-w-[110px] sm:max-w-[150px] truncate">{destination.name}</span>
          </div>
        </div>

        {selectedTrip && (
          <div className="bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-emerald-300 text-xs font-semibold shadow-lg flex items-center space-x-1.5">
            <span>{selectedTrip.distanceKm} km</span>
            <span>•</span>
            <span>~{selectedTrip.durationMinutes} mins</span>
          </div>
        )}
      </div>

      {/* Map Interactive Controls Panel (Bottom & Right) */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[400] flex flex-wrap items-center gap-2">
        
        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition active:scale-95"
          title="Fit Route Bounds"
        >
          <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
          <span>Fit View</span>
        </button>

        {/* Toggle Transit Stations */}
        <button
          onClick={() => setShowStations(!showStations)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition border ${
            showStations
              ? 'bg-slate-900/90 text-slate-200 border-slate-700/80'
              : 'bg-slate-800/60 text-slate-400 border-slate-800'
          }`}
          title="Toggle Stops & Stations"
        >
          {showStations ? <Eye className="h-3.5 w-3.5 text-blue-400" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{showStations ? 'Stations On' : 'Stations Off'}</span>
        </button>

        {/* Toggle Bike Hubs */}
        <button
          onClick={() => setShowBikes(!showBikes)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition border ${
            showBikes
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
              : 'bg-slate-800/60 text-slate-400 border-slate-800'
          }`}
          title="Toggle Electric Bikes & Docks"
        >
          <Bike className="h-3.5 w-3.5 text-amber-400" />
          <span>{showBikes ? 'Bikes (5 Docks)' : 'Bikes Off'}</span>
        </button>

        {/* Live Simulation Ride Demo Button */}
        <button
          onClick={onToggleSimulation}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition active:scale-95 border ${
            isSimulating
              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
          }`}
        >
          {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isSimulating ? `Moving (${Math.round(simulationProgress)}%)` : 'Simulate Live Route'}</span>
        </button>
      </div>

      {/* Transport Legend (Bottom Right on Desktop) */}
      <div className="hidden md:flex absolute bottom-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 space-x-3 shadow-lg">
        <div className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Origin</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Destination</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Bike Docks</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Metro</span>
        </div>
      </div>
    </div>
  );
};
