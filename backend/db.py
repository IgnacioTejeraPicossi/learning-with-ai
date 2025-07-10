from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"  # Default local URI

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["ai_learning"]  # Your database name
users_collection = database.get_collection("users")  # Example collection
lessons_collection = database.get_collection("lessons")
