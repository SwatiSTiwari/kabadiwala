export interface User {
  id: string;
  phone: string;
  name: string;
  verified: boolean;
  total_collections: number;
  total_earnings: number;
  location?: string;
  created_at: string;
}

export interface WasteEntry {
  id: string;
  user_id: string;
  waste_type: string;
  weight: number;
  rate: number;
  total_amount: number;
  date: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  total_collections: number;
  total_earnings: number;
  location?: string;
}

export interface ExportData {
  filename: string;
  content: string;
  profile: UserProfile;
  totalEntries: number;
}
