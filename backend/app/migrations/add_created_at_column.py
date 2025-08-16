"""
Database migration to add created_at column to comment table
Run this script to migrate existing PostgreSQL database
"""

import os
import psycopg2
from datetime import datetime

# Get database URL from environment
DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    print("DATABASE_URL not found in environment variables")
    exit(1)

# Handle postgres:// to postgresql:// conversion for newer versions
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

def migrate_database():
    """Add created_at column to comment table and update existing records"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Connected to database")
        
        # Check if created_at column already exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='comment' AND column_name='created_at';
        """)
        
        if cursor.fetchone():
            print("created_at column already exists")
            return
            
        print("Adding created_at column...")
        
        # Add created_at column
        cursor.execute("""
            ALTER TABLE comment 
            ADD COLUMN created_at TIMESTAMP;
        """)
        
        # Update existing records - set created_at to posted_at if posted_at exists, otherwise current time
        cursor.execute("""
            UPDATE comment 
            SET created_at = COALESCE(posted_at, NOW())
            WHERE created_at IS NULL;
        """)
        
        # Make created_at NOT NULL after updating existing records
        cursor.execute("""
            ALTER TABLE comment 
            ALTER COLUMN created_at SET NOT NULL;
        """)
        
        # Make posted_at nullable (it might not be nullable in old schema)
        cursor.execute("""
            ALTER TABLE comment 
            ALTER COLUMN posted_at DROP NOT NULL;
        """)
        
        # Commit changes
        conn.commit()
        print("Migration completed successfully!")
        
        # Show updated table structure
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name='comment' 
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print("\nUpdated table structure:")
        for col in columns:
            print(f"  {col[0]}: {col[1]} (nullable: {col[2]})")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    print("=== Database Migration: Add created_at Column ===")
    migrate_database()