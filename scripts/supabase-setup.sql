-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  location TEXT,
  total_collections INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create waste_entries table
CREATE TABLE IF NOT EXISTS waste_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('plastic', 'loha', 'raddi', 'glass', 'mixed')),
  weight DECIMAL(8, 2) NOT NULL,
  rate_per_kg DECIMAL(8, 2) NOT NULL,
  total_earning DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT positive_weight CHECK (weight > 0),
  CONSTRAINT positive_rate CHECK (rate_per_kg > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_waste_entries_user_id ON waste_entries(user_id);
CREATE INDEX idx_waste_entries_created_at ON waste_entries(created_at DESC);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS policies for waste_entries
CREATE POLICY "Users can view their own waste entries"
  ON waste_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waste entries"
  ON waste_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own waste entries"
  ON waste_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own waste entries"
  ON waste_entries FOR DELETE
  USING (auth.uid() = user_id);
