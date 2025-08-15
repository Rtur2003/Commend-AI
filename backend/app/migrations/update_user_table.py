#!/usr/bin/env python3
"""
User table migration for multi-user support
Adds session-based tracking columns to User table
"""
import os
import psycopg2
from datetime import datetime

def migrate_user_table():
    """Add session tracking columns to User table"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL not found")
        return False
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Add new columns to User table
        migration_queries = [
            # Make email nullable for anonymous users
            "ALTER TABLE \"user\" ALTER COLUMN email DROP NOT NULL;",
            
            # Make password_hash nullable for anonymous users  
            "ALTER TABLE \"user\" ALTER COLUMN password_hash DROP NOT NULL;",
            
            # Add session tracking columns
            "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS session_id VARCHAR(128) UNIQUE;",
            "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);",
            "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS user_agent TEXT;",
            "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();",
            "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT NOW();",
            
            # Update existing records with created_at if NULL
            "UPDATE \"user\" SET created_at = NOW() WHERE created_at IS NULL;",
            "UPDATE \"user\" SET last_seen = NOW() WHERE last_seen IS NULL;",
            
            # Make created_at and last_seen NOT NULL after updating
            "ALTER TABLE \"user\" ALTER COLUMN created_at SET NOT NULL;",
            "ALTER TABLE \"user\" ALTER COLUMN last_seen SET NOT NULL;"
        ]
        
        print("🔄 Updating User table schema...")
        for query in migration_queries:
            try:
                cur.execute(query)
                print(f"✅ {query}")
            except psycopg2.Error as e:
                if "already exists" in str(e) or "does not exist" in str(e):
                    print(f"ℹ️  Skipped: {query} (already applied)")
                else:
                    print(f"❌ Error: {query} - {e}")
        
        conn.commit()
        print("✅ User table migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    migrate_user_table()