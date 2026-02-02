import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet'
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
    const bottomSheetRef = useRef<BottomSheet>(null)

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }))

    const handleClose = useCallback(() => {
      onClose?.()
    }, [onClose])

    const Content = scrollable ? BottomSheetScrollView : BottomSheetView

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleClose}
        backgroundStyle={{
          backgroundColor: colors.card,
          borderRadius: StyleConstants.borderRadius.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.mutedForeground,
        }}
      >
        <Content>{children}</Content>
      </BottomSheet>
    )
  }
)
