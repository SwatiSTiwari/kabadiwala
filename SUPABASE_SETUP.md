# Supabase Setup Instructions

## Step 1: Go to Your Supabase Dashboard

Visit: https://sslbkqyjyhsntnwmsave.supabase.co

## Step 2: Run the SQL Schema

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
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

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

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
```

4. Click **Run** to execute the SQL

## Step 3: Configure Email Authentication

Since we're using email-based auth with phone numbers, you need to:

1. Go to **Authentication** → **Settings** in Supabase
2. Under **Auth Providers**, make sure **Email** is enabled
3. **Disable email confirmation** for testing (optional):
   - Scroll to **Email Auth**
   - Toggle OFF "Enable email confirmations"
   - This allows users to login immediately without email verification

## Step 4: Test the App

1. Try registering a new user
2. Check the logs in the Metro console for any errors
3. Go to **Authentication** → **Users** in Supabase to see if the user was created
4. Go to **Table Editor** → **user_profiles** to verify the profile was created

## Troubleshooting

### If registration fails:
1. Check Metro console logs for error messages
2. Check Supabase Dashboard → **Logs** for any errors
3. Verify environment variables in `.env.local` are correct
4. Make sure the SQL schema was executed successfully

### Common Issues:
- **"Invalid API key"**: Check your `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- **"Table not found"**: Run the SQL schema in Supabase SQL Editor
- **"RLS policy violation"**: Make sure the policies were created correctly
- **"Email confirmation required"**: Disable email confirmations in Auth settings

## Environment Variables Check

Your `.env.local` should have:
```
EXPO_PUBLIC_SUPABASE_URL=https://sslbkqyjyhsntnwmsave.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_e_SriMQ7DX0YQD1d4xMEdw_OCsSUWd_
SUPABASE_SERVICE_ROLE_KEY=sb_secret_hTR6dAedNwD-WKh4-K8d3Q_TaRAC-yw
```

**Important**: After adding/changing `.env.local`, restart the Metro server:
1. Press `Ctrl+C` to stop
2. Run `npm start` again
