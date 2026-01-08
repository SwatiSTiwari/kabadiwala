import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from "react-native"

import { useRouter } from "expo-router"


export default function RegisterScreen() {
  const router = useRouter()

  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Naya Account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        >
        {/* <View style={styles.heroSection}>
          <Image
            source={{ uri: "/images/screenshot-202026-01-05-20at-207.png" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.floatingBadge}>
            <Text style={styles.badgeText}>🍃 Kabadiwala App</Text>
          </View>
        </View> */}

        <View style={styles.formContent}>
          <Text style={styles.title}>Swagat hai!</Text>
          <Text style={styles.highlightTitle}>Nayi shuruat karein</Text>
          <Text style={styles.subtitle}>Apna hisaab digital karein aur business badhayein.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pura Naam</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput style={styles.input} placeholder="Rahul Kumar" placeholderTextColor="#BBB" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📞</Text>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="98765 43210"
                placeholderTextColor="#BBB"
                keyboardType="phone-pad"
              />
            </View>
            <Text style={styles.inputHint}>⚠️ Isi number par OTP aayega</Text>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/home")}>
            <Text style={styles.registerButtonText}>Register Karein</Text>
            <Text style={styles.registerButtonIcon}>→</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Account pehle se hai? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Login karein</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.policyLinks}>
            <Text style={styles.policyText}>Terms of Service</Text>
            <View style={styles.dot} />
            <Text style={styles.policyText}>Privacy Policy</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
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
  heroSection: {
    padding: 20,
  },
  heroImage: {
  width: "100%",
  height: 180, // 🔥 reduced
  borderRadius: 24,
},

  floatingBadge: {
    position: "absolute",
    bottom: 40,
    left: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  highlightTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFD600",
    marginTop: -5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    lineHeight: 24,
  },
  inputGroup: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  countryCode: {
    fontSize: 18,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#1A1A1A",
  },
  inputHint: {
    fontSize: 12,
    color: "#FFD600",
    fontWeight: "600",
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: "#00FF00",
    height: 64,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#00FF00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginRight: 10,
  },
  registerButtonIcon: {
    fontSize: 22,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#FFD600",
    fontSize: 14,
    fontWeight: "700",
  },
  policyLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  policyText: {
    fontSize: 12,
    color: "#BBB",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#BBB",
    marginHorizontal: 12,
  },
})
