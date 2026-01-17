import { supabase } from "./supabase"

// Add waste entry
export async function addWasteEntry(userId: string, wasteType: string, weight: number, ratePerKg: number) {
  const totalEarning = weight * ratePerKg

  const { data, error } = await supabase
    .from("waste_entries")
    .insert({
      user_id: userId,
      waste_type: wasteType,
      weight,
      rate_per_kg: ratePerKg,
      total_earning: totalEarning,
    })
    .select()

  if (error) throw error
  return data?.[0]
}

// Get today's earnings
export async function getTodayEarnings(userId: string) {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("waste_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00`)
    .lt("created_at", `${today}T23:59:59`)

  if (error) throw error

  const totalEarning = data?.reduce((sum, entry) => sum + entry.total_earning, 0) || 0
  const totalWeight = data?.reduce((sum, entry) => sum + entry.weight, 0) || 0

  return { totalEarning, totalWeight, entries: data || [] }
}

// Get weekly hisaab
export async function getWeeklyHisaab(userId: string) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("waste_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", `${sevenDaysAgo}T00:00:00`)

  if (error) throw error

  const totalEarning = data?.reduce((sum, entry) => sum + entry.total_earning, 0) || 0
  const totalWeight = data?.reduce((sum, entry) => sum + entry.weight, 0) || 0

  return { totalEarning, totalWeight, entries: data || [] }
}

// Get all entries for a user
export async function getAllEntries(userId: string) {
  const { data, error } = await supabase
    .from("waste_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select()

  if (error) throw error
  return data?.[0]
}

// Get earnings by category
export async function getEarningsByCategory(userId: string) {
  const { data, error } = await supabase
    .from("waste_entries")
    .select("waste_type, weight, total_earning")
    .eq("user_id", userId)

  if (error) throw error

  const categorized = data?.reduce(
    (acc, entry) => {
      const existing = acc[entry.waste_type] || {
        weight: 0,
        earning: 0,
        count: 0,
      }
      return {
        ...acc,
        [entry.waste_type]: {
          weight: existing.weight + entry.weight,
          earning: existing.earning + entry.total_earning,
          count: existing.count + 1,
        },
      }
    },
    {} as Record<string, any>,
  )

  return categorized || {}
}
