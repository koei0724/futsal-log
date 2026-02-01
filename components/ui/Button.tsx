import React from 'react'
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

const getVariantStyles = (colors: ThemeColors): Record<ButtonVariant, ViewStyle> => ({
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
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
})

const getVariantTextColors = (colors: ThemeColors): Record<ButtonVariant, string> => ({
  default: colors.primaryForeground,
  secondary: colors.secondaryForeground,
  outline: colors.foreground,
  ghost: colors.foreground,
  destructive: colors.destructiveForeground,
})

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: {
    height: 44,
    paddingHorizontal: 16,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  lg: {
    height: 52,
    paddingHorizontal: 24,
  },
  icon: {
    height: 44,
    width: 44,
    paddingHorizontal: 0,
  },
}

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  default: {
    fontSize: 14,
  },
  sm: {
    fontSize: 12,
  },
  lg: {
    fontSize: 16,
  },
  icon: {
    fontSize: 14,
  },
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  children,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const colors = useColors()
  const variantStyles = getVariantStyles(colors)
  const variantTextColors = getVariantTextColors(colors)
  const isDisabled = disabled || loading

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: StyleConstants.borderRadius.button,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          ...StyleConstants.shadow.light,
        },
        variantStyles[variant],
        sizeStyles[size],
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantTextColors[variant]}
        />
      ) : typeof children === 'string' ? (
        <Text
          style={[
            {
              fontWeight: '600',
              color: variantTextColors[variant],
            },
            sizeTextStyles[size],
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
