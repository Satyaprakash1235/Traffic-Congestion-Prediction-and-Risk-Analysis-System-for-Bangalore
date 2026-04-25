import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "traffic_system"

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None

    async def connect(self):
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
            self.db = self.client[DATABASE_NAME]
            # Verify connection
            await self.client.server_info()
            print(f"Connected to MongoDB at {MONGODB_URL}")
        except Exception as e:
            print(f"Warning: Could not connect to MongoDB. Error: {e}")
            self.db = None

    async def close(self):
        if self.client:
            self.client.close()

db = Database()
