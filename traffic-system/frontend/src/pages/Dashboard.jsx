import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const data = [
  { time: '06:00', speed: 45, volume: 200 },
  { time: '08:00', speed: 20, volume: 800 },
  { time: '10:00', speed: 15, volume: 1200 },
  { time: '12:00', speed: 30, volume: 600 },
  { time: '14:00', speed: 35, volume: 500 },
  { time: '16:00', speed: 25, volume: 900 },
  { time: '18:00', speed: 10, volume: 1500 },
  { time: '20:00', speed: 18, volume: 1100 },
  { time: '22:00', speed: 40, volume: 300 },
];

const roadStats = [
  { name: 'Silk Board', congestion: 95, color: '#ef4444' },
  { name: 'ORR', congestion: 88, color: '#ef4444' },
  { name: 'Hebbal', congestion: 72, color: '#f59e0b' },
  { name: 'Indiranagar', congestion: 45, color: '#10b981' },
  { name: 'MG Road', congestion: 65, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-700 p-3 rounded-lg shadow-2xl">
        <p className="text-gray-400 text-xs mb-1 font-bold">{label}</p>
        <p className="text-primary text-sm font-bold">Speed: {payload[0].value} km/h</p>
        <p className="text-secondary text-sm font-bold">Volume: {payload[1].value} vph</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [stats, setStats] = useState(null);
  const [dynamicRoadStats, setDynamicRoadStats] = useState(roadStats);

  useEffect(() => {
    fetch('http://localhost:8001/weather')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error("Error fetching weather:", err));

    fetch('http://localhost:8001/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        if (data.top_5_roads) {
          const mappedStats = data.top_5_roads.map(road => ({
            name: road.name,
            congestion: road.level === 'High' ? Math.floor(Math.random() * 20) + 80 : road.level === 'Medium' ? Math.floor(Math.random() * 20) + 50 : 30,
            color: road.level === 'High' ? '#ef4444' : road.level === 'Medium' ? '#f59e0b' : '#10b981'
          }));
          setDynamicRoadStats(mappedStats);
        }
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        // Fallback to static if backend isn't ready
        setDynamicRoadStats(roadStats);
      });
  }, []);
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Traffic Analytics Dashboard</h1>
        <p className="text-gray-400">Deep dive into city-wide traffic trends and bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Velocity vs Traffic Volume (24h)</h3>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d30" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={3} />
                <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Top Congested Roads (Intensity %)</h3>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicRoadStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{fill: '#232326'}} contentStyle={{backgroundColor: '#161618', borderColor: '#232326', borderRadius: '8px'}} />
                <Bar dataKey="congestion" radius={[0, 4, 4, 0]} barSize={20}>
                  {dynamicRoadStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Real-time Weather</h3>
            {weather ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="bg-primary/20 p-4 rounded-full">
                    {weather.weather[0].main.includes('Rain') ? <CloudRain className="text-primary" size={32} /> : 
                     weather.weather[0].main.includes('Cloud') ? <Cloud className="text-primary" size={32} /> : 
                     <Sun className="text-amber-500" size={32} />}
                 </div>
                 <div className="text-center">
                    <p className="text-4xl font-black text-white">{Math.round(weather.main.temp)}°C</p>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">{weather.weather[0].description}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    <div className="bg-dark-700/50 p-3 rounded-xl flex items-center gap-2">
                       <Wind size={16} className="text-blue-400" />
                       <span className="text-xs text-white uppercase font-bold">{weather.wind.speed} m/s</span>
                    </div>
                    <div className="bg-dark-700/50 p-3 rounded-xl flex items-center gap-2">
                       <Cloud size={16} className="text-gray-400" />
                       <span className="text-xs text-white uppercase font-bold">{weather.main.humidity}%</span>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-10">
                 <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
              </div>
            )}
         </div>

         <div className="md:col-span-2 bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Traffic Outlook (Next 6h)</h3>
            <div className="space-y-4">
               {[
                 { hour: '20:00', status: 'Improving', color: 'bg-emerald-500' },
                 { hour: '21:00', status: 'Stable', color: 'bg-blue-500' },
                 { hour: '22:00', status: 'Clear', color: 'bg-emerald-500' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                    <span className="text-gray-300 font-bold">{item.hour}</span>
                    <div className="flex items-center gap-3">
                       <span className="text-sm text-gray-400">{item.status}</span>
                       <div className={`w-12 h-1.5 rounded-full ${item.color}`} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
