import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Configuration
ROADS = [
    "MG Road", "Brigade Road", "Outer Ring Road", "Silk Board Junction",
    "Hebbal Flyover", "Electronic City Flyover", "Indiranagar 100ft Road",
    "Sarjapur Road", "Whitefield Main Road", "Bannerghatta Road"
]

WEATHER = ["Clear", "Cloudy", "Rainy", "Heavy Rain"]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def generate_traffic_data(num_records=10000):
    data = []
    start_date = datetime(2024, 1, 1)
    
    for i in range(num_records):
        # Time and Day
        curr_time = start_date + timedelta(minutes=random.randint(0, 525600)) # 1 year range
        hour = curr_time.hour
        day_of_week = DAYS[curr_time.weekday()]
        
        road = random.choice(ROADS)
        is_holiday = 1 if day_of_week in ["Saturday", "Sunday"] or random.random() < 0.05 else 0
        is_incident = 1 if random.random() < 0.05 else 0
        
        # Rainfall based on weather
        weather = random.choice(WEATHER)
        rainfall = 0
        if weather == "Rainy":
            rainfall = random.uniform(5, 20)
        elif weather == "Heavy Rain":
            rainfall = random.uniform(20, 50)
            
        # Traffic Logic
        # Peak hours: 8-11 AM, 5-9 PM
        is_peak = 1 if (8 <= hour <= 11) or (17 <= hour <= 21) else 0
        
        # Base vehicle count
        base_vehicles = 500 if is_peak else 200
        if is_holiday:
            base_vehicles *= 0.6
        
        vehicle_count = int(base_vehicles * random.uniform(0.8, 1.5))
        if is_incident:
            vehicle_count += random.randint(100, 300)
            
        # Average Speed (inverse to vehicle count and rainfall)
        avg_speed = 40 - (vehicle_count / 100) - (rainfall / 5)
        if is_incident:
            avg_speed -= 15
        avg_speed = max(5, min(60, avg_speed))
        
        # Congestion Level
        if avg_speed < 15:
            congestion_level = "High"
        elif avg_speed < 30:
            congestion_level = "Medium"
        else:
            congestion_level = "Low"
            
        data.append({
            "time_of_day": hour,
            "day_of_week": curr_time.weekday(), # 0-6
            "road_name": road,
            "vehicle_count": vehicle_count,
            "avg_speed": round(avg_speed, 2),
            "rainfall": round(rainfall, 2),
            "holiday": is_holiday,
            "incident": is_incident,
            "weather": weather,
            "congestion_level": congestion_level
        })
        
    return pd.DataFrame(data)

if __name__ == "__main__":
    print("Generating synthetic traffic data...")
    df = generate_traffic_data(15000)
    df.to_csv("traffic_data.csv", index=False)
    print("Dataset saved to traffic_data.csv")
