import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { useRouter } from "expo-router"

export default function StatsScreen() {
  const router = useRouter()

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
            <Text style={styles.cardValue}>₹12,450</Text>
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
            <Text style={styles.cardValue}>450 kg</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Rozana ki Kamaai</Text>
              <Text style={styles.sectionSub}>Avg. ₹1,780 / day</Text>
            </View>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>Is Hafte</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {/* Simple CSS Bar Chart Simulation */}
            {[40, 65, 35, 85, 50, 75, 30].map((h, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barBg}>
                  <View
                    style={[styles.barFill, { height: `${h}%`, backgroundColor: i === 3 ? "#FBC02D" : "#388E3C" }]}
                  />
                </View>
                <Text style={styles.barLabel}>{["Som", "Man", "Bud", "Gur", "Shu", "Sha", "Rav"][i]}</Text>
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
              <Text style={styles.donutTotal}>450kg</Text>
              <Text style={styles.donutLabel}>Total</Text>
            </View>
            <View style={styles.legendContainer}>
              <LegendItem color="#388E3C" label="Loha (Iron)" value="45%" />
              <LegendItem color="#FBC02D" label="Plastic" value="30%" />
              <LegendItem color="#1B5E20" label="Raddi (Paper)" value="15%" />
              <LegendItem color="#E0E0E0" label="Kaanch (Glass)" value="10%" />
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
