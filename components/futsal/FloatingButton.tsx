import React from 'react'
import { Pressable, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { type ThemeColors } from '@/constants/Colors'

interface FloatingButtonProps {
  href?: string
  onPress?: () => void
}

export function FloatingButton({ href, onPress }: FloatingButtonProps) {
  const router = useRouter()
  const colors = useColors()
  const { isDark } = useTheme()
  const styles = createStyles(colors, isDark)

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else if (href) {
      router.push(href as any)
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={handlePress}
    >
      <Plus color={colors.primaryForeground} size={24} />
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 72 : 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: isDark ? '#000000' : '#9CA3AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.4 : 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
})
