"use client"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import Profile from "../../assets/images/profile.png"

export default function ProfileScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image source={Profile} style={styles.avatar} />
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Ramesh Kumar</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.badgeText}>Verified Kabadiwala</Text>
          </View>
          <Text style={styles.phone}>+91 98765 43210</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Laxmi Nagar, Delhi</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>124</Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: "#FBC02D" }]}>₹4.2k</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>SETTINGS</Text>

          <SettingItem
            icon="💜"
            title="Add Kabadiwala via QR"
            sub="Scan karke connect karein"
            onPress={() => router.push("/invite")}
          />
          <SettingItem icon="📥" title="Data export karo" sub="Excel format mein download karein" onPress={undefined} />
          <SettingItem icon="🔤" title="Language badlo" sub="Hindi / English / Hinglish" onPress={undefined} />
          <SettingItem icon="🔗" title="App share karein" sub="Doston ke saath" onPress={undefined} />
          <SettingItem icon="🎧" title="Madad chahiye?" sub="Support team se baat karein" onPress={undefined} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

interface SettingItemProps {
  icon: string
  title: string
  sub: string
  onPress: (() => void) | undefined
}

function SettingItem({ icon, title, sub, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.settingIconBox}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSub}>{sub}</Text>
        </View>
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backIcon: { fontSize: 24 },
  profileInfo: { alignItems: "center", paddingVertical: 24 },
  avatarContainer: { position: "relative" },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#E8F5E9" },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FBC02D",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  editIcon: { fontSize: 16 },
  name: { fontSize: 24, fontWeight: "800", color: "#1A1A1A", marginTop: 16 },
  badgeContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  checkIcon: { fontSize: 14, marginRight: 6 },
  badgeText: { color: "#2E7D32", fontWeight: "700", fontSize: 14 },
  phone: { color: "#888", marginTop: 8, fontSize: 15 },
  locationContainer: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  locationIcon: { fontSize: 12, marginRight: 6 },
  locationText: { color: "#2E7D32", fontWeight: "600", fontSize: 13 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAF9",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginVertical: 24,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  divider: { width: 1, height: "100%", backgroundColor: "#E0E0E0" },
  settingsSection: { padding: 20 },
  sectionHeader: { fontSize: 12, fontWeight: "800", color: "#999", letterSpacing: 1, marginBottom: 16 },
  settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  settingIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingIcon: { fontSize: 20 },
  settingTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  settingSub: { fontSize: 12, color: "#999", marginTop: 2 },
  arrowIcon: { fontSize: 24, color: "#CCC" },
})
