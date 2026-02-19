"use client"

import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "../lib/auth-context"
import { getDailyEarnings, getWasteBreakdown, getWeeklyHisaab } from "../lib/supabase-queries"
import { useEffect, useState } from "react"

export default function StatsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [dailyData, setDailyData] = useState<any[]>([])
  const [breakdown, setBreakdown] = useState<any[]>([])
  const [weeklyStats, setWeeklyStats] = useState({ earning: 0, weight: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadStatsData()
    }
  }, [user?.id])

  const loadStatsData = async () => {
    try {
      setLoading(true)
      const daily = await getDailyEarnings(user!.id)
      const wasteBreakdown = await getWasteBreakdown(user!.id)
      const weekly = await getWeeklyHisaab(user!.id)

      setDailyData(daily)
      setBreakdown(wasteBreakdown)
      setWeeklyStats({ earning: weekly.totalEarning, weight: weekly.totalWeight })
    } catch (error) {
      console.log("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      </SafeAreaView>
    )
  }

  const maxEarning = Math.max(...dailyData.map((d) => d.earning), 1)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mera Hisaab</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Aaj</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>Is Hafte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Is Mahine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topCards}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
                <Text>₹</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+12%</Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>Is hafte ki kamaai</Text>
            <Text style={styles.cardValue}>₹{weeklyStats.earning.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#FFF9C4" }]}>
                <Text>⚖️</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+5%</Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>Kul wazan</Text>
            <Text style={styles.cardValue}>{weeklyStats.weight} kg</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Rozana ki Kamaai</Text>
              <Text style={styles.sectionSub}>Avg. ₹{Math.round(weeklyStats.earning / 7)} / day</Text>
            </View>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>Is Hafte</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {dailyData.map((item, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(item.earning / maxEarning) * 100}%`,
                        backgroundColor: item.earning === 0 ? "#E0E0E0" : "#388E3C",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Kabad ka breakdown</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.donutContainer}>
            <View style={styles.donut}>
              <Text style={styles.donutTotal}>{weeklyStats.weight}kg</Text>
              <Text style={styles.donutLabel}>Total</Text>
            </View>
            <View style={styles.legendContainer}>
              {breakdown.map((item) => (
                <LegendItem
                  key={item.type}
                  color={getColorForType(item.type)}
                  label={item.type}
                  value={`${item.percentage}%`}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { backgroundColor: "#FBC02D" }]}>
        <Text style={[styles.fabIcon, { color: "#333" }]}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

function getColorForType(type: string): string {
  const colors: Record<string, string> = {
    Loha: "#388E3C",
    "Raddi (Paper)": "#1B5E20",
    Plastic: "#FBC02D",
    Glass: "#E0E0E0",
  }
  return colors[type] || "#999"
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.legendLabel}>{label}</Text>
      </View>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  backIcon: { fontSize: 24 },
  scrollContent: { paddingBottom: 120 },
  tabContainer: { flexDirection: "row", padding: 16, gap: 10 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeTab: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "white", fontWeight: "600" },
  topCards: { flexDirection: "row", paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: "white", borderRadius: 20, padding: 16, shadowOpacity: 0.05, elevation: 2 },
  statHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  badge: { backgroundColor: "#E8F5E9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: "#2E7D32", fontSize: 11, fontWeight: "700" },
  cardLabel: { fontSize: 13, color: "#888", marginBottom: 4 },
  cardValue: { fontSize: 22, fontWeight: "800", color: "#1A1A1A" },
  sectionCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 24,
    padding: 20,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  sectionSub: { fontSize: 13, color: "#999", marginTop: 2 },
  periodBadge: { backgroundColor: "#F5F5F5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  periodText: { fontSize: 11, color: "#666", fontWeight: "600" },
  chartContainer: { flexDirection: "row", height: 180, alignItems: "flex-end", justifyContent: "space-between" },
  barColumn: { alignItems: "center", flex: 1 },
  barBg: {
    width: 28,
    height: 150,
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 8 },
  barLabel: { fontSize: 10, color: "#999", marginTop: 8, fontWeight: "600" },
  viewAll: { color: "#2E7D32", fontWeight: "700", fontSize: 14 },
  donutContainer: { alignItems: "center" },
  donut: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 15,
    borderColor: "#388E3C",
    justifyContent: "center",
    alignItems: "center",
  },
  donutTotal: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  donutLabel: { fontSize: 12, color: "#999" },
  legendContainer: { width: "100%", marginTop: 24, gap: 12 },
  legendItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendLabel: { fontSize: 14, color: "#444", fontWeight: "500" },
  legendValue: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabIcon: { fontSize: 32, fontWeight: "300" },
})
