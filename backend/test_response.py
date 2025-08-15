#!/usr/bin/env python3
"""
Test script to check backend response format
"""
import requests
import json

API_BASE = "https://commend-ai-backend.onrender.com/api"

def test_generate_comment():
    url = f"{API_BASE}/generate_comment"
    data = {
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "language": "English", 
        "comment_style": "default"
    }
    
    print(f"Testing: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            json_data = response.json()
            print(f"JSON Data: {json.dumps(json_data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

def test_history():
    url = f"{API_BASE}/history"
    print(f"\nTesting: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            json_data = response.json()
            print(f"JSON Data: {json.dumps(json_data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=== Testing Backend Response Format ===")
    test_generate_comment()
    test_history()