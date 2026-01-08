import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Welcome'
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login'
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Register'
          }} 
        />
        <Stack.Screen 
          name="stats" 
          options={{ 
            title: 'Statistics'
          }} 
        />
        <Stack.Screen 
          name="add-entry" 
          options={{ 
            title: 'Add Entry'
          }} 
        />
        <Stack.Screen 
          name="invite" 
          options={{ 
            title: 'Invite'
          }} 
        />
        <Stack.Screen 
          name="page" 
          options={{ 
            title: 'Page'
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            title: 'Home'
          }} 
        />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
