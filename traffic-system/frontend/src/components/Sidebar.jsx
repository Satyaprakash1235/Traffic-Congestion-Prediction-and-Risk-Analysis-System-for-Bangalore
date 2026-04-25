import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Zap, Navigation, Bell, Settings, Home, Shield, Cloud, CloudRain, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Live Map', path: '/map', icon: Map },
    { name: 'Prediction', path: '/prediction', icon: Zap },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Route Planner', path: '/route', icon: Navigation },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8001/weather')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error("Weather error:", err));
  }, []);

  return (
    <div className="w-64 h-screen bg-transparent border-r border-white/5 flex flex-col fixed left-0 top-0 overflow-y-auto z-50 animate-fade-in backdrop-blur-md">
      <div className="p-6 border-b border-dark-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Zap size={24} />
        </div>
        <h1 className="text-xl font-extrabold gradient-text tracking-tight">
          Smart Blr
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-white/10 text-primary border border-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        {weather && weather.main && (
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Weather</p>
              <p className="text-lg font-bold text-white">{Math.round(weather.main.temp)}°C</p>
              <p className="text-[10px] text-gray-400 capitalize">{weather.weather[0].description}</p>
            </div>
            <div className="text-primary">
              {weather.weather[0].main.includes('Rain') ? <CloudRain size={24} /> : weather.weather[0].main.includes('Cloud') ? <Cloud size={24} /> : <Sun size={24} />}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mb-2">Live Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

