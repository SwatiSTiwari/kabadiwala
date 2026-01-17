"use client"

import { Stack } from "expo-router"
import { AuthProvider, useAuth } from "@/lib/auth-context"

function RootNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    // Show splash while checking auth state
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    )
  }

  // Show tabs if authenticated, auth if not
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-entry" />
          <Stack.Screen name="stats" />
          <Stack.Screen name="invite" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}
