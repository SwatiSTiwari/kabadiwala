"use client"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native"
import { useRouter } from "expo-router"

export default function InviteScreen() {
  const router = useRouter()

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
        <Text style={styles.subtitle}>Is QR code ko scan karwayein taaki naya saathi aapke network mein jud sake.</Text>

        <View style={styles.qrCard}>
          <Text style={styles.cardHeader}>INVITE CODE</Text>
          <View style={styles.qrContainer}>
            <View style={styles.qrFrame}>
              <Image
                source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KB-8832" }}
                style={styles.qrImage}
              />
            </View>
          </View>
          <Text style={styles.invitationIdLabel}>Invitation ID</Text>
          <View style={styles.idBox}>
            <Text style={styles.idText}>KB - 8832</Text>
            <TouchableOpacity>
              <Text>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Ya link share karein:</Text>
          <TouchableOpacity style={styles.whatsappBtn}>
            <Text style={styles.whatsappIcon}>💬</Text>
            <Text style={styles.whatsappText}>WhatsApp pe Link Bhejein</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>📥 Save Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>🔗 Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Camera kaam nahi kar raha?</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>::: Number se jodein</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backIcon: { fontSize: 24 },
  content: { padding: 24, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginTop: 12, lineHeight: 20 },
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
  cardHeader: { fontSize: 12, fontWeight: "800", color: "#FBC02D", letterSpacing: 1, marginBottom: 24 },
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
  shareTitle: { fontSize: 14, fontWeight: "700", color: "#1A1A1A", textAlign: "center", marginBottom: 16 },
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
})
