"use client";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Profile from "../../assets/images/profile.png";
import { useAuth } from "../../lib/auth-context";
import {
  getEntriesGroupedByDate,
  getTodayEarnings,
  getUserProfile,
  getWeeklyHisaab,
} from "../../lib/supabase-queries";

const TRANSACTIONS = [
  {
    id: "1",
    type: "Raddi (Paper)",
    weight: "12 kg",
    rate: "₹12/kg",
    amount: "₹144",
    time: "10:30 AM",
    icon: "📰",
  },
  {
    id: "2",
    type: "Loha (Iron)",
    weight: "5 kg",
    rate: "₹30/kg",
    amount: "₹150",
    time: "09:15 AM",
    icon: "🔨",
  },
  {
    id: "3",
    type: "Plastic (Mixed)",
    weight: "8 kg",
    rate: "₹12/kg",
    amount: "₹96",
    time: "Yesterday",
    icon: "♻️",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [userName, setUserName] = useState("Kabadiwala");
  const [todayEarning, setTodayEarning] = useState(0);
  const [weeklyEarning, setWeeklyEarning] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadHomeData();
    }
  }, [user?.id]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      // Fetch user profile to get actual name
      const profile = await getUserProfile(user!.id);
      setUserName(profile?.name || "Kabadiwala");

      // Fetch today's and weekly earnings
      const today = await getTodayEarnings(user!.id);
      const weekly = await getWeeklyHisaab(user!.id);
      setTodayEarning(today.totalEarning);
      setWeeklyEarning(weekly.totalEarning);

      // Fetch recent transactions (limit to 3)
      const entries = await getEntriesGroupedByDate(user!.id);
      const recentEntries: any[] = [];
      for (const date in entries) {
        recentEntries.push(...entries[date]);
        if (recentEntries.length >= 3) break;
      }
      setRecentTransactions(recentEntries.slice(0, 3));
    } catch (error) {
      console.log("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWasteIcon = (wasteType: string): { name: string; color: string } => {
    const icons: Record<string, { name: string; color: string }> = {
      "Raddi (Paper)": { name: "file-text-o", color: "#8D6E63" },
      "Loha (Iron)": { name: "wrench", color: "#607D8B" },
      "Plastic (Mixed)": { name: "recycle", color: "#4CAF50" },
      Plastic: { name: "recycle", color: "#4CAF50" },
      Iron: { name: "wrench", color: "#607D8B" },
      Paper: { name: "file-text-o", color: "#8D6E63" },
    };
    return icons[wasteType] || { name: "cube", color: "#666" };
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.greeting}>
                Namaste,{"\n"}
                {userName}
              </Text>
              <FontAwesome name="hand-peace-o" size={24} color="#FBC02D" />
            </View>
            <Text style={styles.subGreeting}>Aaj ka din shubh ho!</Text>
          </View>
          <Image source={Profile} style={styles.avatar} />
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: "#2E7D32" }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>AAJ KI KAMAAI</Text>
              <FontAwesome name="money" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>₹ {todayEarning}</Text>
            <View style={styles.statFooter}>
              <FontAwesome
                name="line-chart"
                size={14}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.trendText}>Kal se 12% zyada</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#FBC02D" }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: "#827717" }]}>
                IS HAFTE KA HISAAB
              </Text>
              <FontAwesome name="calendar" size={20} color="#827717" />
            </View>
            <Text style={[styles.statValue, { color: "#333" }]}>
              ₹ {weeklyEarning}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addAction}
          onPress={() => router.push("/add-entry")}
        >
          <View style={styles.plusCircle}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
          <Text style={styles.addActionText}>Aaj ka kabad add karo</Text>
        </TouchableOpacity>

        <View style={styles.transactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Haal hi ke transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text style={styles.seeAllText}>Sab dekhein</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((item, index) => {
            const iconInfo = getWasteIcon(item.waste_type);
            return (
              <View key={index} style={styles.transactionItem}>
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
                    {item.weight} kg • ₹{item.rate_per_kg}/kg
                  </Text>
                </View>
                <View style={styles.itemAmountContainer}>
                  <Text style={styles.itemAmount}>₹{item.total_earning}</Text>
                  <Text style={styles.itemTime}>
                    {new Date(item.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* Bottom nav removed - now handled by (tabs)/_layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D253F",
    lineHeight: 34,
  },
  subGreeting: {
    fontSize: 16,
    color: "#748A9D",
    marginTop: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 24,
    height: 180,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  statIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  statValue: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  trendIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  trendText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  addAction: {
    backgroundColor: "#2E7D32",
    marginHorizontal: 20,
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginTop: -2,
  },
  addActionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  transactionSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D253F",
  },
  seeAllText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#F5F7F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemIcon: {
    fontSize: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D253F",
  },
  itemSub: {
    fontSize: 13,
    color: "#748A9D",
    marginTop: 2,
  },
  itemAmountContainer: {
    alignItems: "flex-end",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },
  itemTime: {
    fontSize: 11,
    color: "#748A9D",
    marginTop: 2,
  },
});
