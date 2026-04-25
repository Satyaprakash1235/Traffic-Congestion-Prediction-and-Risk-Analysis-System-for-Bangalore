import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { Activity, Users, Clock, AlertTriangle, Search, Zap, MapPin } from 'lucide-react';

const LOCATIONS = {
  'MG Road': [12.9734, 77.6067],
  'Electronic City': [12.8483, 77.6611],
  'Silk Board': [12.9172, 77.6228],
  'Marathahalli': [12.9562, 77.7011],
  'Hebbal': [13.0382, 77.5919],
  'Indiranagar': [12.9714, 77.6414]
};

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <div className={`glass-card p-6 rounded-3xl animate-fade-in group hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]`} style={{ animationDelay: delay }}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-[0.08] text-${color.split('-')[1]}-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-white/5 py-1 px-3 rounded-full">Live</span>
    </div>
    <h3 className="text-gray-400 text-sm font-semibold mb-1">{title}</h3>
    <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
  </div>
);

const LiveMap = () => {
  const [stats, setStats] = useState({
    total_congested_roads: 0,
    avg_speed: 0,
    peak_hours: 'Calculating...',
    active_vehicles: '12.4k'
  });

  const [routing, setRouting] = useState({
    source: 'MG Road',
    dest: 'Silk Board',
    loading: false,
    prediction: null,
    routeGeometry: []
  });

  useEffect(() => {
    fetch('http://localhost:8001/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats({...stats, ...data}))
      .catch(err => console.error(err));
  }, []);

  const handleRouteSearch = async () => {
    setRouting(prev => ({ ...prev, loading: true }));
    const sCoord = LOCATIONS[routing.source];
    const dCoord = LOCATIONS[routing.dest];

    try {
      const [predRes, routeRes] = await Promise.all([
        fetch('http://localhost:8001/traffic/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            road_name: routing.source,
            time_of_day: new Date().getHours(),
            day_of_week: new Date().getDay(),
            vehicle_count: 50,
            avg_speed: 25
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
      const routeData = await routeRes.json();

      let geometry = [];
      if (routeData && routeData.routes && routeData.routes.length > 0) {
        geometry = routeData.routes[0].legs[0].points.map(pt => [pt.latitude, pt.longitude]);
      }

      setRouting(prev => ({
        ...prev,
        prediction: predData,
        routeGeometry: geometry,
        loading: false
      }));
    } catch (err) {
      console.error(err);
      setRouting(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-10 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Bengaluru <span className="gradient-text">Smart Traffic</span></h1>
          <p className="text-gray-400 font-medium text-sm">Real-time congestion monitoring and AI-powered forecasting network.</p>
        </div>
        <div className="flex items-center gap-3 glass-card p-3 px-5 rounded-2xl">
          <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-300">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Congested Roads" 
          value={stats.total_congested_roads} 
          icon={AlertTriangle} 
          color="bg-danger" 
          delay="0.1s"
        />
        <StatCard 
          title="Avg. City Speed" 
          value={`${stats.avg_speed} km/h`} 
          icon={Activity} 
          color="bg-primary" 
          delay="0.2s"
        />
        <StatCard 
          title="Active Vehicles" 
          value="14.8k" 
          icon={Users} 
          color="bg-secondary" 
          delay="0.3s"
        />
        <StatCard 
          title="Peak Status" 
          value={new Date().getHours() >= 17 || new Date().getHours() <= 10 ? "Active" : "Normal"} 
          icon={Clock} 
          color="bg-accent" 
          delay="0.4s"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card p-4 rounded-3xl flex flex-wrap gap-4 items-end relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="flex-1 min-w-[150px] relative z-10">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Source Node</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <select 
                  value={routing.source} 
                  onChange={(e) => setRouting({...routing, source: e.target.value})}
                  className="w-full bg-white/5 hover:bg-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-medium outline-none border border-white/5 appearance-none cursor-pointer"
                >
                  {Object.keys(LOCATIONS).map(l => <option key={l} value={l} className="bg-dark-800">{l}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px] relative z-10">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Destination Node</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-danger" />
                <select 
                  value={routing.dest} 
                  onChange={(e) => setRouting({...routing, dest: e.target.value})}
                  className="w-full bg-white/5 hover:bg-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-medium outline-none border border-white/5 appearance-none cursor-pointer"
                >
                  {Object.keys(LOCATIONS).map(l => <option key={l} value={l} className="bg-dark-800">{l}</option>)}
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleRouteSearch}
              className="bg-primary hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] z-10 w-full sm:w-auto"
            >
              {routing.loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
              <span>{routing.loading ? 'Scanning...' : 'Optimize'}</span>
            </button>
          </div>

          <div className="relative group min-h-[500px]">
            <div className="absolute top-4 right-4 z-[1000] space-y-2">
              {routing.prediction && (
                <div className="bg-dark-900/90 backdrop-blur border border-white/10 p-3 rounded-xl shadow-2xl animate-in slide-in-from-right duration-500">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">AI Prediction</p>
                  <p className={`text-lg font-black ${routing.prediction.congestion_level === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {routing.prediction.congestion_level} Traffic
                  </p>
                  <p className="text-[10px] text-gray-400">Prob: {Math.round(routing.prediction.probability * 100)}%</p>
                </div>
              )}
            </div>
            <MapComponent 
              selectedSource={LOCATIONS[routing.source]} 
              selectedDest={LOCATIONS[routing.dest]} 
              dynamicRoute={routing.routeGeometry}
            />
          </div>
        </div>
        
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl font-bold text-white tracking-tight">Live Road Integrity</h2>
          <div className="space-y-3">
            {stats.top_5_roads && stats.top_5_roads.map((road, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${road.level === 'High' ? 'bg-danger shadow-[0_0_8px_#f43f5e] animate-pulse' : road.level === 'Medium' ? 'bg-accent' : 'bg-secondary'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-white">{road.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">{road.level} Congestion</p>
                  </div>
                </div>
                <div className="text-right">
                   <Zap size={18} className={road.level === 'High' ? 'text-danger' : 'text-gray-600'} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card border border-primary/20 p-5 rounded-3xl relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
             <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  <Zap size={18} />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">AI Insight</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed font-medium relative z-10">
                Traffic around <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">Silk Board</span> is expected to increase by 15% due to incoming evening peak flow. Consider Richmond Road for alternatives.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
