"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function SplashScreen() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/home")
    }
  }, [loading, user])

  const handleStart = () => {
    router.push("./register")
  }

  if (loading || user) {
    return null
  }

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.walletIcon}>
            <View style={styles.walletBody} />
            <View style={styles.walletBadge} />
          </View>
        </View>
        <Text style={styles.splashTitle}>Mehnat ka</Text>
        <Text style={[styles.splashTitle, { color: "#FFD700" }]}>poora hisaab</Text>
        <Text style={styles.splashSubtitle}>Digital Khata for Smart Kabadiwalas</Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Shuru Kare</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.madeInIndia}>🇮🇳 MADE IN INDIA</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  walletIcon: {
    width: 60,
    height: 40,
    borderWidth: 4,
    borderColor: "#2E7D32",
    borderRadius: 8,
    position: "relative",
  },
  walletBody: {
    flex: 1,
    backgroundColor: "transparent",
  },
  walletBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  splashSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 10,
    fontSize: 16,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },
  footerContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: 150,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  madeInIndia: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
})
