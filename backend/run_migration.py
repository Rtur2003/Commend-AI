#!/usr/bin/env python3
"""
Production migration runner for Render deployment
This script will run on the production server where DATABASE_URL is available
"""
import subprocess
import sys
import os

def run_migration():
    """Run the database migration"""
    print("=== Running Database Migration ===")
    
    # Check if DATABASE_URL exists
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL not found in environment")
        print("This script should be run in production environment")
        return False
    
    print(f"DATABASE_URL found: {database_url[:50]}...")
    
    # Install psycopg2 if needed
    try:
        import psycopg2
        print("psycopg2 already installed")
    except ImportError:
        print("Installing psycopg2...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    
    # Run the migrations
    try:
        print("=== Running Comment table migration ===")
        from app.migrations.add_created_at_column import migrate_database
        migrate_database()
        print("✅ Comment table migration completed")
        
        print("=== Running User table migration ===")
        from app.migrations.update_user_table import migrate_user_table
        migrate_user_table()
        print("✅ User table migration completed")
        
        return True
    except Exception as e:
        print(f"Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("✅ Migration completed successfully")
        sys.exit(0)
    else:
        print("❌ Migration failed")
        sys.exit(1)