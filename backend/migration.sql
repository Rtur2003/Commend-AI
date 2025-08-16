-- Add created_at column to comment table
ALTER TABLE comment ADD COLUMN created_at TIMESTAMP;

-- Update existing records - set created_at to posted_at if exists, otherwise current time
UPDATE comment 
SET created_at = COALESCE(posted_at, NOW())
WHERE created_at IS NULL;

-- Make created_at NOT NULL after updating existing records
ALTER TABLE comment ALTER COLUMN created_at SET NOT NULL;

-- Make sure posted_at is nullable
ALTER TABLE comment ALTER COLUMN posted_at DROP NOT NULL;