# 🚦 Smart Bengaluru Traffic System

An advanced, AI-driven traffic congestion prediction and risk analysis system specifically designed for the unique urban challenges of Bengaluru.

![Project Preview](/traffic-system/frontend/public/images/hero.png)

## 🌟 Key Features

- **Real-time Traffic Monitoring:** Live flow data integration using TomTom APIs for millisecond-accurate insights.
- **AI Congestion Forecasting:** High-precision Machine Learning (Random Forest) models predicting traffic levels 60 minutes ahead.
- **Dynamic Route Optimization:** Intelligent pathfinding that calculates the most efficient routes based on live bottlenecks.
- **Social Alert Scraper:** Real-time extraction of traffic disruptions (accidents, water-logging) from X/Grok feeds using NLP.
- **Weather-Aware Analytics:** Integration with OpenWeather API to account for rain and storms in traffic risk models.
- **Premium 3D UI:** An immersive, glassmorphic dashboard with 3D city visuals and entrance animations.

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, Leaflet Maps, Lucide Icons, Recharts.
- **Backend:** FastAPI (Python), MongoDB, Uvicorn.
- **Machine Learning:** Scikit-learn (Random Forest), Pandas, NumPy.
- **APIs:** TomTom Traffic API, OpenWeatherMap API, Grok/X AI Integration.

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.9+
- TomTom Developer Key
- OpenWeatherMap API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Satyaprakash1235/Traffic-Congestion-Prediction-and-Risk-Analysis-System-for-Bangalore.git
   cd Traffic-Congestion-Prediction-and-Risk-Analysis-System-for-Bangalore
   ```

2. **Backend Setup:**
   ```bash
   cd traffic-system/backend
   pip install -r requirements.txt
   # Ensure your .env is configured with API keys
   python main.py
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📊 Documentation

The system architecture leverages a **Multi-Agent AI** approach for data scraping and risk assessment, ensuring that traffic predictions are not just based on numbers, but also real-world events reported by citizens.

---
Developed with ❤️ for a Smarter Bengaluru.
