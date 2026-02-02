import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants } from '@/constants/Colors'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  onClose?: () => void
}

export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const colors = useColors()

  const formatDateForInput = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <View style={styles.container}>
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={(e) => {
          const newDate = new Date(e.target.value + 'T00:00:00')
          if (!isNaN(newDate.getTime())) {
            onChange(newDate)
          }
          onClose?.()
        }}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          borderRadius: StyleConstants.borderRadius.input,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.muted,
          color: colors.foreground,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
})
