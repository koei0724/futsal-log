import '../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Platform, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider, useTheme } from '@/lib/ThemeContext'

function RootLayoutContent() {
  const { isDark, colors } = useTheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[
        styles.outerContainer,
        { backgroundColor: Platform.OS === 'web' ? (isDark ? '#0a0a0a' : '#F3F4F6') : colors.background },
      ]}>
        <View style={[
          styles.innerContainer,
          { backgroundColor: colors.background },
          Platform.OS === 'web' && styles.webContainer,
        ]}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="record/new"
              options={{
                presentation: Platform.OS === 'web' ? undefined : 'modal',
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="record/[id]"
              options={{
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
              }}
            />
          </Stack>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  webContainer: {
    maxWidth: 480,
    // Web shadow for the centered container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
})
