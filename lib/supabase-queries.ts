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

// Get all entries grouped by date (for history screen)
export async function getEntriesGroupedByDate(userId: string) {
  const { data, error } = await supabase
    .from("waste_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  const grouped: Record<string, any[]> = {}
  data?.forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(entry)
  })

  return grouped
}

// Get user stats (for profile screen)
export async function getUserStats(userId: string) {
  const { data: entries, error: entriesError } = await supabase
    .from("waste_entries")
    .select("total_earning, weight")
    .eq("user_id", userId)

  if (entriesError) throw entriesError

  const totalEarnings = entries?.reduce((sum, e) => sum + e.total_earning, 0) || 0
  const totalCollections = entries?.length || 0

  return { totalEarnings, totalCollections }
}

// Get daily earnings for chart (for stats screen)
export async function getDailyEarnings(userId: string, days = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("waste_entries")
    .select("created_at, total_earning")
    .eq("user_id", userId)
    .gte("created_at", startDate)

  if (error) throw error

  const dailyMap: Record<string, number> = {}
  data?.forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short" })
    dailyMap[date] = (dailyMap[date] || 0) + entry.total_earning
  })

  const dayNames = ["Som", "Man", "Bud", "Gur", "Shu", "Sha", "Rav"]
  return dayNames.map((day) => ({ day, earning: dailyMap[day] || 0 }))
}

// Get waste breakdown by category (for stats screen)
export async function getWasteBreakdown(userId: string) {
  const { data, error } = await supabase.from("waste_entries").select("waste_type, weight").eq("user_id", userId)

  if (error) throw error

  const breakdown: Record<string, number> = {}
  data?.forEach((entry) => {
    breakdown[entry.waste_type] = (breakdown[entry.waste_type] || 0) + entry.weight
  })

  const total = Object.values(breakdown).reduce((sum, w) => sum + w, 0)
  return Object.entries(breakdown).map(([type, weight]) => ({
    type,
    weight,
    percentage: Math.round((weight / total) * 100),
  }))
}

// Add function to update user location
export async function updateUserLocation(userId: string, location: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ location })
    .eq("id", userId)
    .select()

  if (error) throw error
  return data?.[0]
}
