-- Add language_preference column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN language_preference TEXT DEFAULT 'English' CHECK (language_preference IN ('English', 'Hindi', 'Hinglish'));

-- Update existing records to have a default language preference
UPDATE user_profiles SET language_preference = 'English' WHERE language_preference IS NULL;

COMMIT;
