import React from 'react'
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const colors = useColors()

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={[
          {
            height: 44,
            backgroundColor: colors.input,
            borderRadius: StyleConstants.borderRadius.input,
            paddingHorizontal: 12,
            fontSize: 16,
            color: colors.foreground,
            borderWidth: 1,
            borderColor: error ? colors.destructive : colors.border,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.destructive,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  )
}

interface TextAreaProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export function TextArea({
  label,
  error,
  containerStyle,
  style,
  ...props
}: TextAreaProps) {
  const colors = useColors()

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.mutedForeground}
        style={[
          {
            minHeight: 100,
            backgroundColor: colors.input,
            borderRadius: StyleConstants.borderRadius.input,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.foreground,
            borderWidth: 1,
            borderColor: error ? colors.destructive : colors.border,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.destructive,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  )
}
