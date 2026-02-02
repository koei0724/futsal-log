import React from 'react'
import { Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  onClose?: () => void
}

export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        if (Platform.OS !== 'ios') {
          onClose?.()
        }
        if (selectedDate) {
          onChange(selectedDate)
        }
      }}
    />
  )
}
