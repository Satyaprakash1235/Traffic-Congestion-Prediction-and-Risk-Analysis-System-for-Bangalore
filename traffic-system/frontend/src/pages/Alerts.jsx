import React from 'react';
import { Bell, AlertTriangle, CloudRain, Construction, Megaphone } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    { 
      id: 1, 
      type: 'Accident', 
      location: 'Silk Board Junction', 
      detail: 'Major pile-up on the flyover. Traffic backed up towards HSR Layout.', 
      time: '2 mins ago', 
      severity: 'Critical',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    { 
      id: 2, 
      type: 'Weather', 
      location: 'Indiranagar / MG Road', 
      detail: 'Heavy thundershowers reported. Waterlogging at Sony World junction.', 
      time: '15 mins ago', 
      severity: 'Moderate',
      icon: CloudRain,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      id: 3, 
      type: 'Roadwork', 
      location: 'Bannerghatta Road', 
      detail: 'Metro construction work narrowed the road to a single lane.', 
      time: '45 mins ago', 
      severity: 'High',
      icon: Construction,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    { 
      id: 4, 
      type: 'Event', 
      location: 'Chinnaswamy Stadium', 
      detail: 'IPL Match traffic diversions in place around Cubbon Park.', 
      time: '1 hour ago', 
      severity: 'Low',
      icon: Megaphone,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Alerts Feed</h1>
          <p className="text-gray-400">Stay updated with the latest road conditions and incidents.</p>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-900 bg-dark-700 flex items-center justify-center">
                <Bell size={16} className="text-gray-400" />
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-dark-800 border border-dark-700 p-6 rounded-3xl hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 ${alert.bg} rounded-bl-2xl font-bold text-xs ${alert.color}`}>
              {alert.severity}
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${alert.bg} ${alert.color} group-hover:scale-110 transition-transform`}>
                <alert.icon size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-lg">{alert.type} - {alert.location}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{alert.detail}</p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-gray-500 font-medium">{alert.time}</span>
                  <span className="text-gray-600">•</span>
                  <button className="text-xs text-primary font-bold hover:underline">View on Map</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
