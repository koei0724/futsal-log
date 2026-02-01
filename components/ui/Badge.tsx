import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  color?: string
}

const getVariantStyles = (colors: ThemeColors): Record<BadgeVariant, ViewStyle> => ({
  default: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
})

const getVariantTextColors = (colors: ThemeColors): Record<BadgeVariant, string> => ({
  default: colors.primaryForeground,
  secondary: colors.secondaryForeground,
  outline: colors.foreground,
  destructive: colors.destructiveForeground,
})

export function Badge({
  variant = 'default',
  children,
  style,
  textStyle,
  color,
}: BadgeProps) {
  const colors = useColors()
  const variantStyles = getVariantStyles(colors)
  const variantTextColors = getVariantTextColors(colors)

  return (
    <View
      style={[
        {
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: StyleConstants.borderRadius.badge,
          alignSelf: 'flex-start',
        },
        variantStyles[variant],
        color ? { backgroundColor: color } : undefined,
        style,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: '500',
            color: color ? '#FFFFFF' : variantTextColors[variant],
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  )
}
