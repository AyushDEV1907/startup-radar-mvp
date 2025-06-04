/*
  # Add LinUCB Parameters Table

  1. New Tables
    - `linucb_params`
      - `investor_id` (uuid, primary key, references users)
      - `A` (jsonb, stores the A matrix)
      - `b` (jsonb, stores the b vector)
      - `last_updated` (timestamp)

  2. Security
    - Enable RLS on `linucb_params` table
    - Add policy for authenticated users to manage their own parameters

  3. Automation
    - Add trigger to automatically update last_updated timestamp
*/

-- Create LinUCB parameters table
CREATE TABLE IF NOT EXISTS linucb_params (
  investor_id UUID PRIMARY KEY REFERENCES users(id),
  A JSONB NOT NULL DEFAULT '{}'::jsonb,
  b JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE linucb_params ENABLE ROW LEVEL SECURITY;

-- Create policy for investors to access their own parameters
CREATE POLICY "Users can manage their own LinUCB parameters" 
  ON linucb_params 
  FOR ALL 
  USING (auth.uid() = investor_id);

-- Add trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_linucb_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_linucb_timestamp
  BEFORE UPDATE ON linucb_params
  FOR EACH ROW
  EXECUTE FUNCTION update_linucb_last_updated();