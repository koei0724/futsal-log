import React from 'react'
import { View, Text, Pressable, type ViewStyle, type PressableProps } from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  const colors = useColors()

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: StyleConstants.borderRadius.card,
          padding: 16,
          ...StyleConstants.shadow.light,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

interface PressableCardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode
  style?: ViewStyle
}

export function PressableCard({ children, style, ...props }: PressableCardProps) {
  const colors = useColors()

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: colors.card,
          borderRadius: StyleConstants.borderRadius.card,
          padding: 16,
          opacity: pressed ? 0.8 : 1,
          ...StyleConstants.shadow.light,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View
      style={[
        {
          marginBottom: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function CardTitle({ children, style }: CardTitleProps) {
  const colors = useColors()

  return (
    <Text
      style={[
        {
          fontSize: 18,
          fontWeight: '600',
          color: colors.cardForeground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

interface CardDescriptionProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const colors = useColors()

  return (
    <Text
      style={[
        {
          fontSize: 14,
          color: colors.mutedForeground,
          marginTop: 4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

interface CardContentProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={style}>{children}</View>
}

interface CardFooterProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
