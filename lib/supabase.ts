import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!")
  console.log("URL:", supabaseUrl ? "Present" : "Missing")
  console.log("Key:", supabaseAnonKey ? "Present" : "Missing")
}

//console.log("Supabase initialized with URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export type WasteEntry = {
  id: string
  user_id: string
  waste_type: "plastic" | "loha" | "raddi" | "glass" | "mixed"
  weight: number
  rate_per_kg: number
  total_earning: number
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  name: string
  phone: string
  verified: boolean
  location: string
  total_collections: number
  total_earnings: number
  created_at: string
  updated_at: string
}
