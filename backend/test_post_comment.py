#!/usr/bin/env python3
"""
Test script to check POST comment endpoint
"""
import requests
import json

API_BASE = "https://commend-ai-backend.onrender.com/api"

def test_post_comment_without_id():
    """Test post comment without comment_id (should work)"""
    url = f"{API_BASE}/post_comment"
    data = {
        "video_url": "https://www.youtube.com/watch?v=test12345",
        "comment_text": "This is a test comment without comment_id"
    }
    
    print(f"Testing POST without comment_id: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            json_data = response.json()
            print(f"JSON Data: {json.dumps(json_data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

def test_post_comment_with_id():
    """Test post comment with comment_id"""
    url = f"{API_BASE}/post_comment"
    data = {
        "video_url": "https://www.youtube.com/watch?v=test12345",
        "comment_text": "This is a test comment with comment_id",
        "comment_id": "test-comment-id-123"
    }
    
    print(f"\nTesting POST with comment_id: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            json_data = response.json()
            print(f"JSON Data: {json.dumps(json_data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=== Testing POST Comment Endpoint ===")
    test_post_comment_without_id()
    test_post_comment_with_id()