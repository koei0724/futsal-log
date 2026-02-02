import React, { forwardRef, useCallback, useImperativeHandle, useState, useEffect } from 'react'
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants } from '@/constants/Colors'

export interface BottomSheetWrapperRef {
  expand: () => void
  close: () => void
}

interface BottomSheetWrapperProps {
  snapPoints?: string[]
  onClose?: () => void
  children: React.ReactNode
  scrollable?: boolean
}

export const BottomSheetWrapper = forwardRef<BottomSheetWrapperRef, BottomSheetWrapperProps>(
  ({ snapPoints = ['50%'], onClose, children, scrollable = false }, ref) => {
    const colors = useColors()
    const [isOpen, setIsOpen] = useState(false)
    const { height: windowHeight } = useWindowDimensions()

    // Parse snap point percentage to pixels
    const sheetHeight = (() => {
      const snap = snapPoints[0] || '50%'
      const percent = parseInt(snap.replace('%', ''), 10) || 50
      return (windowHeight * percent) / 100
    })()

    useImperativeHandle(ref, () => ({
      expand: () => setIsOpen(true),
      close: () => {
        setIsOpen(false)
        onClose?.()
      },
    }))

    const handleBackdropPress = useCallback(() => {
      setIsOpen(false)
      onClose?.()
    }, [onClose])

    // Handle escape key
    useEffect(() => {
      if (!isOpen) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
          onClose?.()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <View style={StyleSheet.absoluteFill}>
        {/* Backdrop */}
        <Pressable
          style={[styles.backdrop]}
          onPress={handleBackdropPress}
        />

        {/* Sheet */}
        <View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              backgroundColor: colors.card,
              borderTopLeftRadius: StyleConstants.borderRadius.card,
              borderTopRightRadius: StyleConstants.borderRadius.card,
            },
          ]}
        >
          {/* Handle indicator */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.mutedForeground }]} />
          </View>

          {scrollable ? (
            <ScrollView style={styles.content}>{children}</ScrollView>
          ) : (
            <View style={styles.content}>{children}</View>
          )}
        </View>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
})
