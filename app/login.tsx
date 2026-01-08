"use client"

// naya entry screen 
// histiry - pichala hisaab screen
// profile screen - profile pic change
//=====================. working finished =====================

import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Logo from "../assets/images/logo.png"



const { height } = Dimensions.get("window")

export default function LoginScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.loginHero}>
        <Image
          source={Logo}
          style={styles.heroImage}
        />
        <View style={styles.recycleIconContainer}>
          <Text style={styles.recycleIcon}>♻️</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Kabaadi App</Text>
        </View>

        <Text style={styles.loginHeader}>
          Namaste!{"\n"}Login karein
        </Text>
        <Text style={styles.loginSubheader}>
          Apni dukan ka digital hisaab shuru karein.
        </Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Mobile number daalo</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <Text style={styles.placeholderText}>98765 43210</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.buttonText}  >OTP bhejo</Text>
          <Text style={styles.buttonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loginHero: {
    height: height * 0.35,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  recycleIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  recycleIcon: {
    fontSize: 18,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  badge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeText: {
    color: "#F57F17",
    fontSize: 12,
    fontWeight: "600",
  },
  loginHeader: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  loginSubheader: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  inputSection: {
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  countryCode: {
    fontSize: 18,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },
  placeholderText: {
    fontSize: 18,
    color: "#BBB",
  },
  mainButton: {
    backgroundColor: "#2E7D32",
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonIcon: {
    color: "white",
    fontSize: 20,
  },
})
