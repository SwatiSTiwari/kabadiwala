import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function SplashScreen() {
  const router = useRouter()

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/login")
  //   }, 2500)

  //   return () => clearTimeout(timer)
  // }, [])

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" />

      <View style={styles.logoContainer}>
        <View style={styles.walletIcon}>
          <View style={styles.walletBody} />
          <View style={styles.walletBadge} />
        </View>
      </View>

      <Text style={styles.splashTitle}>Mehnat ka</Text>
      <Text style={[styles.splashTitle, { color: "#FFD700" }]}>
        poora hisaab
      </Text>
      <Text style={styles.splashSubtitle}>
        Digital Khata for Smart Kabadiwalas
      </Text>

      <TouchableOpacity
        style={styles.suruKareButton}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.suruKareText}>Suru Kare</Text>
        <Text style={styles.suruKareIcon}>→</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.madeInIndia}>MADE FOR INDIA 🇮🇳</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#2E7D32",
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
  },
  splashSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 10,
    fontSize: 16,
  },
  suruKareButton: {
    flexDirection: "row",
    backgroundColor: "#FFD700",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 40,
  },
  suruKareText: {
    color: "#2E7D32",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
  },
  suruKareIcon: {
    color: "#2E7D32",
    fontSize: 24,
  },
  footerContainer: {
    position: "absolute",
    bottom: 50,
  },
  madeInIndia: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
})
