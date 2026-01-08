import { Tabs } from "expo-router"
import { Text } from "react-native"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#BBB",
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#EEE",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Hisaab",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📒</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tabs>
  )
}
