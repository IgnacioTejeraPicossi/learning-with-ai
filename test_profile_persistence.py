#!/usr/bin/env python3
"""
Test script to verify profile persistence in MongoDB
"""

import pymongo
import datetime

def test_profile_persistence():
    print("🧪 Testing Profile Persistence in MongoDB")
    print("=" * 50)
    
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['ai_learning']
        certifications_collection = db['certifications']
        
        print("✅ Connected to MongoDB")
        
        # Check existing profiles
        profiles = list(certifications_collection.find({"type": "profile"}))
        print(f"📊 Found {len(profiles)} saved profiles:")
        
        for i, profile in enumerate(profiles):
            print(f"  Profile {i+1}:")
            print(f"    User ID: {profile.get('user_id', 'N/A')}")
            print(f"    Email: {profile.get('user_email', 'N/A')}")
            print(f"    Role: {profile.get('profile', {}).get('role', 'N/A')}")
            print(f"    Skills: {profile.get('profile', {}).get('skills', [])}")
            print(f"    Goals: {profile.get('profile', {}).get('goals', 'N/A')[:50]}...")
            print(f"    Experience: {profile.get('profile', {}).get('experience_level', 'N/A')}")
            print(f"    Updated: {profile.get('updated_at', 'N/A')}")
            print()
        
        # Test saving a profile
        test_profile = {
            "user_id": "test_user_123",
            "user_email": "test@example.com",
            "type": "profile",
            "profile": {
                "role": "Test Master, QA Engineer",
                "skills": ["Selenium", "Cypress", "Test Automation"],
                "goals": "Advance in test automation",
                "experience_level": "advanced"
            },
            "updated_at": datetime.datetime.utcnow()
        }
        
        print("💾 Testing profile save...")
        result = certifications_collection.update_one(
            {"user_id": "test_user_123", "type": "profile"},
            {"$set": test_profile},
            upsert=True
        )
        
        print(f"✅ Profile save result: {result.modified_count} modified, {result.upserted_id} upserted")
        
        # Test retrieving the profile
        print("📖 Testing profile retrieval...")
        retrieved = certifications_collection.find_one({
            "user_id": "test_user_123",
            "type": "profile"
        })
        
        if retrieved:
            print("✅ Profile retrieved successfully")
            print(f"   Role: {retrieved.get('profile', {}).get('role')}")
            print(f"   Skills: {retrieved.get('profile', {}).get('skills')}")
        else:
            print("❌ Profile not found after save")
        
        print("\n🎉 Profile persistence test completed!")
        print("If you see saved profiles above, the auto-fill should work.")
        print("If no profiles are shown, the issue might be with user authentication.")
        
    except Exception as e:
        print(f"❌ Error testing profile persistence: {e}")

if __name__ == "__main__":
    test_profile_persistence() 