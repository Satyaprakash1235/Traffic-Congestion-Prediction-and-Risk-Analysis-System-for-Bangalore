import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, Navigation, Bell, BarChart3, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="glass-card p-6 rounded-3xl animate-fade-in group hover:bg-white/5 transition-all duration-500" style={{ animationDelay: delay }}>
    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 md:py-20 animate-fade-in">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Zap size={14} className="animate-pulse" />
            AI-Powered Traffic Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Revolutionizing Bengaluru <br/>
            <span className="gradient-text italic">Urban Mobility</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Harnessing Machine Learning and Real-time Geodata to predict congestion, optimize routes, and keep the Garden City moving.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <button 
              onClick={() => navigate('/map')}
              className="px-10 py-5 bg-primary hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              Explore Live Map
            </button>
            <button 
              onClick={() => navigate('/route')}
              className="px-10 py-5 glass-panel text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Plan Optimized Route
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass-panel rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="/images/hero.png" 
              alt="Smart Traffic Concept" 
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
            {/* HUD Elements */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Neural Engine</span>
               </div>
               <span className="text-[10px] font-bold text-primary uppercase">v4.1.0-STABLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Core System Architecture</h2>
          <p className="text-gray-400 font-medium">Built on top of modern data pipelines to ensure zero-latency insights for every commuter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Activity}
            title="Real-time Flow Monitoring"
            description="Direct integration with TomTom Traffic APIs provides millisecond-accurate road speeds across Bangalore."
            delay="0.1s"
          />
          <FeatureCard 
            icon={BarChart3}
            title="AI Congestion Forecast"
            description="Our Random Forest models analyze historical data, weather, and time patterns to predict jams 60 minutes ahead."
            delay="0.2s"
          />
          <FeatureCard 
            icon={Navigation}
            title="Route Optimization"
            description="Intelligent pathfinding that avoids bottlenecks, optimizing for time, fuel, and environmental impact."
            delay="0.3s"
          />
          <FeatureCard 
            icon={Bell}
            title="Crowd-sourced Alerts"
            description="Advanced NLP scrapes social media feeds (X/Grok) to detect accidents and water-logging within minutes."
            delay="0.4s"
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Weather Safety"
            description="Live weather integration from OpenWeather helps you navigate safely during monsoons and storms."
            delay="0.5s"
          />
          <FeatureCard 
            icon={Zap}
            title="Peak Hour Analysis"
            description="Detailed heatmaps showing peak shift trends across various zones like Silk Board, Hebbal, and ORR."
            delay="0.6s"
          />
        </div>
      </section>

      {/* Stats/Call to action */}
      <section className="mt-20 glass-card p-12 rounded-[3rem] text-center space-y-8 border-primary/20 shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <h2 className="text-3xl md:text-5xl font-black text-white">Experience the Future of Smart Transit</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Join thousands of Bengaluru citizens using intelligent data to reclaim their time and navigate the city more efficiently.
        </p>
        <button 
          onClick={() => navigate('/map')}
          className="px-12 py-5 bg-white text-dark-900 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all flex items-center gap-3 mx-auto"
        >
          Get Started <Navigation size={24} />
        </button>
      </section>
    </div>
  );
};

export default Home;
