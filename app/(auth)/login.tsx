"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Logo from "../../assets/images/logo.png"


const { height } = Dimensions.get("window")


export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter phone and password")
      return
    }

    setLoading(true)
    try {
      console.log('Starting login...')
      await signIn(phone, password)
      console.log('Login successful, navigating to home')
      router.replace("/(tabs)/home")
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : "Please try again"
      Alert.alert("Login Nahi Hua", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginHero}>
            <Image
              source={Logo}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.recycleIconContainer}>
              <Text style={styles.recycleIcon}>♻️</Text>
            </View>
          </View>

          <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Kabaadi App</Text>
        </View>

        <Text style={styles.loginHeader}>Namaste!{"\n"}Login karein</Text>
        <Text style={styles.loginSubheader}>Apni dukan ka digital hisaab shuru karein.</Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Mobile number daalo</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="98765 43210"
              placeholderTextColor="#BBB"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#BBB"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.mainButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login karein"}</Text>
          <Text style={styles.buttonIcon}>→</Text>
        </TouchableOpacity>

        <View style={styles.loginFooter}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>🔒 Hum aapka number safe rakhenge.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.helpText}>Naya account banayein?</Text>
          </TouchableOpacity>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loginHero: {
    height: height * 0.35,
    width: "100%",
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
    paddingBottom: 40,
  },
  badge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  badgeText: {
    color: "#F57F17",
    fontSize: 12,
    fontWeight: "600",
  },
  loginHeader: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 40,
  },
  loginSubheader: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  inputSection: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
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
    color: "#666",
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
  mainButton: {
    backgroundColor: "#2E7D32",
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  loginFooter: {
    marginTop: "auto",
    alignItems: "center",
    paddingBottom: 20,
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
  },
  helpText: {
    fontSize: 14,
    color: "#FFD600",
    fontWeight: "600",
  },
})
