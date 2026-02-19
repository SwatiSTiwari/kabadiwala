"use client";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../lib/auth-context";
import { getEntriesGroupedByDate } from "../../lib/supabase-queries";

const HISTORY_DATA = [
  {
    id: "1",
    date: "AAJ - 12 OCT",
    items: [
      {
        id: "1a",
        title: "Akhbaar (Raddi)",
        sub: "15 kg x ₹12/kg",
        amount: "₹180",
        time: "10:30 AM",
        icon: "📰",
      },
      {
        id: "1b",
        title: "Plastic Bottles",
        sub: "8 kg x ₹20/kg",
        amount: "₹160",
        time: "09:15 AM",
        icon: "💧",
      },
    ],
  },
  {
    id: "2",
    date: "KAL - 11 OCT",
    items: [
      {
        id: "2a",
        title: "Loha (Scrap)",
        sub: "50 kg x ₹25/kg",
        amount: "₹1,250",
        time: "05:45 PM",
        icon: "🛠️",
      },
      {
        id: "2b",
        title: "Mixed Waste",
        sub: "10 kg x ₹9/kg",
        amount: "₹90",
        time: "02:30 PM",
        icon: "🗑️",
      },
      {
        id: "2c",
        title: "Gatta (Cardboard)",
        sub: "20 kg x ₹16/kg",
        amount: "₹320",
        time: "11:15 AM",
        icon: "📦",
      },
    ],
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [history, setHistory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const grouped = await getEntriesGroupedByDate(user!.id);
      setHistory(grouped);

      // Calculate totals
      let earnings = 0;
      let weight = 0;
      Object.values(grouped).forEach((entries) => {
        entries.forEach((entry) => {
          earnings += entry.total_earning;
          weight += entry.weight;
        });
      });
      setTotalEarnings(earnings);
      setTotalWeight(weight);
    } catch (error) {
      console.log("[v0] Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pichhla hisaab</Text>
        <TouchableOpacity onPress={() => router.push("/stats")}>
          
          <FontAwesome name="download" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: "#2E7D32" }]}>
            <Text style={styles.summaryLabel}>Kul Kamai</Text>
            <Text style={styles.summaryValue}>
              ₹{totalEarnings.toLocaleString()}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <FontAwesome name="line-chart" size={12} color="white" />
              <Text style={styles.summaryTrend}>All time</Text>
            </View>
          </View>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: "#FFFDE7",
                borderWidth: 1,
                borderColor: "#FFF59D",
              },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: "#827717" }]}>
              Kul Wazan
            </Text>
            <Text style={[styles.summaryValue, { color: "#333" }]}>
              {totalWeight} kg
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <FontAwesome name="check-circle" size={12} color="#2E7D32" />
              <Text style={[styles.summaryTrend, { color: "#2E7D32" }]}>
                Verified
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity style={[styles.filterChip, styles.activeFilter]}>
            <Text style={styles.activeFilterText}>All </Text>
            <FontAwesome name="close" size={12} color="white" />
          </TouchableOpacity>
        </ScrollView>

        {Object.entries(history).map(([date, items]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {items.map((item) => {
              const iconInfo = getWasteIcon(item.waste_type);
              return (
                <View key={item.id} style={styles.transactionItem}>
                  <View style={styles.itemIconContainer}>
                    <FontAwesome
                      name={iconInfo.name as any}
                      size={24}
                      color={iconInfo.color}
                    />
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.waste_type}</Text>
                    <Text style={styles.itemSub}>
                      {item.weight} kg × ₹{item.rate_per_kg}/kg
                    </Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>₹{item.total_earning}</Text>
                    <Text style={styles.itemTime}>
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {Object.keys(history).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Ab tak koi entry nahi hui hai. Shuru karne ke liye + button dabayein.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-entry")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getWasteIcon(wasteType: string): { name: string; color: string } {
  const icons: Record<string, { name: string; color: string }> = {
    Plastic: { name: "recycle", color: "#4CAF50" },
    Loha: { name: "wrench", color: "#607D8B" },
    "Raddi (Paper)": { name: "file-text-o", color: "#8D6E63" },
    "Mixed Waste": { name: "trash", color: "#9E9E9E" },
    Cardboard: { name: "cube", color: "#D4A373" },
    Glass: { name: "glass", color: "#03A9F4" },
  };
  return icons[wasteType] || { name: "recycle", color: "#4CAF50" };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  backIcon: { fontSize: 24, color: "#333" },
  downloadIcon: { fontSize: 20 },
  scrollContent: { paddingBottom: 100 },
  summaryContainer: { flexDirection: "row", padding: 16, gap: 12 },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    height: 140,
    justifyContent: "center",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  summaryTrend: { color: "white", fontSize: 12, fontWeight: "600" },
  filterScroll: { paddingHorizontal: 16, marginVertical: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeFilter: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  activeFilterText: { color: "white", fontWeight: "600" },
  filterText: { color: "#666", fontWeight: "600" },
  dateGroup: { paddingHorizontal: 16, marginTop: 12 },
  dateHeader: {
    fontSize: 12,
    color: "#999",
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 1,
  },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF9C4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemIconText: { fontSize: 22 },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  itemSub: { fontSize: 13, color: "#888", marginTop: 2 },
  itemRight: { alignItems: "flex-end" },
  itemAmount: { fontSize: 16, fontWeight: "700", color: "#2E7D32" },
  itemTime: { fontSize: 11, color: "#AAA", marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabIcon: { color: "white", fontSize: 32, fontWeight: "300" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
});
