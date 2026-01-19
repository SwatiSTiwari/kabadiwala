'use client';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
  Linking,
  Share,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "../../lib/auth-context"
import {
  getUserProfile,
  getUserStats,
  updateUserLocation,
  exportUserData,
  updateLanguagePreference,
  getLanguagePreference,
} from "../../lib/supabase-queries"
import { useEffect, useState } from "react"
import * as Sharing from "expo-sharing"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ totalEarnings: 0, totalCollections: 0 })
  const [loading, setLoading] = useState(true)
  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const [newLocation, setNewLocation] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [languageModalVisible, setLanguageModalVisible] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadProfileData()
      loadLanguagePreference()
    }
  }, [user?.id])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const userProfile = await getUserProfile(user!.id)
      const userStats = await getUserStats(user!.id)

      setProfile(userProfile)
      setStats(userStats)
      setNewLocation(userProfile?.location || "")
    } catch (error) {
      console.log("[v0] Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLanguagePreference = async () => {
    try {
      const lang = await getLanguagePreference(user!.id)
      setSelectedLanguage(lang)
    } catch (error) {
      console.log("[v0] Error loading language preference:", error)
    }
  }

  const handleSaveLocation = async () => {
    if (!newLocation.trim()) {
      Alert.alert("Error", "Please enter a location")
      return
    }

    try {
      setIsSaving(true)
      await updateUserLocation(user!.id, newLocation)
      setProfile({ ...profile, location: newLocation })
      setLocationModalVisible(false)
      Alert.alert("Success", "Location updated successfully")
    } catch (error) {
      console.log("[v0] Error updating location:", error)
      Alert.alert("Error", "Failed to update location")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDataExport = async () => {
    try {
      setExporting(true)
      const exportData = await exportUserData(user!.id)

      // Share CSV content directly using native share
      await Share.share({
        message: exportData.content,
        title: "Kabadi Hisaab Export",
        url: undefined,
      })

      console.log("[v0] Export data shared successfully")
      Alert.alert("Success", "Your waste collection data has been exported!")
    } catch (error) {
      console.log("[v0] Error exporting data:", error)
      Alert.alert("Export Error", "Failed to export data. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  const handleLanguageChange = async (language: "Hindi" | "English" | "Hinglish") => {
    try {
      await updateLanguagePreference(user!.id, language)
      setSelectedLanguage(language)
      setLanguageModalVisible(false)
      Alert.alert("Success", `Language changed to ${language}`)
    } catch (error) {
      console.log("[v0] Error updating language:", error)
      Alert.alert("Error", "Failed to update language")
    }
  }

  const handleSupportContact = async () => {
    const supportEmail = "swatiduck13@gmail.com"
    const supportPhone = "7208282243"
    const subject = "Kabadi App Support"
    const body = `Hello Swati,\n\nI need help with the Kabadi App.\n\nUser: ${profile?.name}\nPhone: ${profile?.phone}`

    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    try {
      await Linking.openURL(mailtoUrl)
    } catch (error) {
      // Fallback to WhatsApp if email fails
      const whatsappUrl = `https://wa.me/${supportPhone}?text=${encodeURIComponent(
        `Hi Swati, I need support for the Kabadi App.\n\nMy name: ${profile?.name}`,
      )}`
      try {
        await Linking.openURL(whatsappUrl)
      } catch (whatsappError) {
        alert("Please contact: swatiduck13@gmail.com or +91 7208282243")
      }
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      </SafeAreaView>
    )
  }

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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile?.name?.[0]?.toUpperCase() || "K"}</Text>
            </View>
          </View>
          <Text style={styles.name}>{profile?.name || "Kabadiwala"}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.badgeText}>{profile?.verified ? "Verified Kabadiwala" : "Unverified"}</Text>
          </View>
          <Text style={styles.phone}>{profile?.phone || "+91 XXXXXXXXXX"}</Text>

          <TouchableOpacity style={styles.locationContainer} onPress={() => setLocationModalVisible(true)}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{profile?.location || "Add location"}</Text>
            <Text style={styles.editLocationIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.totalCollections}</Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: "#FBC02D" }]}>₹{(stats.totalEarnings / 1000).toFixed(1)}k</Text>
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
          <SettingItem
            icon="📥"
            title="Data export karo"
            sub="Excel format mein download karein"
            onPress={handleDataExport}
            disabled={exporting}
          />
          <SettingItem
            icon="🔤"
            title="Language badlo"
            sub={`Current: ${selectedLanguage}`}
            onPress={() => setLanguageModalVisible(true)}
          />
          <SettingItem icon="🔗" title="App share karein" sub="Doston ke saath" />
          <SettingItem
            icon="🎧"
            title="Madad chahiye?"
            sub="Support team se baat karein"
            onPress={handleSupportContact}
          />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              try {
                await signOut()
                router.replace("/(auth)/login")
              } catch (error) {
                console.log("[v0] Error logging out:", error)
              }
            }}
          >
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Location</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.locationInput}
              placeholder="Enter your location (e.g., Laxmi Nagar, Delhi)"
              value={newLocation}
              onChangeText={setNewLocation}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
              onPress={handleSaveLocation}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save Location"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {["English", "Hindi", "Hinglish"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.languageOption, selectedLanguage === lang && styles.languageOptionSelected]}
                onPress={() => handleLanguageChange(lang as "Hindi" | "English" | "Hinglish")}
              >
                <Text
                  style={[styles.languageOptionText, selectedLanguage === lang && styles.languageOptionTextSelected]}
                >
                  {lang === "English" ? "🇬🇧 English" : lang === "Hindi" ? "🇮🇳 हिंदी (Hindi)" : "🔤 Hinglish"}
                </Text>
                {selectedLanguage === lang && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

function SettingItem({ icon, title, sub, onPress, disabled = false }: {
  icon: string;
  title: string;
  sub: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.settingItem, disabled && { opacity: 0.6 }]} onPress={onPress} disabled={disabled}>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E8F5E9",
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 48, fontWeight: "bold", color: "white" },
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
    alignItems: "center",
  },
  locationIcon: { fontSize: 12, marginRight: 6 },
  locationText: { color: "#2E7D32", fontWeight: "600", fontSize: 13, flex: 1 },
  editLocationIcon: { fontSize: 12, marginLeft: 6 },
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
  logoutButton: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#C62828" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  closeIcon: { fontSize: 24, color: "#999" },
  locationInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  languageOptionSelected: {
    backgroundColor: "#E8F5E9",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  languageOptionTextSelected: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  checkMark: {
    fontSize: 20,
    color: "#2E7D32",
  },
})
