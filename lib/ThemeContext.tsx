import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { darkColors, lightColors, type ThemeColors, type ColorScheme } from '@/constants/Colors'

const THEME_STORAGE_KEY = '@futsal_log_theme'

interface ThemeContextValue {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  isDark: boolean
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('system')
  const [isLoaded, setIsLoaded] = useState(false)

  // AsyncStorage에서 테마 설정 불러오기
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setColorSchemeState(savedTheme as ColorScheme)
        }
      } catch (error) {
        console.error('Failed to load theme:', error)
      } finally {
        setIsLoaded(true)
      }
    }
    loadTheme()
  }, [])

  // 테마 설정 저장
  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }, [])

  // 현재 다크모드 여부 계산
  const isDark = colorScheme === 'system'
    ? systemColorScheme === 'dark'
    : colorScheme === 'dark'

  // 현재 테마 색상
  const colors = isDark ? darkColors : lightColors

  // 초기 로딩 중에는 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function useColors() {
  const { colors } = useTheme()
  return colors
}
