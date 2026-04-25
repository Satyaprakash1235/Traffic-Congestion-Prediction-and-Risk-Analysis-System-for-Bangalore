import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Zap, Leaf, AlertCircle } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const LOCATIONS = {
  'MG Road': [12.9734, 77.6067],
  'Electronic City': [12.8483, 77.6611],
  'Silk Board': [12.9172, 77.6228],
  'Marathahalli': [12.9562, 77.7011],
  'Hebbal': [13.0382, 77.5919],
  'Indiranagar': [12.9714, 77.6414],
  'Whitefield': [12.9698, 77.7500],
  'Koramangala': [12.9354, 77.6141]
};

const RoutePlanner = () => {
  const [source, setSource] = useState('MG Road');
  const [dest, setDest] = useState('Electronic City');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [sourceCoords, setSourceCoords] = useState(LOCATIONS['MG Road']);
  const [destCoords, setDestCoords] = useState(LOCATIONS['Electronic City']);
  const [dynamicRoute, setDynamicRoute] = useState([]);
  const [weatherCondition, setWeatherCondition] = useState({ main: 'Clear', hasRain: 0 });

  React.useEffect(() => {
    fetch('http://localhost:8001/weather')
      .then(res => res.json())
      .then(data => {
        if (data && data.weather && data.weather.length > 0) {
          const mainWeather = data.weather[0].main;
          setWeatherCondition({
            main: mainWeather,
            hasRain: mainWeather.toLowerCase().includes('rain') ? 1 : 0
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    const sCoord = LOCATIONS[source] || [12.9716, 77.5946];
    const dCoord = LOCATIONS[dest] || [12.95, 77.65];
    setSourceCoords(sCoord);
    setDestCoords(dCoord);

    try {
      const [predRes, routeRes] = await Promise.all([
        fetch('http://localhost:8001/traffic/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            road_name: source,
            time_of_day: new Date().getHours(),
            day_of_week: new Date().getDay(),
            weather: weatherCondition.main,
            rainfall: weatherCondition.hasRain,
            avg_speed: 25,
            vehicle_count: 50
          })
        }),
        fetch('http://localhost:8001/route/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: { lat: sCoord[0], lon: sCoord[1] },
            destination: { lat: dCoord[0], lon: dCoord[1] }
          })
        })
      ]);
      
      const predData = await predRes.json();
      setPrediction(predData);

      const routeData = await routeRes.json();
      if (routeData && routeData.routes && routeData.routes.length > 0) {
        const points = routeData.routes[0].legs[0].points;
        const mappedPoints = points.map(pt => [pt.latitude, pt.longitude]);
        setDynamicRoute(mappedPoints);
      } else {
        setDynamicRoute([]);
      }
    } catch (err) {
      console.error("Prediction or routing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const routes = [
    { type: 'AI Recommended', time: prediction ? prediction.estimated_time || '45 mins' : '45 mins', distance: '18 km', icon: Zap, color: 'text-primary' },
    { type: 'Least Congested', time: '52 mins', distance: '22 km', icon: Navigation, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Route Planner</h1>
          <p className="text-gray-400">Optimal pathfinding with real-time AI congestion forecasting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Source Point</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <select 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-12 pr-10 py-3 text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
               <div className="bg-primary p-2 rounded-full shadow-lg shadow-primary/20">
                  <ArrowRight size={16} className="rotate-90 text-white" />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Destination Point</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-danger" size={18} />
                <select 
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-12 pr-10 py-3 text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              {loading ? 'Analyzing...' : 'Predict & Route'}
            </button>
          </div>

          {prediction && (
            <div className={`p-5 rounded-3xl flex gap-4 items-start border shadow-xl ${prediction.prediction === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
               <div className={`p-2 rounded-xl ${prediction.prediction === 'High' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                  <AlertCircle size={20} />
               </div>
               <div>
                 <p className="font-bold text-sm uppercase tracking-wider mb-1">AI Analysis</p>
                 <p className="text-sm opacity-90">
                   Expected congestion: <span className="font-black uppercase">{prediction.prediction}</span><br/>
                   Traffic Probability: {Math.round(prediction.probability * 100)}%
                 </p>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden h-[450px] shadow-2xl relative">
              <MapComponent selectedSource={sourceCoords} selectedDest={destCoords} dynamicRoute={dynamicRoute} />
              <div className="absolute top-4 left-4 z-[1000] bg-dark-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-gray-300">
                Live Routing Layer Enabled
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {routes.map((route, i) => (
               <div key={i} className="bg-dark-800 border border-dark-700 p-5 rounded-3xl flex items-center justify-between hover:border-primary transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl bg-dark-700 flex items-center justify-center ${route.color} group-hover:scale-105 transition-transform`}>
                        <route.icon size={24} />
                     </div>
                     <div>
                        <h4 className="text-white font-bold text-base">{route.type}</h4>
                        <p className="text-gray-500 text-xs">{route.distance} • Optimal Path</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-xl font-black ${route.color}`}>{route.time}</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">EST. Time</p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
