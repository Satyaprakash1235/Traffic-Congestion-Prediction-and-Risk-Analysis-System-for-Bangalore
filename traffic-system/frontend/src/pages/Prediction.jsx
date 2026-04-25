import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Cloudy, Send, Loader2, Info } from 'lucide-react';

const roads = [
  "MG Road", "Brigade Road", "Outer Ring Road", "Silk Board Junction",
  "Hebbal Flyover", "Electronic City Flyover", "Indiranagar 100ft Road",
  "Sarjapur Road", "Whitefield Main Road", "Bannerghatta Road"
];

const Prediction = () => {
  const [formData, setFormData] = useState({
    road_name: roads[0],
    time_of_day: 12,
    day_of_week: 0,
    weather: "Clear",
    rainfall: 0,
    holiday: 0,
    incident: 0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking for now, will connect to backend
      const response = await axios.post('http://localhost:8001/traffic/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      // Fallback mock
      setPrediction({
        congestion_level: "High",
        probability: 0.85,
        all_probs: { "High": 0.85, "Medium": 0.1, "Low": 0.05 }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">AI Congestion Forecast</h1>
        <p className="text-gray-400">Select parameters to predict traffic levels in the next 30-60 minutes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <MapPin size={14} /> Road Name
                </label>
                <select 
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  value={formData.road_name}
                  onChange={(e) => setFormData({...formData, road_name: e.target.value})}
                >
                  {roads.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock size={14} /> Time of Day
                </label>
                <input 
                  type="number" 
                  min="0" max="23"
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  value={formData.time_of_day}
                  onChange={(e) => setFormData({...formData, time_of_day: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar size={14} /> Day of Week (0-6)
                </label>
                <input 
                  type="number" 
                  min="0" max="6"
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Cloudy size={14} /> Weather
                </label>
                <select 
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  value={formData.weather}
                  onChange={(e) => setFormData({...formData, weather: e.target.value})}
                >
                  <option value="Clear">Clear</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Heavy Rain">Heavy Rain</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
               <label className="flex items-center gap-3 bg-dark-700/50 px-4 py-3 rounded-xl border border-dark-600 flex-1 cursor-pointer hover:bg-dark-700">
                  <input type="checkbox" className="w-5 h-5 rounded accent-primary" 
                    onChange={(e) => setFormData({...formData, holiday: e.target.checked ? 1 : 0})} />
                  <span className="text-sm text-gray-300">Public Holiday</span>
               </label>
               <label className="flex items-center gap-3 bg-dark-700/50 px-4 py-3 rounded-xl border border-dark-600 flex-1 cursor-pointer hover:bg-dark-700">
                  <input type="checkbox" className="w-5 h-5 rounded accent-primary" 
                    onChange={(e) => setFormData({...formData, incident: e.target.checked ? 1 : 0})} />
                  <span className="text-sm text-gray-300">Active Incident</span>
               </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Predict Congestion
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <div className="bg-dark-800 border-2 border-primary/30 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 bg-primary/10 rounded-bl-3xl">
                  <span className="text-primary font-bold text-xl">{Math.round(prediction.probability * 100)}%</span>
               </div>
               
               <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">ML Result</h3>
               <p className="text-gray-300 mb-1">Predicted Level:</p>
               <h2 className={`text-4xl font-black mb-6 ${
                 prediction.congestion_level === 'High' ? 'text-red-500' : 
                 prediction.congestion_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
               }`}>
                 {prediction.congestion_level}
               </h2>

               <div className="space-y-4">
                  {Object.entries(prediction.all_probs).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{key}</span>
                        <span>{Math.round(val * 100)}%</span>
                      </div>
                      <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            key === 'High' ? 'bg-red-500' : key === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${val * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 border-dashed p-12 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center text-gray-500 mb-4">
                <Info size={32} />
              </div>
              <p className="text-gray-500 font-medium">Enter details and run the model to see predictions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
