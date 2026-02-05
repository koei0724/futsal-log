import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CustomActivityType } from './types'

const CUSTOM_TYPES_STORAGE_KEY = '@futsal_log:custom_types'

// 기본 활동 유형 정의
const defaultActivityTypes: CustomActivityType[] = [
  { id: 'training', label: '훈련', iconName: 'training', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'training' },
  { id: 'match', label: '경기', iconName: 'match', borderColor: '#F9A8D4', bgColor: '#FFF8FC', enabled: true, recordType: 'match' },
  { id: 'plab', label: '플랩', iconName: 'plab', borderColor: '#F9A8D4', bgColor: '#FFF8FC', enabled: true, recordType: 'match' },
  { id: 'other', label: '뒷연습', iconName: 'other', borderColor: '#FDE68A', bgColor: '#FFFEF8', enabled: true, recordType: 'training' },
  { id: 'teamkakao', label: '팀카카오', iconName: 'teamkakao', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'match' },
  { id: 'lesson', label: '개인레슨', iconName: 'lesson', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'training' },
]

interface CustomTypesContextValue {
  customTypes: CustomActivityType[]
  isLoading: boolean
  getTypeById: (id: string) => CustomActivityType | undefined
  getEnabledTypes: () => CustomActivityType[]
  refreshTypes: () => Promise<void>
}

const CustomTypesContext = createContext<CustomTypesContextValue | undefined>(undefined)

export function CustomTypesProvider({ children }: { children: React.ReactNode }) {
  const [customTypes, setCustomTypes] = useState<CustomActivityType[]>(defaultActivityTypes)
  const [isLoading, setIsLoading] = useState(true)

  const loadTypes = useCallback(async () => {
    try {
      console.log('[CUSTOM TYPES] Loading custom types from AsyncStorage...')
      const stored = await AsyncStorage.getItem(CUSTOM_TYPES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CustomActivityType[]
        console.log('[CUSTOM TYPES] Loaded', parsed.length, 'custom types')
        setCustomTypes(parsed)
      } else {
        console.log('[CUSTOM TYPES] No stored types, using defaults')
        setCustomTypes(defaultActivityTypes)
      }
    } catch (error) {
      console.error('[CUSTOM TYPES] Failed to load custom types:', error)
      setCustomTypes(defaultActivityTypes)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTypes()
  }, [loadTypes])

  const refreshTypes = useCallback(async () => {
    await loadTypes()
  }, [loadTypes])

  const getTypeById = useCallback((id: string) => {
    return customTypes.find((t) => t.id === id)
  }, [customTypes])

  const getEnabledTypes = useCallback(() => {
    return customTypes.filter((t) => t.enabled)
  }, [customTypes])

  return (
    <CustomTypesContext.Provider
      value={{
        customTypes,
        isLoading,
        getTypeById,
        getEnabledTypes,
        refreshTypes,
      }}
    >
      {children}
    </CustomTypesContext.Provider>
  )
}

export function useCustomTypes() {
  const context = useContext(CustomTypesContext)
  if (context === undefined) {
    throw new Error('useCustomTypes must be used within a CustomTypesProvider')
  }
  return context
}
