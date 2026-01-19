"use client";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InviteScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Update this with your actual app URL (Play Store, App Store, or custom domain)
  const APP_URL = "https://kabadihisaab.app"; // or your actual app link
  const APP_NAME = "Kabadi Hisaab";

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(APP_URL);
      setCopied(true);
      Alert.alert("Link Copied!", "App link clipboard mein copy ho gaya hai");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      Alert.alert("Error", "Link copy nahi ho saka");
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      const message = `🗑️ *${APP_NAME} - Digital Kabadi Hisaab*\n\nApne kabadi ka hisaab ab digital rakho!\n\n✅ Roz ka hisaab\n✅ Total earnings\n✅ Excel export\n\nApp download karein:\n${APP_URL}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert("WhatsApp not found", "WhatsApp app install karein");
      }
    } catch (error) {
      Alert.alert("Error", "WhatsApp nahi khul saka");
    }
  };

  const handleDownloadQR = () => {
    Alert.alert(
      "Download QR Code",
      "QR code ko screenshot le kar save kar sakte hain, ya WhatsApp se share karein",
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saathi Jodein</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Naye Kabadiwala ko Jodein</Text>
        <Text style={styles.subtitle}>
          Is QR code ko scan karwayein taaki naya saathi aapke network mein jud
          sake.
        </Text>

        <View style={styles.qrCard}>
          <Text style={styles.cardHeader}>INVITE CODE</Text>
          <View style={styles.qrContainer}>
            <View style={styles.qrFrame}>
              <Image
                source={{
                  uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(APP_URL)}`,
                }}
                style={styles.qrImage}
              />
            </View>
          </View>
          <Text style={styles.invitationIdLabel}>App Download Link</Text>
          <View style={styles.idBox}>
            <Text style={styles.idText} numberOfLines={1}>
              {APP_URL}
            </Text>
            <TouchableOpacity onPress={handleCopyLink}>
              <FontAwesome
                name={copied ? "check-circle" : "clipboard"}
                size={20}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Ya link share karein:</Text>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleWhatsAppShare}
          >
            <FontAwesome
              name="whatsapp"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.whatsappText}>WhatsApp pe Link Bhejein</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleDownloadQR}
            >
              <FontAwesome
                name="download"
                size={16}
                color="#827717"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "#827717", fontWeight: "600" }}>
                Save QR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCopyLink}>
              <FontAwesome
                name={copied ? "check" : "link"}
                size={16}
                color="#827717"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "#827717", fontWeight: "600" }}>
                {copied ? "Copied!" : "Copy Link"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Kisi ka QR code scan karna hai?</Text>
          <TouchableOpacity onPress={() => router.push("/scan-qr")}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
              }}
            >
              <FontAwesome name="camera" size={16} color="#FBC02D" />
              <Text style={styles.footerLink}>QR Scan Karein</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backIcon: { fontSize: 24 },
  content: { padding: 24, flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  qrCard: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: 24,
    padding: 24,
    marginTop: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FBC02D",
    letterSpacing: 1,
    marginBottom: 24,
  },
  qrContainer: {
    width: 220,
    height: 220,
    backgroundColor: "#FFE0B2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  qrFrame: { backgroundColor: "white", padding: 16, borderRadius: 12 },
  qrImage: { width: 140, height: 140 },
  invitationIdLabel: { fontSize: 12, color: "#999", marginTop: 24 },
  idBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  idText: { fontSize: 18, fontWeight: "700", marginRight: 12 },
  shareSection: { width: "100%", marginTop: 32 },
  shareTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 16,
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  whatsappIcon: { fontSize: 20, color: "white" },
  whatsappText: { color: "white", fontSize: 16, fontWeight: "700" },
  secondaryActions: { flexDirection: "row", gap: 12, marginTop: 12 },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FFF9C4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  footer: { marginTop: 40, alignItems: "center" },
  footerText: { color: "#999", fontSize: 13 },
  footerLink: { color: "#FBC02D", fontWeight: "700", marginTop: 8 },
});
