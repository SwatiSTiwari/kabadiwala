"use client";

import { useAuth } from "@/lib/auth-context";
import { addWasteEntry } from "@/lib/supabase-queries";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES = [
  { id: "plastic", name: "Plastic", rate: "12", icon: "recycle" },
  { id: "loha", name: "Loha", rate: "25", icon: "industry" },
  { id: "raddi", name: "Paper", rate: "8", icon: "file-text-o" },
  { id: "glass", name: "Glass", rate: "5", icon: "glass" },
  { id: "mixed", name: "Mixed", rate: "3", icon: "refresh" },
];

export default function AddEntryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState("plastic");
  const [weight, setWeight] = useState("0");
  const [rate, setRate] = useState("12");
  const [loading, setLoading] = useState(false);

  const total =
    Number.parseFloat(weight || "0") * Number.parseFloat(rate || "0");

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    if (Number.parseFloat(weight) <= 0) {
      Alert.alert("Error", "Weight must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await addWasteEntry(
        user.id,
        selectedCat,
        Number.parseFloat(weight),
        Number.parseFloat(rate),
      );
      Alert.alert("Success", "Entry saved!");
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save entry",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Naya Entry Jodein</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Kachra Chuniye</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCat === cat.id && styles.selectedCard,
              ]}
              onPress={() => {
                setSelectedCat(cat.id);
                setRate(cat.rate);
              }}
            >
              <View
                style={[
                  styles.categoryIconCircle,
                  selectedCat === cat.id && styles.selectedIconCircle,
                ]}
              >
                <FontAwesome
                  name={cat.icon as any}
                  size={28}
                  color={selectedCat === cat.id ? "white" : "#666"}
                />
                {selectedCat === cat.id && (
                  <View style={styles.checkmark}>
                    <FontAwesome name="check" size={12} color="#2E7D32" />
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.categoryName,
                  selectedCat === cat.id && styles.selectedText,
                ]}
              >
                {cat.name}
              </Text>
              <Text
                style={[
                  styles.categoryRate,
                  selectedCat === cat.id && styles.selectedText,
                ]}
              >
                ₹{cat.rate}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Details Bharein</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kitna wajan (kg)?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
              editable={!loading}
            />
            <Text style={styles.inputSuffix}>kg</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daam per kilo (₹)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={rate}
              onChangeText={setRate}
              editable={!loading}
            />
            <Text style={styles.inputSuffix}>₹/kg</Text>
          </View>
        </View>

        <View style={styles.totalBox}>
          <View>
            <Text style={styles.totalLabel}>KUL KAMAAI</Text>
            <Text style={styles.totalSub}>Total Earnings</Text>
          </View>
          <Text style={styles.totalValue}>₹ {total.toLocaleString()}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <FontAwesome
            name="save"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Karo"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 40,
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 20,
    marginTop: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    flexWrap: "wrap",
  },
  categoryCard: {
    width: "30%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: "#2E7D32",
    backgroundColor: "#F1F8E9",
    borderWidth: 2,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedIconCircle: {
    backgroundColor: "#2E7D32",
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444",
  },
  categoryRate: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  selectedText: {
    color: "#2E7D32",
  },
  checkmark: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#4CAF50",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  checkText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  inputSuffix: {
    fontSize: 16,
    color: "#AAA",
    fontWeight: "500",
  },
  totalBox: {
    backgroundColor: "#FFF9E6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#795548",
    letterSpacing: 1,
  },
  totalSub: {
    fontSize: 12,
    color: "#A1887F",
    marginTop: 2,
  },
  totalValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2E7D32",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    height: 64,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  saveIcon: {
    fontSize: 20,
    color: "white",
  },
  saveText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
