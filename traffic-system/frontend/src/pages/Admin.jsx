import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertCircle, Plus } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-dark-800 border border-dark-700 p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
        <p className="text-gray-400 mb-8 text-sm">Protected area. Please sign in to manage traffic incidents.</p>
        
        <div className="space-y-4 text-left">
           <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
              <input type="text" placeholder="admin" className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white mt-1" />
           </div>
           <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white mt-1" />
           </div>
           <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
           >
             Secure Login
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Control Center</h1>
          <p className="text-gray-400">Manual incident override and road management.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
          <Plus size={20} />
          Report Incident
        </button>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-dark-700/50 border-b border-dark-600">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Incident</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {[
              { type: 'Accident', location: 'Richmond Circle', status: 'Active', color: 'text-red-500' },
              { type: 'Road Work', location: 'Bannerghatta Rd', status: 'Pending', color: 'text-amber-500' },
              { type: 'Signal Failure', location: 'Koramangala 4th Block', status: 'Resolved', color: 'text-emerald-500' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-dark-700/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{row.type}</td>
                <td className="px-6 py-4 text-gray-400">{row.location}</td>
                <td className="px-6 py-4 font-bold">
                  <span className={`px-3 py-1 rounded-full bg-opacity-10 text-xs ${row.color.replace('text-', 'bg-')}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-white"><Eye size={16} /></button>
                    <button className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-white"><AlertCircle size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;

