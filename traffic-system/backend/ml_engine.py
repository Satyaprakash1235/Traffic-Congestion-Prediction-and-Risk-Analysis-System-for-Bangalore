import pickle
import pandas as pd
import os

class TrafficMLEngine:
    def __init__(self, model_path="../model/traffic_model.pkl"):
        self.model_path = model_path
        self.model_data = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, "rb") as f:
                self.model_data = pickle.load(f)
            print("ML Model loaded successfully.")
        else:
            print(f"Warning: Model file not found at {self.model_path}")

    def predict(self, input_data):
        """
        input_data: dict with keys: time_of_day, day_of_week, road_name, vehicle_count, avg_speed, rainfall, holiday, incident
        """
        if not self.model_data:
            return {"error": "Model not loaded"}

        # Encode categorical features
        try:
            road_encoded = self.model_data['le_road'].transform([input_data['road_name']])[0]
            # We don't strictly need weather for the model as per the current train script features, 
            # but let's follow the schema.
            
            # Prepare feature vector matching training: 
            # ['time_of_day', 'day_of_week', 'road_name_encoded', 'vehicle_count', 'avg_speed', 'rainfall', 'holiday', 'incident']
            features = pd.DataFrame([{
                'time_of_day': input_data['time_of_day'],
                'day_of_week': input_data['day_of_week'],
                'road_name_encoded': road_encoded,
                'vehicle_count': input_data.get('vehicle_count', 0),
                'avg_speed': input_data.get('avg_speed', 30),
                'rainfall': input_data.get('rainfall', 0),
                'holiday': input_data.get('holiday', 0),
                'incident': input_data.get('incident', 0)
            }])
            
            prediction_encoded = self.model_data['model'].predict(features)[0]
            probabilities = self.model_data['model'].predict_proba(features)[0]
            
            congestion_level = self.model_data['le_target'].inverse_transform([prediction_encoded])[0]
            
            return {
                "congestion_level": congestion_level,
                "probability": round(float(max(probabilities)), 2),
                "all_probs": {
                    self.model_data['le_target'].inverse_transform([i])[0]: round(float(p), 2)
                    for i, p in enumerate(probabilities)
                }
            }
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
ml_engine = TrafficMLEngine()
