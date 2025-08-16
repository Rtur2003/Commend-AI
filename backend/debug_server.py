#!/usr/bin/env python3
"""
Simple debug server for testing ad CRUD operations
"""
import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Simple SQLite database setup
DB_FILE = 'debug_ads.db'

def init_db():
    """Initialize the database with ads table"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create ads table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            link_url TEXT,
            is_active BOOLEAN DEFAULT 1,
            position TEXT DEFAULT 'left',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert test data if empty
    cursor.execute('SELECT COUNT(*) FROM ads')
    if cursor.fetchone()[0] == 0:
        test_ads = [
            ('🎯 Test Reklamı 1 - Premium Hizmet!', 'https://example.com', 1, 'left'),
            ('⚡ Test Reklamı 2 - Hızlı Çözüm', 'https://test.com', 1, 'right'),
            ('📱 Test Reklamı 3 - Mobil App', 'https://mobile.com', 0, 'top')
        ]
        cursor.executemany(
            'INSERT INTO ads (content, link_url, is_active, position) VALUES (?, ?, ?, ?)',
            test_ads
        )
    
    conn.commit()
    conn.close()
    print(f"Database initialized: {DB_FILE}")

@app.route('/api/admin/ads', methods=['GET'])
def get_all_ads():
    """Get all ads (admin endpoint)"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT id, content, link_url, is_active, position, created_at FROM ads ORDER BY created_at DESC')
    ads = cursor.fetchall()
    conn.close()
    
    result = []
    for ad in ads:
        result.append({
            'id': ad[0],
            'content': ad[1],
            'link_url': ad[2],
            'is_active': bool(ad[3]),
            'position': ad[4],
            'created_at': ad[5]
        })
    
    print(f"GET /api/admin/ads - Returning {len(result)} ads")
    return jsonify(result)

@app.route('/api/public/active-ads', methods=['GET'])  
def get_active_ads():
    """Get only active ads (public endpoint)"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT id, content, link_url, position FROM ads WHERE is_active = 1')
    ads = cursor.fetchall()
    conn.close()
    
    result = []
    for ad in ads:
        result.append({
            'id': ad[0],
            'content': ad[1], 
            'link_url': ad[2],
            'position': ad[3]
        })
    
    print(f"GET /api/public/active-ads - Returning {len(result)} active ads")
    return jsonify(result)

@app.route('/api/admin/ads', methods=['POST'])
def create_ad():
    """Create new ad"""
    data = request.get_json()
    print(f"POST /api/admin/ads - Data: {data}")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO ads (content, link_url, is_active, position) VALUES (?, ?, ?, ?)',
        (data.get('content'), data.get('link_url'), data.get('is_active', True), data.get('position', 'left'))
    )
    ad_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    print(f"Created ad with ID: {ad_id}")
    return jsonify({"status": "success", "message": "Ad created successfully.", "id": ad_id}), 201

@app.route('/api/admin/ads/<int:ad_id>', methods=['PUT'])
def update_ad(ad_id):
    """Update ad"""
    data = request.get_json()
    print(f"PUT /api/admin/ads/{ad_id} - Data: {data}")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE ads SET content = ?, link_url = ?, position = ? WHERE id = ?',
        (data.get('content'), data.get('link_url'), data.get('position'), ad_id)
    )
    conn.commit()
    conn.close()
    
    print(f"Updated ad ID: {ad_id}")
    return jsonify({"status": "success", "message": "Ad updated successfully."})

@app.route('/api/admin/ads/<int:ad_id>', methods=['DELETE'])
def delete_ad(ad_id):
    """Delete ad"""
    print(f"DELETE /api/admin/ads/{ad_id}")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM ads WHERE id = ?', (ad_id,))
    conn.commit()
    conn.close()
    
    print(f"Deleted ad ID: {ad_id}")
    return jsonify({"status": "success", "message": "Ad deleted successfully."})

@app.route('/api/admin/ads/<int:ad_id>/toggle', methods=['PUT'])
def toggle_ad(ad_id):
    """Toggle ad active status"""
    print(f"PUT /api/admin/ads/{ad_id}/toggle")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('UPDATE ads SET is_active = NOT is_active WHERE id = ?', (ad_id,))
    conn.commit()
    conn.close()
    
    print(f"Toggled ad ID: {ad_id}")
    return jsonify({"status": "success", "message": "Ad status toggled."})

# Mock admin auth endpoints
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    password = data.get('password')
    
    # Only accept test passwords in debug mode
    debug_passwords = ['test', 'admin']
    if password in debug_passwords:
        print(f"DEBUG LOGIN: Password '{password}' accepted")
        return jsonify({"status": "success", "message": "Debug login successful", "token": "debug-token"})
    
    print(f"DEBUG LOGIN: Password '{password}' rejected")
    return jsonify({"status": "error", "message": "Invalid debug password. Use 'test' or 'admin'"}), 401

@app.route('/api/admin/check_auth', methods=['GET'])
def check_auth():
    return jsonify({"is_admin": True})

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    return jsonify({"status": "success", "message": "Logout successful"})

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify({"history": [
        {"id": 1, "comment_text": "Test yorumu 1", "video_url": "https://youtube.com/test1", "posted_at": "2025-01-01"},
        {"id": 2, "comment_text": "Test yorumu 2", "video_url": "https://youtube.com/test2", "posted_at": "2025-01-02"}
    ]})

if __name__ == '__main__':
    print("Starting Debug Server...")
    init_db()
    print("Server running at: http://127.0.0.1:5000")
    print("Admin Panel: http://localhost:3000/admin")
    print("API Endpoints:")
    print("   GET  /api/admin/ads - Get all ads")
    print("   POST /api/admin/ads - Create ad")
    print("   PUT  /api/admin/ads/:id - Update ad")
    print("   DELETE /api/admin/ads/:id - Delete ad")
    print("   GET  /api/public/active-ads - Get active ads")
    print("Database: debug_ads.db")
    
    app.run(debug=True, host='127.0.0.1', port=5000)