import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def train_model():
    print("Loading dataset...")
    df = pd.read_csv("../dataset/traffic_data.csv")
    
    # Preprocessing
    le_road = LabelEncoder()
    le_weather = LabelEncoder()
    le_target = LabelEncoder()
    
    df['road_name_encoded'] = le_road.fit_transform(df['road_name'])
    df['weather_encoded'] = le_weather.fit_transform(df['weather'])
    df['congestion_level_encoded'] = le_target.fit_transform(df['congestion_level'])
    
    # Features as requested: time_of_day, day_of_week, road_name, vehicle_count, avg_speed, rainfall, holiday, incident
    # We use numerical versions
    X = df[['time_of_day', 'day_of_week', 'road_name_encoded', 'vehicle_count', 'avg_speed', 'rainfall', 'holiday', 'incident']]
    y = df['congestion_level_encoded']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    from sklearn.ensemble import RandomForestClassifier
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Accuracy
    score = model.score(X_test, y_test)
    print(f"Model Accuracy: {score * 100:.2f}%")
    
    # Save model and encoders
    os.makedirs("../model", exist_ok=True)
    with open("../model/traffic_model.pkl", "wb") as f:
        pickle.dump({
            "model": model,
            "le_road": le_road,
            "le_weather": le_weather,
            "le_target": le_target
        }, f)
    
    print("Model and encoders saved to ../model/traffic_model.pkl")

if __name__ == "__main__":
    train_model()
