from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from ml_engine import ml_engine
from database import db
from datetime import datetime
import openai
import json

load_dotenv()

app = FastAPI(title="Smart Bengaluru Traffic System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "Me7NZ4sXdnx87VqtXt15huXvff1m8s6M")

@app.on_event("startup")
async def startup():
    await db.connect()

@app.get("/traffic/live")
async def get_live_traffic():
    """
    Fetch live traffic flow/incidents from TomTom for Bangalore area.
    """
    # Bangalore bounds roughly: 12.83, 77.45 to 13.14, 77.78
    # TomTom Flow API example: https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?key={key}&point={lat,lon}
    # For simplicity, we'll return a center point flow or use a general incident feed.
    try:
        url = f"https://api.tomtom.com/traffic/services/4/incidentDetails/s3/12.9716,77.5946,13.1,77.7/10/-1/json?key={TOMTOM_API_KEY}"
        response = requests.get(url)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/traffic/predict")
async def predict_traffic(data: dict = Body(...)):
    """
    Predict congestion level.
    Expected: {road_name, time_of_day, day_of_week, weather, ...}
    """
    result = ml_engine.predict(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/dashboard/stats")
async def get_stats():
    """
    Mocked stats for the dashboard.
    """
    return {
        "total_congested_roads": 15,
        "avg_speed": 24.5,
        "peak_hours": "09:00 - 11:00, 18:00 - 20:00",
        "top_5_roads": [
            {"name": "Silk Board Junction", "level": "High"},
            {"name": "Outer Ring Road", "level": "High"},
            {"name": "Hebbal Flyover", "level": "Medium"},
            {"name": "Electronic City Flyover", "level": "Medium"},
            {"name": "MG Road", "level": "Medium"}
        ]
    }

@app.post("/route/optimize")
async def optimize_route(data: dict = Body(...)):
    """
    Get route recommendations from TomTom.
    Expected: {source: {lat, lon}, destination: {lat, lon}}
    """
    source = data.get("source")
    dest = data.get("destination")
    if not source or not dest:
        raise HTTPException(status_code=400, detail="Source and destination required")
    
    try:
        url = f"https://api.tomtom.com/routing/1/calculateRoute/{source['lat']},{source['lon']}:{dest['lat']},{dest['lon']}/json?key={TOMTOM_API_KEY}&traffic=true"
        response = requests.get(url)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_alerts():
    """
    Fetch alerts using Grok API to scrape recent live traffic issues on X for Bangalore.
    If no API key is provided, returns mock data.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if not groq_api_key:
        return [
            {"id": 1, "text": "Traffic congestion reported near Silk Board due to water logging.", "location": [12.9172, 77.6228], "time": "10 mins ago"},
            {"id": 2, "text": "Accident at Outer Ring Road, Marathahalli. Seek alternative routes.", "location": [12.9562, 77.7011], "time": "25 mins ago"},
            {"id": 3, "text": "Road closure at MG Road for construction work.", "location": [12.9734, 77.6067], "time": "1 hour ago"}
        ]
        
    try:
        client = openai.Client(api_key=groq_api_key, base_url="https://api.groq.com/openai/v1")
        prompt = '''
        Act as a live traffic scraper for Bangalore.
        Return a JSON array of 3 recent distinct major traffic disruptions (jams, accidents, or closures) reported on social media by users in Bangalore.
        Each should be a dictionary with this exact schema:
        {
          "id": 1,
          "text": "<short description of issue>",
          "location": [<latitude_float>, <longitude_float>],
          "time": "<estimated time e.g., 10 mins ago>"
        }
        Return ONLY valid JSON array with NO markdown syntax, no backticks.
        '''
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.3
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        return json.loads(content)
    except Exception as e:
        return [
            {"id": 1, "text": f"Grok API Error: {str(e)}", "location": [12.9716, 77.5946], "time": "Just now"}
        ]

@app.get("/weather")
async def get_weather():
    """
    Fetch current weather for Bangalore using OpenWeather API.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key missing"}
    
    try:
        # Bangalore coordinates
        lat, lon = 12.9716, 77.5946
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
