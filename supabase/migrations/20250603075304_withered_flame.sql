/*
  # Add pitch deck URL to startups table

  1. Changes
    - Add pitch_deck_url column to startups table
    - Make it nullable to support existing records
    - Add validation check for PDF URLs

  2. Technical Details
    - Uses TEXT type for URL storage
    - Adds CHECK constraint to ensure URLs end with .pdf
*/

ALTER TABLE startups 
ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT;

-- Add constraint to ensure pitch_deck_url ends with .pdf when not null
ALTER TABLE startups
ADD CONSTRAINT pitch_deck_url_pdf_check 
CHECK (pitch_deck_url IS NULL OR pitch_deck_url LIKE '%.pdf');