import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Activity } from './types'
import { mockActivities as initialActivities } from './mock-data'

const STORAGE_KEY = '@futsal_log:activities'

interface ActivityContextValue {
  activities: Activity[]
  isLoading: boolean
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  getActivityById: (id: string) => Activity | undefined
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load activities from AsyncStorage on mount
  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      console.log('[ACTIVITY CONTEXT] Loading activities from AsyncStorage...')
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Activity[]
        console.log('[ACTIVITY CONTEXT] Loaded', parsed.length, 'activities from storage')
        setActivities(parsed)
      } else {
        // First time: use mock data
        console.log('[ACTIVITY CONTEXT] No stored data, using mock data')
        setActivities(initialActivities)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialActivities))
      }
    } catch (error) {
      console.error('[ACTIVITY CONTEXT] Failed to load activities:', error)
      setActivities(initialActivities)
    } finally {
      setIsLoading(false)
    }
  }

  const saveActivities = async (newActivities: Activity[]) => {
    try {
      console.log('[ACTIVITY CONTEXT] Saving', newActivities.length, 'activities to AsyncStorage...')
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities))
      console.log('[ACTIVITY CONTEXT] ✅ Activities saved successfully!')
    } catch (error) {
      console.error('[ACTIVITY CONTEXT] ❌ Failed to save activities:', error)
    }
  }

  const addActivity = useCallback(async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('[ACTIVITY CONTEXT] addActivity called with data:', data)
    const now = new Date().toISOString()
    const newActivity: Activity = {
      ...data,
      id: `user-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    console.log('[ACTIVITY CONTEXT] New activity created:', newActivity)
    const updatedActivities = [...activities, newActivity]
    console.log('[ACTIVITY CONTEXT] Total activities after add:', updatedActivities.length)
    setActivities(updatedActivities)
    await saveActivities(updatedActivities)
    console.log('[ACTIVITY CONTEXT] addActivity completed!')
  }, [activities])

  const updateActivity = useCallback(async (id: string, data: Partial<Activity>) => {
    console.log('[ACTIVITY CONTEXT] updateActivity called for id:', id)
    console.log('[ACTIVITY CONTEXT] Update data:', data)
    const updatedActivities = activities.map((activity) => {
      if (activity.id === id) {
        return {
          ...activity,
          ...data,
          updatedAt: new Date().toISOString(),
        }
      }
      return activity
    })
    console.log('[ACTIVITY CONTEXT] Activities after update:', updatedActivities.length)
    setActivities(updatedActivities)
    await saveActivities(updatedActivities)
    console.log('[ACTIVITY CONTEXT] updateActivity completed!')
  }, [activities])

  const deleteActivity = useCallback(async (id: string) => {
    console.log('[ACTIVITY CONTEXT] deleteActivity called for id:', id)
    const updatedActivities = activities.filter((activity) => activity.id !== id)
    console.log('[ACTIVITY CONTEXT] Activities after delete:', updatedActivities.length)
    setActivities(updatedActivities)
    await saveActivities(updatedActivities)
    console.log('[ACTIVITY CONTEXT] deleteActivity completed!')
  }, [activities])

  const getActivityById = useCallback((id: string) => {
    return activities.find((a) => a.id === id)
  }, [activities])

  return (
    <ActivityContext.Provider value={{
      activities,
      isLoading,
      addActivity,
      updateActivity,
      deleteActivity,
      getActivityById
    }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivities() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider')
  }
  return context
}
