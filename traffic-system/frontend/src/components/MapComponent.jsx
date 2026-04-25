import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BANGALORE_CENTER = [12.9716, 77.5946];
const BANGALORE_BOUNDS = [
  [12.73, 77.35], // Expanded South-West bound
  [13.24, 77.88]  // Expanded North-East bound
];

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Add heatmap layer with a small delay to ensure container height is ready
    const timer = setTimeout(() => {
      const container = map.getContainer();
      if (container.offsetHeight === 0) return;

      const heatLayer = L.heatLayer(points, {
        radius: 40,
        blur: 25,
        maxZoom: 14,
        gradient: { 0.2: 'yellow', 0.5: 'orange', 1: 'red' }
      }).addTo(map);

      return () => {
        if (map && heatLayer) {
          map.removeLayer(heatLayer);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [map, points]);

  return null;
};

const MapComponent = ({ selectedSource, selectedDest, dynamicRoute }) => {
  const [trafficData, setTrafficData] = useState([]);
  
  // Twitter events fetched via Grok API
  const [tweetEvents, setTweetEvents] = useState([]);
  
  useEffect(() => {
    // Fetch live alerts from backend Grok integration (which parses live X disruptions)
    fetch('http://localhost:8001/alerts')
      .then(res => res.json())
      .then(data => setTweetEvents(data))
      .catch(err => console.error("Error fetching alerts:", err));
  }, []);
  
  // Mock road segments with traffic levels for visualization
  const segments = [
    { 
      name: "MG Road", 
      path: [[12.9734, 77.6067], [12.9754, 77.6167]], 
      level: "High", 
      color: "#ef4444" 
    },
    { 
      name: "Outer Ring Road (Marathahalli)", 
      path: [[12.9562, 77.7011], [12.9362, 77.6911]], 
      level: "Medium", 
      color: "#f59e0b" 
    },
    { 
      name: "Indiranagar 100ft Rd", 
      path: [[12.9714, 77.6414], [12.9614, 77.6414]], 
      level: "Low", 
      color: "#10b981" 
    }
  ];

  // Synthesized heat map points for traffic congestion in Bangalore [lat, lng, intensity]
  const heatPoints = [
    [12.9172, 77.6228, 1.0], // Silk Board
    [12.9562, 77.7011, 0.9], // Marathahalli
    [12.9734, 77.6067, 0.8], // MG Road
    [13.0382, 77.5919, 0.7], // Hebbal
    [12.8483, 77.6611, 0.6], // Electronic City
    [12.9362, 77.6911, 0.5], // ORR
    [12.9272, 77.5806, 0.5], // Jayanagar
    [12.9354, 77.6141, 0.6], // Koramangala
  ];

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden shadow-2xl relative border border-dark-700"
      style={{ height: '500px' }}
    >
      <MapContainer 
        center={selectedSource || BANGALORE_CENTER} 
        zoom={13} 
        minZoom={11}
        maxBounds={BANGALORE_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* TomTom Traffic Layer Overlay */}
        <TileLayer
          attribution='&copy; <a href="https://www.tomtom.com/en_gb/traffic-index/">TomTom</a> Traffic'
          url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${import.meta.env.VITE_TOMTOM_API_KEY || "Me7NZ4sXdnx87VqtXt15huXvff1m8s6M"}&thickness=5`}
          opacity={0.9}
        />
        
        <HeatmapLayer points={heatPoints} />
        
        {selectedSource && (
          <Marker position={selectedSource}>
            <Popup>Source: Starting point</Popup>
          </Marker>
        )}

        {selectedDest && (
          <Marker position={selectedDest}>
            <Popup>Destination: Target location</Popup>
          </Marker>
        )}
        
        {segments.map((seg, idx) => (
          <Polyline 
            key={idx} 
            positions={seg.path} 
            color={seg.color} 
            weight={6}
            opacity={0.8}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-dark-900">{seg.name}</h3>
                <p className="text-sm text-dark-700">Level: <span style={{color: seg.color}}>{seg.level}</span> Traffic</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {dynamicRoute && dynamicRoute.length > 0 && (
          <Polyline 
            positions={dynamicRoute} 
            color="#3b82f6" 
            weight={8}
            opacity={0.9}
            dashArray="10, 10"
            className="animate-pulse"
          >
            <Popup>Predicted Optimal Route</Popup>
          </Polyline>
        )}

        {tweetEvents.map((tweet) => (
          <Marker key={`tweet-${tweet.id}`} position={tweet.location}>
            <Popup>
              <div className="p-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-blue-500 text-white rounded-full p-1 shadow">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{tweet.time}</span>
                </div>
                <p className="text-sm text-dark-800">{tweet.text}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {!selectedSource && <Marker position={BANGALORE_CENTER}>
          <Popup>
            <span className="font-bold">Bangalore City Center</span>
          </Popup>
        </Marker>}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] glass-morphism p-4 rounded-xl shadow-xl border border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Traffic Intensity</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1.5 bg-red-500 rounded-full" />
            <span className="text-xs text-gray-300">High Congestion</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-1.5 bg-amber-500 rounded-full" />
            <span className="text-xs text-gray-300">Moderate</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-xs text-gray-300">Low Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
