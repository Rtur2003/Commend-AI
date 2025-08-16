#!/usr/bin/env python3
"""
Test migration endpoint
"""
import requests
import json

BASE_URL = "https://commend-ai-backend.onrender.com"

def test_migration():
    print("=== Testing Migration Endpoint ===")
    
    # Step 1: Login as admin
    print("1. Admin login...")
    login_data = {
        "password": "Version1CommendAi+"  # Default admin password
    }
    
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            print(f"Login successful, token: {token[:20]}...")
            
            # Step 2: Run migration
            print("2. Running migration...")
            migration_response = requests.post(
                f"{BASE_URL}/api/admin/run-migration",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            
            print(f"Migration response status: {migration_response.status_code}")
            print(f"Migration response: {json.dumps(migration_response.json(), indent=2)}")
            
            if migration_response.status_code == 200:
                print("Migration completed successfully!")
            else:
                print("Migration failed!")
                
        else:
            print(f"Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_migration()